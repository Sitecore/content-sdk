import { SiteInfo, SiteResolver } from '@sitecore-content-sdk/core/site';
import { debug } from '@sitecore-content-sdk/core';
import { NextRequest, NextFetchEvent, NextResponse } from 'next/server';

export type MiddlewareBaseConfig = {
  /**
   * function, determines if middleware should be turned off, based on cookie, header, or other considerations
   * @param {NextRequest} [req] request object from middleware handler
   * @param {NextResponse} [res] response object from middleware handler
   */
  disabled?: (req?: NextRequest, res?: NextResponse) => boolean;
  /**
   * Function used to determine if route should be excluded.
   * By default, files (pathname.includes('.')), Next.js API routes (pathname.startsWith('/api/')), and Sitecore API routes (pathname.startsWith('/sitecore/')) are ignored.
   * This is an important performance consideration since Next.js Edge middleware runs on every request.
   * @param {string} pathname The pathname
   * @returns {boolean} Whether to exclude the route
   */
  excludeRoute?: (pathname: string) => boolean;
  /**
   * Fallback hostname in case `host` header is not present
   * @default localhost
   */
  defaultHostname?: string;
  /**
   * Site resolution implementation by name/hostname
   */
  siteResolver: SiteResolver;
};

/**
 * Middleware class to be extended by all middleware implementations
 */
export abstract class Middleware {
  /**
   * Handler method to execute middleware logic
   * @param {NextRequest} req request
   * @param {NextResponse} res response
   * @param {NextFetchEvent} ev fetch event
   */
  abstract handler(req: NextRequest, res: NextResponse, ev: NextFetchEvent): Promise<NextResponse>;
}

/**
 * Base middleware class with common methods
 */
export abstract class MiddlewareBase extends Middleware {
  protected SITE_SYMBOL = 'sc_site';
  protected REWRITE_HEADER_NAME = 'x-sc-rewrite';
  protected defaultHostname: string;

  constructor(protected config: MiddlewareBaseConfig) {
    super();
    this.defaultHostname = config.defaultHostname || 'localhost';
  }

  /**
   * Determines if mode is preview
   * @param {NextRequest} req request
   * @returns {boolean} is preview
   */
  protected isPreview(req: NextRequest) {
    return !!(
      req.cookies.get('__prerender_bypass')?.value || req.cookies.get('__next_preview_data')?.value
    );
  }

  /**
   * Determines if the request is a Next.js (next/link) prefetch request
   * @param {NextRequest} req request
   * @returns {boolean} is prefetch
   */
  protected isPrefetch(req: NextRequest): boolean {
    return (
      // eslint-disable-next-line prettier/prettier
      req.headers.get('purpose') === 'prefetch' || req.headers.get('Next-Router-Prefetch') === '1' // Pages Router // App Router
    );
  }

  protected excludeRoute(pathname: string) {
    return (
      pathname.startsWith('/api/') || // Ignore Next.js API calls
      pathname.startsWith('/sitecore/') || // Ignore Sitecore API calls
      pathname.startsWith('/_next') || // Ignore next service calls
      (this.config?.excludeRoute && this.config?.excludeRoute(pathname))
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
   * @returns {string} language
   */
  protected getLanguage(req: NextRequest) {
    return req.nextUrl.locale || req.nextUrl.defaultLocale || 'en';
  }

  /**
   * Extract 'host' header
   * @param {NextRequest} req request
   */
  protected getHostHeader(req: NextRequest) {
    return req.headers.get('host')?.split(':')[0];
  }

  /**
   * Get site information.
   * Can not be used in **Preview** mode, since site will not be resolved
   * @param {NextRequest} req request
   * @param {NextResponse} [res] response
   * @returns {SiteInfo} site information
   */
  protected getSite(req: NextRequest, res?: NextResponse): SiteInfo {
    const siteNameCookie = res?.cookies.get(this.SITE_SYMBOL)?.value;

    if (siteNameCookie) return this.config.siteResolver.getByName(siteNameCookie);

    const hostname = this.getHostHeader(req) || this.defaultHostname;

    return this.config.siteResolver.getByHost(hostname);
  }

  /**
   * Create a rewrite response
   * @param {string} rewritePath the destionation path
   * @param {NextRequest} req the current request
   * @param {NextResponse} res the current response
   */
  protected rewrite(rewritePath: string, req: NextRequest, res: NextResponse): NextResponse {
    // Note an absolute URL is required: https://nextjs.org/docs/messages/middleware-relative-urls
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = rewritePath;

    const response = NextResponse.rewrite(rewriteUrl, res);

    // Share rewrite path with following executed middlewares
    response.headers.set(this.REWRITE_HEADER_NAME, rewritePath);

    return response;
  }
}

/**
 * Define a middleware with a list of middlewares
 * @param {Middleware[]} middlewares List of middlewares to execute
 */
export const defineMiddleware = (...middlewares: Middleware[]) => {
  return {
    exec: async (req: NextRequest, res: NextResponse, ev: NextFetchEvent) => {
      debug.common('middleware start');

      const start = Date.now();

      const middlewareResponse = await middlewares.reduce(
        (p, middleware) => p.then((res) => middleware.handler(req, res, ev)),
        Promise.resolve(res)
      );

      debug.common('middleware end in %dms', Date.now() - start);

      return middlewareResponse;
    },
  };
};
