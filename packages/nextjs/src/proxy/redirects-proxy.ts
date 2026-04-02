import {
  RedirectsService,
  RedirectsServiceConfig,
  REDIRECT_TYPE_301,
  REDIRECT_TYPE_302,
  REDIRECT_TYPE_SERVER_TRANSFER,
  RedirectInfo,
  SiteInfo,
} from '@sitecore-content-sdk/content/site';
import {
  areURLSearchParamsEqual,
  escapeNonSpecialQuestionMarks,
  isRegexOrUrl,
  mergeURLSearchParams,
} from '@sitecore-content-sdk/core/tools';
import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest, NextResponse } from 'next/server';
import regexParser from 'regex-parser';
import { ProxyBase, ProxyBaseConfig, REWRITE_HEADER_NAME } from './proxy';
import { SitecoreConfig } from '../config';
import debug from '../debug';

const REGEXP_CONTEXT_SITE_LANG = new RegExp(/\$siteLang/, 'i');
const REGEXP_ABSOLUTE_URL = new RegExp('^(?:[a-z]+:)?//', 'i');

type RedirectResult = RedirectInfo & { matchedQueryString?: string };

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

  handle = async (req: NextRequest, res: NextResponse): Promise<NextResponse> => {
    if (!this.config.enabled) {
      debug.redirects('skipped (redirects proxy is disabled globally)');
      return res;
    }
    try {
      const pathname = req.nextUrl.pathname;
      const language = this.getLanguage(req, res);
      const hostname = this.getHostHeader(req) || this.defaultHostname;
      let site: SiteInfo | undefined;
      const startTimestamp = Date.now();

      debug.redirects('redirects proxy start: %o', {
        pathname,
        language,
        hostname,
      });

      if (this.disabled(req, res)) {
        debug.redirects('skipped (redirects proxy is disabled)');
        return res;
      }

      const isAppRouterRequest = this.isAppRouter(res);

      const validateRequest = () => {
        if (this.isPreview(req)) {
          debug.redirects('skipped (preview)');

          return false;
        }

        // Skip prefetch requests from Next.js, which are not original client requests
        // as they load unnecessary requests that burden the redirects proxy with meaningless traffic
        if (this.isPrefetch(req)) {
          debug.redirects('skipped (prefetch)');
          res.headers.set('x-proxy-cache', 'no-cache');
          res.headers.set('Cache-Control', 'no-store, must-revalidate');
          return false;
        }
        return true;
      };

      if (!validateRequest()) {
        return res;
      }

      site = this.getSite(req, res);

      // Find the redirect from result of RedirectService
      const existsRedirect = await this.getExistsRedirect(req, site.name);

      if (!existsRedirect) {
        debug.redirects('skipped (redirect does not exist)');

        return res;
      }

      debug.redirects('Matched redirect rule: %o', { existsRedirect });

      const processAbsoluteUrlTarget = (
        url: NextURL,
        existsRedirect: RedirectResult
      ): NextResponse => {
        // Redirect logic for absolute (external or not) URLS. To avoid locale stripping: use plain string for external URLs to prevent Next.js rewriting.
        let targetUrl = existsRedirect.target;

        if (url.search && existsRedirect.isQueryStringPreserved) {
          const incomingQS = new URLSearchParams(url.search ?? '');
          const [targetMainUrl, targetQS] = targetUrl.split('?');
          const mergedQueryString = mergeURLSearchParams(
            incomingQS,
            new URLSearchParams(targetQS || '')
          );
          targetUrl = `${targetMainUrl}?${mergedQueryString}`;
        }

        return this.dispatchRedirect(targetUrl, existsRedirect.redirectType, req, res, true);
      };

      const processRelativeUrlTarget = (
        url: NextURL,
        existsRedirect: RedirectResult
      ): NextResponse => {
        let targetUrl = existsRedirect.target;
        const possiblyLocalePrefix = targetUrl.split('/')[1];
        let targetLocale = '';

        if (this.locales.includes(possiblyLocalePrefix)) {
          targetLocale = possiblyLocalePrefix;
          targetUrl = targetUrl.replace(`/${possiblyLocalePrefix}`, '');
        } else if (existsRedirect.isLanguagePreserved) {
          targetLocale = language;
        }

        let [targetMainUrl, targetQS] = targetUrl.split('?');
        if (url.search && existsRedirect.isQueryStringPreserved) {
          const incomingQS = new URLSearchParams(url.search ?? '');
          targetQS = mergeURLSearchParams(incomingQS, new URLSearchParams(targetQS || ''));
        }

        const prepareNewURL = new URL(
          `${targetMainUrl}${targetQS ? '?' + targetQS : ''}`,
          url.origin
        );

        const basePath = url.basePath; // setting NextUrl.href overrides basePath, so we need to store it
        url.href = prepareNewURL.href;
        url.pathname = prepareNewURL.pathname;
        url.search = prepareNewURL.search;
        // NextUrl setter sets '/' by default if basePath is empty
        // this causes issues when basePath is not configured so we need to set it only if exists
        if (basePath) {
          url.basePath = basePath;
        }

        if (!isAppRouterRequest) {
          // for pages router i18n implementation, apply default locale as backup
          url.locale = targetLocale || req.nextUrl.defaultLocale || 'en';
        } else {
          // In App Router, we need to set the locale in the pathname, if present
          if (targetLocale) url.pathname = `/${targetLocale}${url.pathname}`;
        }

        /** return Response redirect with http code of redirect type */
        return this.dispatchRedirect(
          this.normalizeUrl(url),
          existsRedirect.redirectType,
          req,
          res,
          false
        );
      };

      // replace $siteLang token in target if exists
      existsRedirect.target = existsRedirect.target.replace(
        REGEXP_CONTEXT_SITE_LANG,
        site.language
      );

      const reqUrl = this.normalizeUrl(req.nextUrl.clone());

      // Apply regex replacements to the target URL if the pattern is a regex
      const matched = reqUrl.pathname
        .replace(/\/*$/gi, '')
        .match(regexParser(existsRedirect.pattern));
      if (matched) {
        existsRedirect.target = existsRedirect.target.replace(
          /\$(\d+)/g,
          (_: string, index: string): string => {
            return matched[parseInt(index, 10)] || '';
          }
        );
      }

      const redirectedResponse = REGEXP_ABSOLUTE_URL.test(existsRedirect.target)
        ? processAbsoluteUrlTarget(reqUrl, existsRedirect)
        : processRelativeUrlTarget(reqUrl, existsRedirect);

      debug.redirects('redirects proxy end in %dms: %o', Date.now() - startTimestamp, {
        redirected: redirectedResponse.redirected,
        status: redirectedResponse.status,
        url: redirectedResponse.url,
        headers: this.extractDebugHeaders(redirectedResponse.headers),
      });

      return redirectedResponse;
    } catch (error) {
      console.log('Redirect proxy failed:');
      console.log(error);
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
   * @returns Promise<RedirectInfo | undefined>
   * @private
   */
  protected async getExistsRedirect(
    req: NextRequest,
    siteName: string
  ): Promise<RedirectResult | undefined> {
    if (!this.redirectsService) {
      return undefined;
    }

    const { pathname: incomingURL, search: incomingQS = '' } = this.normalizeUrl(
      req.nextUrl.clone()
    );
    // locale of current request
    const requestLocale = this.getLanguage(req);
    // locale of the url - if present in the url
    const urlLocale = req.nextUrl.locale;
    const normalizedPath = incomingURL.replace(/\/*$/gi, '').toLowerCase();
    const redirects = await this.redirectsService.fetchRedirects(siteName);

    const matchedLocaleRedirect = this.matchRedirectItemRedirect(
      redirects,
      requestLocale,
      normalizedPath
    );
    if (matchedLocaleRedirect) {
      return matchedLocaleRedirect;
    }

    return this.matchFromRedirectMapRedirect(redirects, urlLocale, incomingURL, incomingQS);
  }

  /**
   * Matches redirect-map rules without a `locale` field against the incoming URL (static or regex patterns).
   * @param {RedirectResult[]} redirects All redirects from the service (non-locale entries are filtered inside).
   * @param {string} urlLocale Locale segment from the request URL (`nextUrl.locale`).
   * @param {string} incomingURL Original pathname used for regex tests.
   * @param {string} incomingQS Query string including leading `?` if present.
   * @returns {RedirectResult | undefined} First matching redirect or undefined.
   */
  protected matchFromRedirectMapRedirect(
    redirects: RedirectResult[],
    urlLocale: string,
    incomingURL: string,
    incomingQS: string
  ): RedirectResult | undefined {
    const nonLocaleRedirects = redirects.filter((redirect: RedirectResult) => !redirect.locale);
    let matchedQueryString: string | undefined;
    const normalizedPath = incomingURL.replace(/\/*$/gi, '').toLowerCase();
    const localePath = `/${urlLocale.toLowerCase()}${normalizedPath}`;

    return nonLocaleRedirects.length
      ? nonLocaleRedirects.find((redirect: RedirectResult) => {
          // process static URL (non-regex) rules
          if (isRegexOrUrl(redirect.pattern) === 'url') {
            const urlArray = redirect.pattern.endsWith('/')
              ? redirect.pattern.slice(0, -1).split('?')
              : redirect.pattern.split('?');
            const patternQS = urlArray[1];
            let patternPath = urlArray[0].toLowerCase();
            // nextjs routes are case-sensitive, but locales should be compared case-insensitively
            const patternParts = patternPath.split('/');
            const maybeLocale = patternParts[1].toLowerCase();
            // case insensitive lookup of locales
            if (new RegExp(this.locales.join('|'), 'i').test(maybeLocale)) {
              patternPath = patternPath.replace(`/${patternParts[1]}`, `/${maybeLocale}`);
            }

            return (
              (patternPath === localePath || patternPath === normalizedPath) &&
              (!patternQS ||
                areURLSearchParamsEqual(
                  new URLSearchParams(patternQS),
                  new URLSearchParams(incomingQS)
                ))
            );
          }

          // process regex rules
          // Modify the redirect pattern to ignore the language prefix in the path
          // And escapes non-special "?" characters in a string or regex.
          redirect.pattern = escapeNonSpecialQuestionMarks(
            '^' + redirect.pattern.replace(new RegExp(`^[^]?/${urlLocale}/`, 'gi'), '') // ensure function thinks input is regex
          );

          // Prepare the redirect pattern as a regular expression, making it more flexible for matching URLs
          redirect.pattern = `/^\/${redirect.pattern
            .replace(/^\/|\/$/g, '') // Removes leading and trailing slashes
            .replace(/^\^\/|\/\$$/g, '') // Removes unnecessary start (^) and end ($) anchors
            .replace(/^\^|\$$/g, '') // Further cleans up anchors
            .replace(/\$\/gi$/g, '')}[\/]?$/i`; // Ensures the pattern allows an optional trailing slash

          // Redirect pattern matches the full incoming URL with query string present
          matchedQueryString = [
            regexParser(redirect.pattern).test(`/${localePath}${incomingQS}`),
            regexParser(redirect.pattern).test(`${normalizedPath}${incomingQS}`),
          ].some(Boolean)
            ? incomingQS
            : undefined;

          // Save the matched query string (if found) into the redirect object
          redirect.matchedQueryString = matchedQueryString || '';

          return (
            !!(
              regexParser(redirect.pattern).test(`/${urlLocale}${incomingURL}`) ||
              regexParser(redirect.pattern).test(incomingURL) ||
              matchedQueryString
            ) &&
            (redirect.locale ? redirect.locale.toLowerCase() === urlLocale.toLowerCase() : true)
          );
        })
      : undefined;
  }

  /**
   * Processes redirect rules from redirect items (language-versioned)
   * @param {RedirectResult[]} redirects redirect entries from Edge
   * @param {string} locale current request locale
   * @param {string} currentPath current request path (without locale)
   * @returns {RedirectResult | undefined} matched redirect item redirect result or undefined
   */
  protected matchRedirectItemRedirect(
    redirects: RedirectResult[],
    locale: string,
    currentPath: string
  ): RedirectResult | undefined {
    // locale patterns will include a redirect item suffix which we need to remove
    const localeRedirects = redirects.filter((redirect) => redirect.locale === locale);
    // locale rules are easy and nice
    return localeRedirects.length
      ? localeRedirects.find((redirect: RedirectResult) => {
          const patternPath = redirect.pattern.replace(/\/*$/gi, '').toLowerCase();
          return patternPath === currentPath;
        })
      : undefined;
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

        // For App Router Server Transfer, ensure locale is in the path
        // This is needed because the route structure requires [locale] segment
        if (this.isAppRouter(res) && !isExternal) {
          const pathParts = rewritePath.split('/').filter(Boolean);
          const firstSegment = pathParts[0];
          // Check if path doesn't start with a locale
          if (!this.locales.includes(firstSegment)) {
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
}
