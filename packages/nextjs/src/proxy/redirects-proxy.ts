import {
  RedirectsService,
  RedirectsServiceConfig,
  REDIRECT_TYPE_301,
  REDIRECT_TYPE_302,
  REDIRECT_TYPE_SERVER_TRANSFER,
  breakDownPath,
  isAbsoluteTarget,
  matchFromRedirectMapRedirect as matchFromRedirectMapRedirectUtil,
  matchRedirectItemRedirect as matchRedirectItemRedirectUtil,
  processAbsoluteUrlTarget,
  processRelativeUrlTarget,
  RedirectResult,
  resolveRedirectTarget,
} from '@sitecore-content-sdk/content/site';
import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest, NextResponse } from 'next/server';
import { ProxyBase, ProxyBaseConfig, REWRITE_HEADER_NAME } from './proxy';
import { SitecoreConfig } from '../config';
import debug from '../debug';
import { FailedProxyExecution, ProxiesContext, SuccessfulProxyExecution } from './types';

/**
 * Information about executed proxy to be stored in the context
 * Used for describing successful execution with details about the redirects that were applied
 * @public
 */
export interface SuccessfulRedirectsProxyExecution extends SuccessfulProxyExecution {
  requestUrl: string;
  redirectUrl: string;
  redirectStatus: number;
  isExternal: boolean;
}

/**
 * The interface for the RedirectsProxy configuration.
 * @public
 */
export type RedirectsProxyConfig = Omit<RedirectsServiceConfig, 'fetch' | 'clientFactory'> &
  SitecoreConfig['api']['edge'] &
  Partial<NonNullable<SitecoreConfig['api']['local']>> &
  ProxyBaseConfig &
  SitecoreConfig['redirects'] & {
    redirectsService?: RedirectsService;
  };
/**
 * Proxy / handler fetches all redirects from Sitecore instance by grapqhl service
 * compares with current url and redirects to target url
 * @public
 */
export class RedirectsProxy extends ProxyBase {
  protected redirectsService: RedirectsService | null;
  private locales: string[];

  /**
   * @param {RedirectsProxyConfig} [config] redirects proxy config
   */
  constructor(protected config: RedirectsProxyConfig) {
    super(config);
    this.locales = config.locales;

    // If redirectsService is provided directly (e.g., for testing), use it
    if (this.config.redirectsService) {
      this.redirectsService = this.config.redirectsService;
      return;
    }

    // Validate API config is present - redirects requires either Edge or local API configuration
    const hasEdgeConfig = !!(this.config.contextId || this.config.clientContextId);
    const hasLocalConfig = !!(this.config.apiHost && this.config.apiKey);

    if (!hasEdgeConfig && !hasLocalConfig) {
      console.warn(
        '[RedirectsProxy] Redirects proxy requires either Edge configuration (contextId/clientContextId) or local API configuration (apiHost/apiKey). ' +
          'Redirects features will be disabled. This is expected when API configuration is not available.'
      );
      // Set to null to indicate service is disabled
      this.redirectsService = null;
      return;
    }

    const graphQLOptions = {
      api: {
        edge: {
          contextId: this.config.contextId,
          clientContextId: this.config.clientContextId,
          edgeUrl: this.config.edgeUrl,
        },
        ...(this.config.apiHost && this.config.apiKey
          ? {
              local: {
                apiHost: this.config.apiHost,
                apiKey: this.config.apiKey,
                path: this.config.path,
              },
            }
          : {}),
      },
    };
    // NOTE: we provide native fetch for compatibility on Next.js Edge Runtime
    // (underlying default 'cross-fetch' is not currently compatible: https://github.com/lquixada/cross-fetch/issues/78)
    this.redirectsService = new RedirectsService({
      ...config,
      clientFactory: this.getClientFactory(graphQLOptions),
      fetch: fetch,
    });
  }

  /**
   * Name of the proxy, used as a key in the context to store information about executed proxies
   */
  get name() {
    return 'RedirectsProxy';
  }

  handle = async (
    req: NextRequest,
    res: NextResponse,
    proxiesContext?: ProxiesContext
  ): Promise<NextResponse> => {
    if (!this.config.enabled) {
      debug.redirects('skipped (redirects proxy is disabled globally)');
      return res;
    }
    try {
      const language = this.getLanguage(req, res);
      const startTimestamp = Date.now();

      debug.redirects('redirects proxy start: %o', {
        pathname: req.nextUrl.pathname,
        language,
        hostname: this.getHostHeader(req) || this.defaultHostname,
      });

      if (this.disabled(req, res)) {
        debug.redirects('skipped (redirects proxy is disabled)');
        return res;
      }

      const localeRedirectMode = this.getLocaleRedirectMode(res);

      if (this.isPreview(req)) {
        debug.redirects('skipped (preview)');
        return res;
      }

      // Skip prefetch requests from Next.js, which are not original client requests
      // as they load unnecessary requests that burden the redirects proxy with meaningless traffic
      if (this.isPrefetch(req)) {
        debug.redirects('skipped (prefetch)');
        res.headers.set('x-proxy-cache', 'no-cache');
        res.headers.set('Cache-Control', 'no-store, must-revalidate');
        return res;
      }

      const site = this.getSite(req, res);

      // Find the redirect from result of RedirectService
      const existsRedirect = await this.getExistsRedirect(req, site.name, language);

      if (!existsRedirect) {
        debug.redirects('skipped (redirect does not exist)');

        return res;
      }

      debug.redirects('Matched redirect rule: %o', { existsRedirect });

      const reqUrl = this.normalizeUrl(req.nextUrl.clone());
      const incomingPathData = breakDownPath(this.locales, reqUrl.pathname);
      incomingPathData.queryString = reqUrl.search ? reqUrl.search.replace(/^\?/, '') : undefined;

      existsRedirect.target = resolveRedirectTarget(existsRedirect, site.language, reqUrl.pathname);
      const isAbsoluteUrl = isAbsoluteTarget(existsRedirect.target);

      const getRedirectTarget = (): NextResponse => {
        // Redirect logic for absolute (external or not) URLs. To avoid locale stripping:
        // use a plain string for external URLs to prevent Next.js rewriting.
        if (isAbsoluteUrl) {
          const targetUrl = processAbsoluteUrlTarget(incomingPathData, existsRedirect);
          return this.dispatchRedirect(targetUrl, existsRedirect.redirectType, req, res, true);
        }

        const { targetLocale, targetPath } = processRelativeUrlTarget(
          incomingPathData,
          existsRedirect,
          this.locales,
          language
        );

        const prepareNewURL = new URL(targetPath, reqUrl.origin);

        reqUrl.pathname = prepareNewURL.pathname;
        reqUrl.search = prepareNewURL.search;

        if (localeRedirectMode === 'pages') {
          reqUrl.locale = targetLocale || req.nextUrl.defaultLocale || 'en';
        } else if (localeRedirectMode === 'app-with-locale') {
          // App Router with a [locale] segment. Prefix decision:
          // - `always`: prefix every locale, including the site default.
          // - `as-needed` (explicit): prefix only non-default locales; the site default stays
          //   bare, matching next-intl. This holds even for `isLanguagePreserved` rules.
          // - unset: behave as `as-needed`, EXCEPT that `isLanguagePreserved` rules always keep
          //   the locale prefix (Sitecore preservation wins over next-intl canonicalization).
          //   Set `appLocalePrefix` explicitly to opt out of this Sitecore-specific behavior.
          const prefixMode = this.config.appLocalePrefix;
          const shouldPrefix =
            !!targetLocale &&
            (prefixMode === 'always' ||
              (prefixMode === undefined && existsRedirect.isLanguagePreserved) ||
              targetLocale !== site.language);

          if (shouldPrefix) {
            reqUrl.pathname = `/${targetLocale}${reqUrl.pathname}`;
          }
        }
        // else: App Router without [locale] segment (`never`) — leave pathname unchanged

        /** return Response redirect with http code of redirect type */
        return this.dispatchRedirect(
          this.normalizeUrl(reqUrl),
          existsRedirect.redirectType,
          req,
          res,
          false
        );
      };

      const redirectedResponse = getRedirectTarget();

      debug.redirects('redirects proxy end in %dms: %o', Date.now() - startTimestamp, {
        redirected: redirectedResponse.redirected,
        status: redirectedResponse.status,
        url: redirectedResponse.url,
        headers: this.extractDebugHeaders(redirectedResponse.headers),
      });

      const successfulExecution: SuccessfulRedirectsProxyExecution = {
        executedSuccessfully: true,
        error: null,
        requestUrl: reqUrl.href,
        redirectUrl: redirectedResponse.url,
        redirectStatus: redirectedResponse.status,
        isExternal: isAbsoluteUrl,
      };

      proxiesContext?.set(this.name, successfulExecution);

      return redirectedResponse;
    } catch (error) {
      console.log('Redirect proxy failed:');
      console.log(error);

      const failedExecution: FailedProxyExecution = {
        executedSuccessfully: false,
        error,
      };

      proxiesContext?.set(this.name, failedExecution);

      return res;
    }
  };

  protected disabled(req: NextRequest, res: NextResponse): boolean | undefined {
    // Check if API config is missing - if so, disable the proxy
    if (!this.redirectsService) {
      debug.redirects('skipped (redirects service not configured - API config required)');
      return true;
    }
    // ignore files
    return req.nextUrl.pathname.includes('.') || super.disabled(req, res);
  }

  /**
   * Method returns RedirectInfo when matches
   * @param {NextRequest} req request
   * @param {string} siteName site name
   * @param {string} requestLocale locale used for locale redirect matching
   * @returns Promise<RedirectInfo | undefined>
   * @private
   */
  protected async getExistsRedirect(
    req: NextRequest,
    siteName: string,
    requestLocale: string
  ): Promise<RedirectResult | undefined> {
    if (!this.redirectsService) {
      return undefined;
    }

    const { pathname: incomingURL, search: incomingQS = '' } = this.normalizeUrl(
      req.nextUrl.clone()
    );

    const normalizedPath = incomingURL.replace(/\/*$/gi, '').toLowerCase();
    const redirects = await this.redirectsService.fetchRedirects(siteName);

    // using locale of current request (from URL, headers or otherwise), used to match versioned redirect rules
    const matchedLocaleRedirect = this.matchRedirectItemRedirect(
      redirects,
      requestLocale,
      normalizedPath
    );
    if (matchedLocaleRedirect) {
      return matchedLocaleRedirect;
    }
    return this.matchFromRedirectMapRedirect(redirects, requestLocale, incomingURL, incomingQS);
  }

  /**
   * Matches redirect-map rules without a `locale` field against the incoming URL (static or regex patterns).
   * @param {RedirectResult[]} redirects All redirects from the service (non-locale entries are filtered inside).
   * @param {string} requestLocale Locale of the current request.
   * @param {string} incomingURL Original pathname (may or may not carry a locale prefix).
   * @param {string} incomingQS Query string including leading `?` if present.
   * @returns {RedirectResult | undefined} First matching redirect or undefined.
   * @private
   */
  protected matchFromRedirectMapRedirect(
    redirects: RedirectResult[],
    requestLocale: string,
    incomingURL: string,
    incomingQS: string
  ): RedirectResult | undefined {
    const incomingPathData = breakDownPath(this.locales, incomingURL);
    incomingPathData.queryString = incomingQS ? incomingQS.replace(/^\?/, '') : undefined;
    return matchFromRedirectMapRedirectUtil(redirects, requestLocale, incomingPathData);
  }

  /**
   * Processes redirect rules from redirect items (language-versioned)
   * @param {RedirectResult[]} redirects redirect entries from Edge
   * @param {string} locale current request locale
   * @param {string} currentPath current request path
   * @returns {RedirectResult | undefined} matched redirect item redirect result or undefined
   * @private
   */
  protected matchRedirectItemRedirect(
    redirects: RedirectResult[],
    locale: string,
    currentPath: string
  ): RedirectResult | undefined {
    // strip any configured locale prefix so the path can be compared against locale-less patterns
    const { nonLocalePath } = breakDownPath(this.locales, currentPath);
    return matchRedirectItemRedirectUtil(redirects, locale, nonLocalePath);
  }

  /**
   * When a user clicks on a link generated by the Link component from next/link,
   * Next.js adds special parameters in the route called path.
   * This method removes these special parameters.
   * @param {NextURL} url
   * @returns {string} normalize url
   */
  protected normalizeUrl(url: NextURL): NextURL {
    if (!url.search) {
      return url;
    }

    /**
     * Prepare special parameters for exclusion.
     */
    const splittedPathname = url.pathname
      .split('/')
      .filter((route: string) => route)
      .map((route) => `path=${route}`);

    /**
     * Remove special parameters(Next.JS)
     * Example: /about/contact/us
     * When a user clicks on this link, Next.js should generate a link for the proxy, formatted like this:
     * http://host/about/contact/us?path=about&path=contact&path=us
     */
    const newQueryString = url.search
      .replace(/^\?/, '')
      .split('&')
      .filter((param) => {
        if (!splittedPathname.includes(param)) {
          return param;
        }
        return false;
      })
      .join('&');

    const newUrl = new URL(`${url.pathname.toLowerCase()}?${newQueryString}`, url.origin);

    const basePath = url.basePath; // setting NextUrl.href overrides basePath, so we need to store it
    url.search = newUrl.search;
    url.pathname = newUrl.pathname.toLocaleLowerCase();
    url.href = newUrl.href;
    // NextUrl setter sets '/' by default if basePath is empty
    // this causes issues when basePath is not configured so we need to set it only if exists
    if (basePath) {
      url.basePath = basePath;
    }

    return url;
  }

  /**
   * Helper function to dispatch a redirect or rewrite based on the redirect type.
   * @param {NextURL | string} target The final target to redirect/rewrite to.
   * @param {string} type One of `REDIRECT_TYPE_301`, `REDIRECT_TYPE_302`, or `REDIRECT_TYPE_SERVER_TRANSFER`.
   * @param {NextRequest} req The incoming request.
   * @param {NextResponse} res The current response (used for header cleanup / carry-over).
   * @param {boolean} isExternal Set to `true` when `target` is an external absolute URL (e.g. `https://…`).
   *   Passed through to `rewrite` so it can skip locale/basePath stripping for externals.
   * @returns {NextResponse} The redirect/rewrite response, or `res` if the type is not recognized.
   */
  protected dispatchRedirect(
    target: NextURL | string,
    type: string,
    req: NextRequest,
    res: NextResponse,
    isExternal = false
  ): NextResponse {
    switch (type) {
      case REDIRECT_TYPE_301:
        return this.createRedirectResponse(target, res, 301, 'Moved Permanently');
      case REDIRECT_TYPE_302:
        return this.createRedirectResponse(target, res, 302, 'Found');
      case REDIRECT_TYPE_SERVER_TRANSFER: {
        // rewrite expects a path string; for NextURL extract pathname + search
        let rewritePath =
          typeof target === 'string' ? target : `${target.pathname}${target.search || ''}`;

        // When locale is part of the route path, ensure Server Transfer rewrite includes it
        if (this.getLocaleRedirectMode(res) === 'app-with-locale' && !isExternal) {
          const pathParts = breakDownPath(this.locales, rewritePath);
          // Check if path doesn't start with a locale
          if (!pathParts.locale) {
            // Add current language as locale prefix
            const language = this.getLanguage(req, res);
            rewritePath = `/${language}${rewritePath}`;
          }
        }

        // Check if it has a site prefix
        // If so, preserve it for the redirect target to maintain proper routing
        const incomingRewrite = res?.headers.get(REWRITE_HEADER_NAME);
        if (incomingRewrite && !isExternal) {
          // Extract locale from target path
          const targetPathParts = rewritePath.split('/').filter(Boolean);
          const targetLocale = targetPathParts[0];

          // Find locale position in incoming rewrite to extract site prefix
          if (targetLocale) {
            const localePattern = `/${targetLocale}/`;
            const localeIndex = incomingRewrite.indexOf(localePattern);
            if (localeIndex > 0) {
              const sitePrefix = incomingRewrite.substring(0, localeIndex);
              rewritePath = `${sitePrefix}${rewritePath}`;
            }
          }
        }

        return this.rewrite(rewritePath, req, res, isExternal);
      }
      default:
        return res;
    }
  }

  /**
   * Helper function to create a redirect response and remove the x-proxy-next header.
   * @param {NextURL | string} url The URL to redirect to.
   * @param {Response} res The response object.
   * @param {number} status The HTTP status code of the redirect.
   * @param {string} statusText The status text of the redirect.
   * @returns {NextResponse<unknown>} The redirect response.
   */
  protected createRedirectResponse(
    url: NextURL | string,
    res: Response | undefined,
    status: number,
    statusText: string
  ): NextResponse {
    // Convert NextURL to string if needed - NextResponse.redirect requires a string URL
    const urlString = typeof url === 'string' ? url : url.href;
    const redirect = NextResponse.redirect(urlString, {
      status,
      statusText,
      headers: res?.headers,
    });
    if (res?.headers) {
      redirect.headers.delete('x-middleware-next');
      redirect.headers.delete('x-middleware-rewrite');
      redirect.headers.delete(REWRITE_HEADER_NAME);
    }
    return redirect;
  }

  /**
   * Resolves how locale should be applied on relative redirect targets.
   * - `pages`: Pages Router Next.js i18n (`url.locale`)
   * - `app-with-locale`: App Router with `[locale]` path segment
   * - `app-without-locale`: App Router without `[locale]` segment
   * `appLocalePrefix` `always`/`never` selects App Router modes explicitly; `as-needed`
   * (or unset) falls back to LocaleProxy header detection (App Router) vs Pages Router.
   * @param {NextResponse} res response
   * @returns {'pages' | 'app-with-locale' | 'app-without-locale'} locale redirect mode
   * @private
   */
  private getLocaleRedirectMode(
    res: NextResponse
  ): 'pages' | 'app-with-locale' | 'app-without-locale' {
    if (this.config.appLocalePrefix === 'always') {
      return 'app-with-locale';
    }
    if (this.config.appLocalePrefix === 'never') {
      return 'app-without-locale';
    }
    return this.isAppRouter(res) ? 'app-with-locale' : 'pages';
  }
}
