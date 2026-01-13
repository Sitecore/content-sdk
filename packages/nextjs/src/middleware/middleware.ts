import { SITE_KEY, SiteInfo, SiteResolver } from '@sitecore-content-sdk/core/site';
import { debug, GraphQLRequestClientFactory } from '@sitecore-content-sdk/core';
import { NextRequest, NextResponse } from 'next/server';
import {
  createGraphQLClientFactory,
  GraphQLClientOptions,
} from '@sitecore-content-sdk/core/client';
import { PreviewCookies } from '../editing/utils';

export const REWRITE_HEADER_NAME = 'x-sc-rewrite';
export const LOCALE_HEADER_NAME = 'x-sc-locale';

/**
 * The interface for the Middleware configuration.
 * @public
 */
export type MiddlewareBaseConfig = {
  /**
   * function, determines if middleware execution should be skipped, based on cookie, header, or other considerations
   * @param {NextRequest} req request object from middleware handler
   * @param {NextResponse} res response object from middleware handler
   */
  skip?: (req: NextRequest, res: NextResponse) => boolean;
  /**
   * Fallback hostname in case `host` header is not present
   * @default localhost
   */
  defaultHostname?: string;
  /**
   * Fallback language in locale cannot be extracted from request URL
   * @default 'en'
   */
  defaultLanguage?: string;
  /**
   * Site resolution implementation by name/hostname
   */
  sites: SiteInfo[];
};

/**
 * Middleware class to be extended by all middleware implementations
 * @public
 */
export abstract class Middleware {
  /**
   * Handler method to execute middleware logic
   * @param {NextRequest} req request
   * @param {NextResponse} res response
   */
  abstract handle(req: NextRequest, res: NextResponse): Promise<NextResponse>;
}

/**
 * Base middleware class with common methods
 * @public
 */
export abstract class MiddlewareBase extends Middleware {
  protected defaultHostname: string;
  protected siteResolver: SiteResolver;

  constructor(protected config: MiddlewareBaseConfig) {
    super();
    this.siteResolver = new SiteResolver(config.sites);
    this.defaultHostname = config.defaultHostname || 'localhost';
  }

  /**
   * Determines if mode is preview
   * @param {NextRequest} req request
   * @returns {boolean} is preview
   */
  protected isPreview(req: NextRequest) {
    return !!(
      req.cookies.get(PreviewCookies.PRERENDER_BYPASS)?.value ||
      req.cookies.get(PreviewCookies.PREVIEW_DATA)?.value
    );
  }

  /**
   * Determines if the application is using the app router based on the locale header
   * @param {NextResponse} res response
   * @returns {boolean} true if app router is used
   */
  protected isAppRouter(res: NextResponse): boolean {
    return !!this.getLanguageFromHeader(res);
  }

  /**
   * Determines if the request is a Next.js (next/link) prefetch request
   * @param {NextRequest} req request
   * @returns {boolean} is prefetch
   */
  protected isPrefetch(req: NextRequest): boolean {
    const isMobile = req.headers.get('sec-ch-ua-mobile') === '?1';
    const userAgent = req.headers.get('user-agent') || '';
    const isKnownPlatform = /iPhone|Mac|Linux|Windows|Android/i.test(userAgent);
    const isKnownDevice = isMobile || isKnownPlatform;

    const purpose = req.headers.get('purpose');
    const nextRouterPrefetch = req.headers.get('Next-Router-Prefetch');
    const middlewarePrefetch = req.headers.get('x-middleware-prefetch');

    // Some real navigations on different devices may incorrectly include 'prefetch' headers.
    // To avoid skipping personalization in such cases, we treat 'x-middleware-prefetch' as a more reliable signal of true prefetch behavior.
    if (isKnownDevice && middlewarePrefetch === '1') {
      return false;
    }

    // Otherwise, standard prefetch detection
    return purpose === 'prefetch' || nextRouterPrefetch === '1' || middlewarePrefetch === '1';
  }
  protected disabled(req: NextRequest, res: NextResponse) {
    const { pathname } = req.nextUrl;

    return (
      pathname.startsWith('/api/') || // Ignore Next.js API calls
      pathname.startsWith('/sitecore/') || // Ignore Sitecore API calls
      pathname.startsWith('/_next') || // Ignore next service calls
      (this.config.skip && this.config.skip(req, res))
    );
  }

  /**
   * Safely extract all headers for debug logging
   * Necessary to avoid middleware issue https://github.com/vercel/next.js/issues/39765
   * @param {Headers} incomingHeaders Incoming headers
   * @returns Object with headers as key/value pairs
   */
  protected extractDebugHeaders(incomingHeaders: Headers) {
    const headers = {} as { [key: string]: string };
    incomingHeaders.forEach((value, key) => (headers[key] = value));
    return headers;
  }

  /**
   * Provides used language
   * @param {NextRequest} req request
   * @param {NextResponse} res response
   * @returns {string} language
   */
  protected getLanguage(req: NextRequest, res?: NextResponse): string {
    return (
      this.getLanguageFromHeader(res) ||
      req.nextUrl.locale ||
      req.nextUrl.defaultLocale ||
      this.config.defaultLanguage ||
      'en'
    );
  }

  /**
   * Extract language from locale header of the response
   * set by LocaleMiddleware for app router application
   * @param {NextResponse} res response
   * @returns {string | undefined} language or undefined if not found
   */
  protected getLanguageFromHeader(res?: NextResponse): string | undefined {
    return res?.headers.get(LOCALE_HEADER_NAME) ?? undefined;
  }

  /**
   * Extract 'host' header
   * @param {NextRequest} req request
   */
  protected getHostHeader(req: NextRequest) {
    return req.headers.get('x-forwarded-host') || req.headers.get('host')?.split(':')[0];
  }

  /**
   * Get site information. If site name is stored in cookie, use it, otherwise resolve by hostname
   * - If site can't be resolved by site name cookie use default site info based on provided parameters
   * - If site can't be resolved by hostname throw an error
   * @param {NextRequest} req request
   * @param {NextResponse} [res] response
   * @returns {SiteInfo} site information
   */
  protected getSite(req: NextRequest, res?: NextResponse): SiteInfo {
    const siteNameCookie = res?.cookies.get(SITE_KEY)?.value;
    const hostname = this.getHostHeader(req) || this.defaultHostname;

    if (siteNameCookie) {
      // Usually we should be able to resolve site by cookie
      // in case of Sitecore Preview mode, there can be a case that new site was created
      // but it's not present in the sitemap, so we fallback to default site info
      return (
        this.siteResolver.getByName(siteNameCookie) || {
          name: siteNameCookie,
          language: this.getLanguage(req),
          hostName: '*',
        }
      );
    }

    return this.siteResolver.getByHost(hostname);
  }

  protected getClientFactory(graphQLOptions: GraphQLClientOptions): GraphQLRequestClientFactory {
    return createGraphQLClientFactory(graphQLOptions);
  }

  /**
   * Create a rewrite response
   * @param {string} rewritePath the destionation path
   * @param {NextRequest} req the current request
   * @param {NextResponse} res the current response
   * @param {boolean} [skipHeader] don't write 'x-sc-rewrite' header
   */
  protected rewrite(
    rewritePath: string,
    req: NextRequest,
    res: NextResponse,
    skipHeader?: boolean
  ): NextResponse {
    // Note an absolute URL is required: https://nextjs.org/docs/messages/middleware-relative-urls
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = rewritePath;
    const response = NextResponse.rewrite(rewriteUrl, res);

    // Share rewrite path with following executed middlewares
    if (!skipHeader) {
      response.headers.set(REWRITE_HEADER_NAME, rewritePath);
    }

    return response;
  }
}

/**
 * Define a middleware with a list of middlewares
 * @param {Middleware[]} middlewares List of middlewares to execute
 * @public
 */
export const defineMiddleware = (...middlewares: Middleware[]) => {
  return {
    /**
     * Execute all middlewares
     * @param {NextRequest} req request
     * @param {NextResponse} [res] response
     */
    exec: async (req: NextRequest, res?: NextResponse) => {
      const response = res || NextResponse.next();

      debug.common('middleware start');

      const start = Date.now();

      const middlewareResponse = await middlewares.reduce(
        (p, middleware) => p.then((res) => middleware.handle(req, res)),
        Promise.resolve(response)
      );

      debug.common('middleware end in %dms', Date.now() - start);

      return middlewareResponse;
    },
  };
};
