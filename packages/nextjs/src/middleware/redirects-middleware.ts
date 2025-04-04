﻿import { debug } from '@sitecore-content-sdk/core';
import {
  GraphQLRedirectsService,
  GraphQLRedirectsServiceConfig,
  REDIRECT_TYPE_301,
  REDIRECT_TYPE_302,
  REDIRECT_TYPE_SERVER_TRANSFER,
  RedirectInfo,
  SiteInfo,
} from '@sitecore-content-sdk/core/site';
import {
  areURLSearchParamsEqual,
  escapeNonSpecialQuestionMarks,
  isRegexOrUrl,
  mergeURLSearchParams,
} from '@sitecore-content-sdk/core/utils';
import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest, NextResponse } from 'next/server';
import regexParser from 'regex-parser';
import { MiddlewareBase, MiddlewareBaseConfig, REWRITE_HEADER_NAME } from './middleware';
import { SitecoreConfig } from '../config';

const REGEXP_CONTEXT_SITE_LANG = new RegExp(/\$siteLang/, 'i');
const REGEXP_ABSOLUTE_URL = new RegExp('^(?:[a-z]+:)?//', 'i');

type RedirectResult = RedirectInfo & { matchedQueryString?: string };

/**
 * extended RedirectsMiddlewareConfig config type for RedirectsMiddleware
 */
export type RedirectsMiddlewareConfig = Omit<GraphQLRedirectsServiceConfig, 'fetch'> &
  MiddlewareBaseConfig &
  SitecoreConfig['redirects'];
/**
 * Middleware / handler fetches all redirects from Sitecore instance by grapqhl service
 * compares with current url and redirects to target url
 */
export class RedirectsMiddleware extends MiddlewareBase {
  private redirectsService: GraphQLRedirectsService;
  private locales: string[];

  /**
   * @param {RedirectsMiddlewareConfig} [config] redirects middleware config
   */
  constructor(protected config: RedirectsMiddlewareConfig) {
    super(config);
    // NOTE: we provide native fetch for compatibility on Next.js Edge Runtime
    // (underlying default 'cross-fetch' is not currently compatible: https://github.com/lquixada/cross-fetch/issues/78)
    this.redirectsService = new GraphQLRedirectsService({ ...config, fetch: fetch });
    this.locales = config.locales;
  }

  handle = async (req: NextRequest, res: NextResponse): Promise<NextResponse> => {
    if (!this.config.enabled) {
      debug.redirects('skipped (redirects middleware is disabled globally)');
      return res;
    }
    try {
      const pathname = req.nextUrl.pathname;
      const language = this.getLanguage(req);
      const hostname = this.getHostHeader(req) || this.defaultHostname;
      let site: SiteInfo | undefined;
      const startTimestamp = Date.now();

      debug.redirects('redirects middleware start: %o', {
        pathname,
        language,
        hostname,
      });

      if (this.disabled(req, res)) {
        debug.redirects('skipped (redirects middleware is disabled)');
        return res;
      }

      const createResponse = async () => {
        if (this.isPreview(req)) {
          debug.redirects('skipped (preview)');

          return res;
        }

        // Skip prefetch requests from Next.js, which are not original client requests
        // as they load unnecessary requests that burden the redirects middleware with meaningless traffic
        if (this.isPrefetch(req)) {
          debug.redirects('skipped (prefetch)');
          res.headers.set('x-middleware-cache', 'no-cache');
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

        // Find context site language and replace token
        if (
          REGEXP_CONTEXT_SITE_LANG.test(existsRedirect.target) &&
          !(
            REGEXP_ABSOLUTE_URL.test(existsRedirect.target) &&
            existsRedirect.target.includes(hostname)
          )
        ) {
          existsRedirect.target = existsRedirect.target.replace(
            REGEXP_CONTEXT_SITE_LANG,
            site.language
          );
          req.nextUrl.locale = site.language;
        }

        const url = this.normalizeUrl(req.nextUrl.clone());

        if (REGEXP_ABSOLUTE_URL.test(existsRedirect.target)) {
          url.href = existsRedirect.target;
        } else {
          const isUrl = isRegexOrUrl(existsRedirect.pattern) === 'url';
          const targetParts = existsRedirect.target.split('/');
          const urlFirstPart = targetParts[1];

          if (this.locales.includes(urlFirstPart)) {
            req.nextUrl.locale = urlFirstPart;
            existsRedirect.target = existsRedirect.target.replace(`/${urlFirstPart}`, '');
          }

          const targetSegments = isUrl
            ? existsRedirect.target.split('?')
            : url.pathname.replace(/\/*$/gi, '') + existsRedirect.matchedQueryString;

          const [targetPath, targetQueryString] = isUrl
            ? targetSegments
            : (targetSegments as string)
                .replace(regexParser(existsRedirect.pattern), existsRedirect.target)
                .replace(/^\/\//, '/')
                .split('?');

          const mergedQueryString = existsRedirect.isQueryStringPreserved
            ? mergeURLSearchParams(
                new URLSearchParams(url.search ?? ''),
                new URLSearchParams(targetQueryString || '')
              )
            : targetQueryString || '';

          const prepareNewURL = new URL(
            `${targetPath}${mergedQueryString ? '?' + mergedQueryString : ''}`,
            url.origin
          );

          url.href = prepareNewURL.href;
          url.pathname = prepareNewURL.pathname;
          url.search = prepareNewURL.search;
          url.locale = req.nextUrl.locale;
        }

        /** return Response redirect with http code of redirect type */
        switch (existsRedirect.redirectType) {
          case REDIRECT_TYPE_301: {
            return this.createRedirectResponse(url, res, 301, 'Moved Permanently');
          }
          case REDIRECT_TYPE_302: {
            return this.createRedirectResponse(url, res, 302, 'Found');
          }
          case REDIRECT_TYPE_SERVER_TRANSFER: {
            return this.rewrite(url.href, req, res, true);
          }
          default:
            return res;
        }
      };

      const response = await createResponse();

      debug.redirects('redirects middleware end in %dms: %o', Date.now() - startTimestamp, {
        redirected: response.redirected,
        status: response.status,
        url: response.url,
        headers: this.extractDebugHeaders(response.headers),
      });

      return response;
    } catch (error) {
      console.log('Redirect middleware failed:');
      console.log(error);
      return res;
    }
  };

  /**
   * Method returns RedirectInfo when matches
   * @param {NextRequest} req request
   * @param {string} siteName site name
   * @returns Promise<RedirectInfo | undefined>
   * @private
   */
  private async getExistsRedirect(
    req: NextRequest,
    siteName: string
  ): Promise<RedirectResult | undefined> {
    const { pathname: incomingURL, search: incomingQS = '' } = this.normalizeUrl(
      req.nextUrl.clone()
    );
    const locale = this.getLanguage(req);
    const normalizedPath = incomingURL.replace(/\/*$/gi, '');
    const redirects = await this.redirectsService.fetchRedirects(siteName);
    const language = this.getLanguage(req);
    const modifyRedirects = structuredClone(redirects);
    let matchedQueryString: string | undefined;
    const localePath = `/${locale.toLowerCase()}${normalizedPath}`;

    return modifyRedirects.length
      ? modifyRedirects.find((redirect: RedirectResult) => {
          // process static URL (non-regex) rules
          if (isRegexOrUrl(redirect.pattern) === 'url') {
            const urlArray = redirect.pattern.endsWith('/')
              ? redirect.pattern.slice(0, -1).split('?')
              : redirect.pattern.split('?');
            const patternQS = urlArray[1];
            let patternPath = urlArray[0];
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
            redirect.pattern.replace(new RegExp(`^[^]?/${language}/`, 'gi'), '')
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
              regexParser(redirect.pattern).test(`/${req.nextUrl.locale}${incomingURL}`) ||
              regexParser(redirect.pattern).test(incomingURL) ||
              matchedQueryString
            ) && (redirect.locale ? redirect.locale.toLowerCase() === locale.toLowerCase() : true)
          );
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
  private normalizeUrl(url: NextURL): NextURL {
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
     * When a user clicks on this link, Next.js should generate a link for the middleware, formatted like this:
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

    const newUrl = new URL(`${url.pathname}?${newQueryString}`, url.origin);

    url.search = newUrl.search;
    url.pathname = newUrl.pathname;
    url.href = newUrl.href;

    return url;
  }

  /**
   * Helper function to create a redirect response and remove the x-middleware-next header.
   * @param {NextURL} url The URL to redirect to.
   * @param {Response} res The response object.
   * @param {number} status The HTTP status code of the redirect.
   * @param {string} statusText The status text of the redirect.
   * @returns {NextResponse<unknown>} The redirect response.
   */
  private createRedirectResponse(
    url: NextURL,
    res: Response | undefined,
    status: number,
    statusText: string
  ): NextResponse {
    const redirect = NextResponse.redirect(url, {
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
