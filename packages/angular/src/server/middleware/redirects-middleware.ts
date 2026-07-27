import {
  breakDownPath,
  isAbsoluteTarget,
  matchFromRedirectMapRedirect,
  matchRedirectItemRedirect,
  processAbsoluteUrlTarget,
  processRelativeUrlTarget,
  resolveRedirectTarget,
  RedirectResult,
  RedirectsService,
  RedirectsServiceConfig,
  REDIRECT_TYPE_301,
  REDIRECT_TYPE_302,
  REDIRECT_TYPE_SERVER_TRANSFER,
  SITE_KEY,
  SiteInfo,
  SiteResolver,
} from '@sitecore-content-sdk/content/site';
import { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { createGraphQLClientFactory } from '@sitecore-content-sdk/content/client';
import {
  BaseMiddlewareOptions,
  CsdkExpressRequest,
  ExpressMiddleware,
  ExpressNextFunction,
  ExpressRequest,
  ExpressResponse,
} from './models';
import { getMiddlewareRequest, isDataLoaderRequest, shouldProcessPath } from './utils';
import { splitLocaleFromPath } from '../../i18n/locale-utils';
import { isEditingPreview } from '../utils';
import type { LoaderApiResponse, LoaderPayload } from '../../loaders/models';
import debug from '../../debug';

/**
 * Configuration for the redirects middleware.
 * @public
 */
export type RedirectsMiddlewareOptions = BaseMiddlewareOptions &
  Omit<RedirectsServiceConfig, 'fetch' | 'clientFactory'> &
  Partial<SitecoreConfig['api']['edge']> &
  Partial<NonNullable<SitecoreConfig['api']['local']>> &
  SitecoreConfig['redirects'] & {
    /** Fallback language when the request path has no locale prefix. Default is `'en'`. */
    defaultLanguage?: string;
    /** Fallback site name when not resolved by the multisite middleware or site cookie. */
    defaultSite?: string;
    /** Sites used to resolve the site's default language for the `$siteLang` token. */
    sites?: SiteInfo[];
    /** Override the redirects service instance (e.g. for testing). */
    redirectsService?: RedirectsService;
  };

const isPrefetch = (req: ExpressRequest): boolean =>
  [req.headers?.purpose, req.headers?.['sec-purpose']].some(
    (header) => typeof header === 'string' && header.includes('prefetch')
  );

/**
 * Serializes an Express query object back into a query string (without a leading `?`).
 * @param {Record<string, string | string[] | undefined>} query - Express query object.
 * @returns {string} Query string.
 */
const serializeQuery = (query: Record<string, string | string[] | undefined>): string => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, entry));
    } else {
      params.append(key, value);
    }
  }
  return params.toString();
};

/**
 * Builds the redirects service from the middleware options, mirroring the Next.js proxy:
 * uses an injected service when provided, otherwise requires Edge (contextId/clientContextId) or
 * local (apiHost/apiKey) API config. Returns `null` (disabling the middleware) when neither is set.
 * @param {RedirectsMiddlewareOptions} options - Middleware options.
 * @returns {RedirectsService | null} The redirects service or `null` when not configured.
 */
const resolveRedirectsService = (options: RedirectsMiddlewareOptions): RedirectsService | null => {
  if (options.redirectsService) {
    return options.redirectsService;
  }

  const hasEdgeConfig = !!(options.contextId || options.clientContextId);
  const hasLocalConfig = !!(options.apiHost && options.apiKey);

  if (!hasEdgeConfig && !hasLocalConfig) {
    console.warn(
      '[RedirectsMiddleware] Redirects middleware requires either Edge configuration (contextId/clientContextId) or local API configuration (apiHost/apiKey). ' +
        'Redirects features will be disabled. This is expected when API configuration is not available.'
    );
    return null;
  }

  const graphQLOptions = {
    api: {
      edge: {
        contextId: options.contextId!,
        clientContextId: options.clientContextId,
        edgeUrl: options.edgeUrl,
      },
      ...(options.apiHost && options.apiKey
        ? {
            local: {
              apiHost: options.apiHost,
              apiKey: options.apiKey,
              path: options.path,
            },
          }
        : {}),
    },
  };

  return new RedirectsService({
    ...options,
    clientFactory: createGraphQLClientFactory(graphQLOptions),
    fetch: fetch,
  });
};

/**
 * Middleware to support Sitecore redirects on the Angular Express SSR server.
 *
 * Fetches redirects for the resolved site, matches the incoming request against locale-versioned
 * and redirect-map (static/regex) rules using the shared redirect utilities, and dispatches a
 * 301/302 redirect or an internal server-transfer rewrite. Fails open (`next()`) on any error so a
 * misconfigured redirect never takes the site down.
 *
 * Must run after the multisite middleware (which resolves `scParams.siteName`) and before the
 * Angular SSR handler.
 * @param {RedirectsMiddlewareOptions} options - Redirects middleware options.
 * @returns {ExpressMiddleware} Express middleware.
 * @public
 */
export function createRedirectsMiddleware(options: RedirectsMiddlewareOptions): ExpressMiddleware {
  const redirectsService = resolveRedirectsService(options);
  const locales = options.locales ?? [];
  const siteResolver = new SiteResolver(options.sites ?? []);

  return async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    try {
      // `enabled` defaults to true: omitting it keeps the middleware on (see BaseMiddlewareOptions).
      if (options.enabled === false || !redirectsService) {
        debug.redirects('redirects middleware disabled or not configured');
        return next();
      }

      // For browser loader navigations (/_data) routing data comes from the loader payload, not
      // the request; getMiddlewareRequest normalizes both into path/query/data.
      const { path, query, data } = getMiddlewareRequest(req);

      if (isEditingPreview(data.headers)) {
        debug.redirects('skipped (editing/preview mode)');
        return next();
      }

      // Path matching also covers static files (paths with an extension), API and Sitecore routes.
      if (!shouldProcessPath(path, options.matcher)) {
        debug.redirects('redirects middleware skipped (path does not match)');
        return next();
      }

      if (options.skip?.(req)) {
        debug.redirects('redirects middleware skipped (skip predicate)');
        return next();
      }

      if (isPrefetch(req)) {
        // Don't burden the redirects service with prefetch traffic; disable caching so the
        // real navigation still evaluates redirects.
        debug.redirects('skipped (prefetch)');
        res.setHeader?.('x-proxy-cache', 'no-cache');
        res.setHeader?.('Cache-Control', 'no-store, must-revalidate');
        return next();
      }

      const startTimestamp = Date.now();
      const { locale } = splitLocaleFromPath(path, locales);
      const language = locale || options.defaultLanguage || 'en';
      const siteName =
        (req as CsdkExpressRequest).scParams?.siteName ||
        data.cookies?.[SITE_KEY] ||
        options.defaultSite;

      debug.redirects('redirects middleware start: %o', { path, language, siteName });

      if (!siteName) {
        debug.redirects('skipped (site could not be resolved)');
        return next();
      }

      const incomingURL = path;
      const incomingQS = serializeQuery(query);

      const existsRedirect = await getExistsRedirect(
        redirectsService,
        siteName,
        language,
        locales,
        incomingURL,
        incomingQS
      );

      if (!existsRedirect) {
        debug.redirects('skipped (redirect does not exist)');
        return next();
      }

      debug.redirects('Matched redirect rule: %o', { existsRedirect });

      const incomingPathData = breakDownPath(locales, incomingURL);
      incomingPathData.queryString = incomingQS || undefined;

      // Site's default language drives the `$siteLang` token; fall back to the request language.
      const siteLanguage = siteResolver.getByName(siteName)?.language || language;
      existsRedirect.target = resolveRedirectTarget(existsRedirect, siteLanguage, incomingURL);

      // Browser loader navigations (POST/GET /_data) can't be driven by an HTTP redirect: the
      // client fetch would silently follow it. For those we answer through the loader-data channel
      // so the client-side router performs the navigation (see dispatchRedirect).
      const loaderDataRequest = isDataLoaderRequest(req);

      if (isAbsoluteTarget(existsRedirect.target)) {
        const targetUrl = processAbsoluteUrlTarget(incomingPathData, existsRedirect);
        dispatchRedirect(
          targetUrl,
          existsRedirect.redirectType,
          req,
          res,
          next,
          true,
          loaderDataRequest
        );
      } else {
        const { targetLocale, targetPath } = processRelativeUrlTarget(
          incomingPathData,
          existsRedirect,
          locales,
          language
        );
        // Angular is locale-in-path, but a locale-less request must stay locale-less when the
        // target resolves to the same locale (e.g. `isLanguagePreserved` on a `/foo` → `/bar`
        // rule). Only prefix the locale segment when the origin was already locale-prefixed, or
        // the target locale actually differs from the request locale.
        const incomingHadLocale = !!incomingPathData.locale;
        const localeChanged = targetLocale.toLowerCase() !== language.toLowerCase();
        const shouldPrefixLocale =
          !!targetLocale && locales.length > 0 && (incomingHadLocale || localeChanged);
        const finalPath = shouldPrefixLocale ? `/${targetLocale}${targetPath}` : targetPath;
        dispatchRedirect(
          finalPath,
          existsRedirect.redirectType,
          req,
          res,
          next,
          false,
          loaderDataRequest
        );
      }

      debug.redirects('redirects middleware end in %dms', Date.now() - startTimestamp);
    } catch (error) {
      console.log('Redirects middleware failed:');
      console.log(error);
      next();
    }
  };
}

/**
 * Finds a matching redirect for the incoming request, mirroring `RedirectsProxy.getExistsRedirect`:
 * locale-versioned item rules take precedence over redirect-map (static/regex) rules.
 * @param {RedirectsService} service - Redirects service.
 * @param {string} siteName - Resolved site name.
 * @param {string} language - Request language used to match versioned rules.
 * @param {string[]} locales - Configured locales.
 * @param {string} incomingURL - Request pathname (no query string).
 * @param {string} incomingQS - Request query string (without leading `?`).
 * @returns {Promise<RedirectResult | undefined>} Matched redirect or `undefined`.
 */
async function getExistsRedirect(
  service: RedirectsService,
  siteName: string,
  language: string,
  locales: string[],
  incomingURL: string,
  incomingQS: string
): Promise<RedirectResult | undefined> {
  const redirects = await service.fetchRedirects(siteName);

  // strip trailing slashes and lowercase to compare against locale-less patterns
  const normalizedPath = incomingURL.replace(/\/*$/gi, '').toLowerCase();
  const { nonLocalePath } = breakDownPath(locales, normalizedPath);
  const matchedLocaleRedirect = matchRedirectItemRedirect(redirects, language, nonLocalePath);
  if (matchedLocaleRedirect) {
    return matchedLocaleRedirect;
  }

  const incomingPathData = breakDownPath(locales, incomingURL);
  incomingPathData.queryString = incomingQS || undefined;
  return matchFromRedirectMapRedirect(redirects, language, incomingPathData);
}

/**
 * Rewrites the loader request URL for a `/_data` navigation so the loader-data-service middleware
 * resolves the target route's data (server-transfer / silent rewrite — the browser URL is unchanged).
 * @param {ExpressRequest} req - Incoming `/_data` request.
 * @param {string} target - Target loader URL (path with optional query string).
 */
function setLoaderRequestUrl(req: ExpressRequest, target: string): void {
  if (req.method === 'POST' && req.body && typeof req.body === 'object') {
    (req.body as LoaderPayload).url = target;
  } else if (req.method === 'GET') {
    req.query = { ...req.query, url: target };
  }
}

/**
 * Dispatches the resolved redirect through the right channel.
 *
 * Regular page requests:
 * - 301/302 → `res.redirect(status, target)`.
 * - SERVER_TRANSFER (internal) → rewrite `req.url`/`req.path` + `next()` so the SSR handler renders
 *   the target route without changing the browser URL.
 *
 * Browser loader navigations (`/_data`) can't follow an HTTP redirect, so they answer through the
 * loader-data envelope instead:
 * - 301/302 → `{ kind: 'redirect' }` so the client router navigates (internal) or the page reloads
 *   (external, via `applyRedirect`).
 * - SERVER_TRANSFER (internal) → rewrite the loader payload URL + `next()` so the loader-data-service
 *   returns the target route's data while the browser URL stays put.
 *
 * External absolute targets can't be internally transferred, so SERVER_TRANSFER to an external URL
 * falls back to a temporary (302) redirect.
 * @param {string} target - Final redirect target (absolute URL or path).
 * @param {string} type - Redirect type constant.
 * @param {ExpressRequest} req - Incoming request.
 * @param {ExpressResponse} res - Response.
 * @param {ExpressNextFunction} next - Next function.
 * @param {boolean} isExternal - Whether the target is an external absolute URL.
 * @param {boolean} isDataRequest - Whether this is a `/_data` loader navigation.
 */
function dispatchRedirect(
  target: string,
  type: string,
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction,
  isExternal: boolean,
  isDataRequest: boolean
): void {
  const respondRedirect = (status: number): void => {
    if (isDataRequest) {
      const payload: LoaderApiResponse = {
        kind: 'redirect',
        redirect: { loaderRedirectTarget: target, status },
      };
      res.json(payload);
      return;
    }
    res.redirect?.(status, target);
  };

  switch (type) {
    case REDIRECT_TYPE_301:
      respondRedirect(301);
      return;
    case REDIRECT_TYPE_302:
      respondRedirect(302);
      return;
    case REDIRECT_TYPE_SERVER_TRANSFER: {
      // External targets can't be rewritten internally; fall back to a temporary redirect.
      if (isExternal) {
        respondRedirect(302);
        return;
      }
      // Internal rewrite: render the target route without changing the browser URL.
      if (isDataRequest) {
        setLoaderRequestUrl(req, target);
      } else {
        const [pathname] = target.split('?');
        req.url = target;
        req.path = pathname;
      }
      next();
      return;
    }
    default:
      next();
  }
}
