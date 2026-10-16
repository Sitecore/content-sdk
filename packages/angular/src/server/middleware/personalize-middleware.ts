import {
  CdpHelper,
  DEFAULT_VARIANT,
  encodePersonalizeTokensHeader,
  getGroomedVariantIds,
  PersonalizeInfo,
  PersonalizeService,
  PERSONALIZE_TOKENS_HEADER_MAX_BYTES,
  TokenMap,
} from '@sitecore-content-sdk/content/personalize';
import {
  clampEncodedTokenMap,
  collectPersonalizeExecutionTokens,
  createEmptyTokenMap,
  PERSONALIZE_SCPARAMS_ENVELOPE_MAX_BYTES,
  tokenMapHasUsableVisitorValues,
} from '@sitecore-content-sdk/content/personalize/internal';
import { SITE_KEY } from '@sitecore-content-sdk/content/site';
import { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { createGraphQLClientFactory } from '@sitecore-content-sdk/content/client';
import { initContentSdk } from '@sitecore-content-sdk/core';
import { analyticsPlugin, analyticsServerAdapter } from '@sitecore-content-sdk/analytics-core';
import { BOT_DETECTION_COOKIE } from '@sitecore-content-sdk/analytics-core/internal';
import {
  personalize,
  personalizeServerPlugin,
  personalizeServerAdapter,
} from '@sitecore-content-sdk/personalize';
import {
  CsdkExpressRequest,
  ExpressMiddleware,
  ExpressNextFunction,
  ExpressResponse,
  BaseMiddlewareOptions,
  ExpressRequest,
} from './models';
import { splitLocaleFromPath } from '../../i18n/locale-utils';
import { SC_PARAMS_HEADER } from '../../loaders/constants';
import { getMiddlewareRequest, shouldProcessPath, toNodeAdapterPair } from './utils';
import debug from '../../debug';
import { isEditingPreview } from '../utils';

/**
 * Object model of Experience Context data
 * @public
 */
export type ExperienceParams = {
  referrer: string;
  utm: {
    [key: string]: string | undefined;
    campaign: string | undefined;
    source: string | undefined;
    medium: string | undefined;
    content: string | undefined;
  };
};

/**
 * Represents the geolocation data used for personalization
 * @public
 */
export type PersonalizeGeoData = {
  city?: string;
  country?: string;
  region?: string;
};

/**
 * Configuration for the personalize middleware
 * @public
 */
export type PersonalizeMiddlewareOptions = BaseMiddlewareOptions &
  Partial<SitecoreConfig['personalize']> &
  Partial<SitecoreConfig['api']['edge']> & {
    /** Locales used to extract the language from the request path */
    locales?: string[];
    /** Fallback language when the request path has no locale prefix. Default is `'en'` */
    defaultLanguage?: string;
    /** Fallback site name when not resolved by the multisite middleware or site cookie */
    defaultSite?: string;
    /** Override the personalize service instance */
    personalizeService?: PersonalizeService;
    /** Get extra UTM parameters from the request */
    getExtraUtmParams?: (req: ExpressRequest) => Partial<ExperienceParams['utm']>;
    /** Extract geolocation data from the request */
    extractGeoDataCb?: (req: ExpressRequest) => Promise<PersonalizeGeoData> | PersonalizeGeoData;
    /**
     * Skip personalization for bot requests marked by the bot tracking middleware. Default `true`.
     */
    skipForBot?: boolean;
  };

type PersonalizeExecution = {
  friendlyId: string;
  variantIds: string[];
};

const isPrefetch = (req: ExpressRequest): boolean =>
  [req.headers?.purpose, req.headers?.['sec-purpose']].some(
    (header) => typeof header === 'string' && header.includes('prefetch')
  );

const getExperienceParams = (
  query: Record<string, string | string[] | undefined>,
  referrer: string,
  extraUtmParams: Partial<ExperienceParams['utm']> = {}
): ExperienceParams => {
  const utmParam = (name: string) => {
    const value = query[name];
    return (Array.isArray(value) ? value[0] : value) || undefined;
  };
  return {
    referrer,
    utm: {
      campaign: utmParam('utm_campaign'),
      content: utmParam('utm_content'),
      medium: utmParam('utm_medium'),
      source: utmParam('utm_source'),
      ...extraUtmParams,
    },
  };
};

/**
 * Aggregates personalize executions (friendly id + variant ids) for the route,
 * grouping page-level ("<VariantID>") and component-level ("<ComponentID>_<VariantID>") variants.
 * @param {PersonalizeInfo} personalizeInfo the route personalize information
 * @param {string} language the language
 * @param {string} [scope] optional Sitecore Personalize scope
 * @returns {PersonalizeExecution[]} An array of personalize executions
 */
const getPersonalizeExecutions = (
  personalizeInfo: PersonalizeInfo,
  language: string,
  scope?: string
): PersonalizeExecution[] =>
  personalizeInfo.variantIds.reduce<PersonalizeExecution[]>((results, variantId) => {
    const isComponentVariant = variantId.includes('_');
    const componentId = variantId.split('_')[0];
    const friendlyId = isComponentVariant
      ? CdpHelper.getComponentFriendlyId(personalizeInfo.pageId, componentId, language, scope)
      : CdpHelper.getPageFriendlyId(personalizeInfo.pageId, language, scope);
    const execution = results.find((x) => x.friendlyId === friendlyId);
    if (execution) {
      execution.variantIds.push(variantId);
    } else {
      results.push({
        friendlyId,
        // The default/control variant ("<ComponentID>_default") is also a valid execution result
        variantIds: isComponentVariant
          ? [`${componentId}${DEFAULT_VARIANT}`, variantId]
          : [variantId],
      });
    }
    return results;
  }, []);

/**
 * Middleware to support Sitecore Personalize.
 * Identifies page/component variants for the request via Sitecore CDP and populates
 * `req.scParams.variantId` and `req.scParams.componentVariantIds` for downstream layout personalization.
 * @param {PersonalizeMiddlewareOptions} options personalize middleware options
 * @returns {ExpressMiddleware} Express middleware
 * @public
 */
export function createPersonalizeMiddleware(
  options: PersonalizeMiddlewareOptions
): ExpressMiddleware {
  const personalizeService =
    options.personalizeService ??
    (options.contextId || options.clientContextId
      ? new PersonalizeService({
          clientFactory: createGraphQLClientFactory({
            api: {
              edge: {
                contextId: options.contextId as string,
                clientContextId: options.clientContextId,
                edgeUrl: options.edgeUrl,
              },
            },
          }),
          timeout: options.edgeTimeout,
          scope: options.scope,
          fetch: fetch,
        })
      : null);

  if (!personalizeService) {
    console.warn(
      '[PersonalizeMiddleware] Personalize middleware requires Edge configuration (contextId/clientContextId). ' +
        'Personalize features will be disabled. This is expected in local container development.'
    );
  }

  return async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    stripUntrustedTokens(req as CsdkExpressRequest);
    let eligible = false;

    try {
      // `enabled` defaults to true: omitting it keeps the middleware on (see BaseMiddlewareOptions).
      if (options.enabled === false || !personalizeService) {
        debug.personalize('personalize middleware disabled or not configured');
        return next();
      }
      // For browser loader navigations (/_data) routing data comes from the loader payload, not
      // the request; getMiddlewareRequest normalizes both into path/query/data.
      const { path, query, data } = getMiddlewareRequest(req);

      if (isEditingPreview(data.headers)) {
        debug.personalize('skipped (editing/preview mode)');
        return next();
      }

      if (!shouldProcessPath(path, options.matcher)) {
        debug.personalize('personalize middleware skipped (path does not match)');
        return next();
      }

      if (options.skip?.(req)) {
        debug.personalize('personalize middleware skipped (skip predicate)');
        return next();
      }

      // Skip personalization for bot requests marked by the bot tracking middleware.
      if ((options.skipForBot ?? true) && data.cookies?.[BOT_DETECTION_COOKIE]) {
        debug.personalize('skipped (bot request)');
        return next();
      }

      const startTimestamp = Date.now();
      const { locale, nonLocalePath } = splitLocaleFromPath(path, options.locales ?? []);
      const language = locale || options.defaultLanguage || 'en';
      const siteName =
        (req as CsdkExpressRequest).scParams?.siteName ||
        data.cookies?.[SITE_KEY] ||
        options.defaultSite;
      const hostHeader = data.headers?.['x-forwarded-host'] ?? data.headers?.host;
      const hostname =
        (Array.isArray(hostHeader) ? hostHeader[0] : hostHeader)?.split(':')[0] || 'localhost';

      debug.personalize('personalize middleware start: %o', {
        path: nonLocalePath,
        language,
        siteName,
        hostname,
        headers: redactTokenHeaders(req.headers),
      });

      if (!siteName) {
        debug.personalize('skipped (site could not be resolved)');
        return next();
      }

      // Get personalization info from Experience Edge
      const personalizeInfo = await personalizeService.getPersonalizeInfo(
        nonLocalePath,
        language,
        siteName
      );
      if (!personalizeInfo) {
        // Likely an invalid route / language
        debug.personalize('skipped (personalize info not found)');
        return next();
      }
      if (personalizeInfo.variantIds.length === 0) {
        debug.personalize('skipped (no personalization configured)');
        return next();
      }

      eligible = true;

      if (isPrefetch(req)) {
        // Personalized, but this is a prefetch request.
        // Don't execute a personalize request; otherwise, the metrics for component A/B experiments would be inaccurate.
        // Disable caching to force revalidation on navigation (personalization WILL be influenced).
        debug.personalize('skipped (prefetch)');
        res.setHeader?.('x-proxy-cache', 'no-cache');
        res.setHeader?.('Cache-Control', 'no-store, must-revalidate');
        return next();
      }

      // Express req/res are http.IncomingMessage/ServerResponse at runtime; the minimal
      // Express interfaces don't declare that, so cast for the cookie-based server adapters.
      const { req: httpReq, res: httpRes } = toNodeAdapterPair(req as CsdkExpressRequest, res);
      await initContentSdk({
        config: {
          contextId: options.contextId as string,
          edgeUrl: options.edgeUrl,
          siteName,
        },
        plugins: [
          analyticsPlugin({
            options: {
              enableCookie: true,
              cookieDomain: hostname,
            },
            // personalize middleware will only run on server for Angular and we explicitly use server adapters
            adapter: analyticsServerAdapter(httpReq, httpRes),
          }),
          personalizeServerPlugin({
            options: {
              enablePersonalizeCookie: true,
            },
            adapter: personalizeServerAdapter(httpReq, httpRes),
          }),
        ],
      });

      const geo = options.extractGeoDataCb ? await options.extractGeoDataCb(req) : undefined;
      const params = getExperienceParams(
        query,
        (data.referrer as string) || (data.headers?.referer as string) || '',
        options.getExtraUtmParams?.(req)
      );
      const executions = getPersonalizeExecutions(personalizeInfo, language, options.scope);
      const { identifiedVariantIds, tokens } = await collectPersonalizeExecutionTokens(
        executions,
        (execution) => {
          debug.personalize('executing experience for %s %o', execution.friendlyId, params);
          return personalize(
            {
              channel: options.channel || 'WEB',
              currency: options.currency ?? 'USD',
              friendlyId: execution.friendlyId,
              params,
              language,
              pageVariantIds: execution.variantIds,
              ...(geo && { geo }),
            },
            { timeout: options.cdpTimeout }
          );
        }
      );

      const groomed: { variantId?: string; componentVariantIds?: string[] } =
        identifiedVariantIds.length > 0 ? getGroomedVariantIds(identifiedVariantIds) : {};
      const trustedTokens = applyTokenBudgets(
        tokens,
        (req as CsdkExpressRequest).scParams,
        groomed
      );

      if (identifiedVariantIds.length === 0) {
        debug.personalize('skipped (no variant(s) identified)');
        writeTrustedParams(req as CsdkExpressRequest, {
          ...((req as CsdkExpressRequest).scParams || {}),
          tokens: trustedTokens,
        });
        applyPrivateNoStore(res, trustedTokens);
        return next();
      }

      writeTrustedParams(req as CsdkExpressRequest, {
        ...((req as CsdkExpressRequest).scParams || {}),
        ...groomed,
        tokens: trustedTokens,
      });
      applyPrivateNoStore(res, trustedTokens);

      debug.personalize('personalize middleware end in %dms: %o', Date.now() - startTimestamp, {
        variantId: groomed.variantId,
        componentVariantIds: groomed.componentVariantIds,
      });
    } catch (error) {
      console.log('Personalize middleware failed:');
      console.log(error);
      if (eligible) {
        writeTrustedParams(req as CsdkExpressRequest, {
          ...((req as CsdkExpressRequest).scParams || {}),
          tokens: createEmptyTokenMap(),
        });
      }
    }
    next();
  };
}

function stripUntrustedTokens(req: CsdkExpressRequest): void {
  if (req.scParams?.tokens) {
    const { tokens: _tokens, ...rest } = req.scParams;
    req.scParams = rest;
  }
  const raw = req.headers?.[SC_PARAMS_HEADER];
  if (raw === undefined) {
    return;
  }
  const serialized = serializeRequestHeader(raw);
  req.headers = req.headers ?? {};
  if (serialized === undefined) {
    delete req.headers[SC_PARAMS_HEADER];
    return;
  }
  try {
    const parsed = JSON.parse(serialized) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      delete (parsed as Record<string, unknown>).tokens;
      req.headers[SC_PARAMS_HEADER] = JSON.stringify(parsed);
      return;
    }
  } catch {
    // Invalid inbound envelopes must not remain on the wire.
  }
  delete req.headers[SC_PARAMS_HEADER];
}

function serializeRequestHeader(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && value.length > 0 && value.every((part) => typeof part === 'string')) {
    return value[0];
  }
  return undefined;
}

function applyPrivateNoStore(
  res: { setHeader?: (name: string, value: string) => void },
  tokens: TokenMap
): void {
  if (tokenMapHasUsableVisitorValues(tokens)) {
    res.setHeader?.('Cache-Control', 'private, no-store');
  }
}

function writeTrustedParams(
  req: CsdkExpressRequest,
  scParams: CsdkExpressRequest['scParams']
): void {
  req.scParams = scParams;
  req.headers = req.headers ?? {};
  req.headers[SC_PARAMS_HEADER] = JSON.stringify(scParams);
}

function applyTokenBudgets(
  tokens: TokenMap,
  existing: CsdkExpressRequest['scParams'],
  variants: { variantId?: string; componentVariantIds?: string[] }
): TokenMap {
  const preClampEncoded = encodePersonalizeTokensHeader(tokens);
  const clamped = clampEncodedTokenMap(tokens);
  let next = clamped.tokens;
  if (clamped.oversized) {
    debug.personalize(
      'personalize tokens header oversized encodedBytes=%s limit=%s',
      preClampEncoded.length,
      PERSONALIZE_TOKENS_HEADER_MAX_BYTES
    );
  }

  const envelope = JSON.stringify({
    ...(existing || {}),
    ...variants,
    tokens: next,
  });
  const envelopeBytes = new TextEncoder().encode(envelope).length;
  if (envelopeBytes > PERSONALIZE_SCPARAMS_ENVELOPE_MAX_BYTES) {
    debug.personalize(
      'personalize scParams envelope oversized encodedBytes=%s limit=%s',
      envelopeBytes,
      PERSONALIZE_SCPARAMS_ENVELOPE_MAX_BYTES
    );
    next = createEmptyTokenMap();
  }
  return next;
}

function redactTokenHeaders(
  headers: ExpressRequest['headers']
): Record<string, unknown> | undefined {
  if (!headers) {
    return headers;
  }
  const redacted: Record<string, unknown> = { ...headers };
  if (SC_PARAMS_HEADER in redacted) {
    redacted[SC_PARAMS_HEADER] = '[redacted]';
  }
  return redacted;
}
