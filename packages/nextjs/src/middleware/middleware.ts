﻿import { SITE_KEY, SiteInfo, SiteResolver } from '@sitecore-content-sdk/core/site';
import { debug } from '@sitecore-content-sdk/core';
import { NextRequest, NextFetchEvent, NextResponse } from 'next/server';

export const REWRITE_HEADER_NAME = 'x-sc-rewrite';

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
 */
export abstract class Middleware {
  /**
   * Handler method to execute middleware logic
   * @param {NextRequest} req request
   * @param {NextResponse} res response
   * @param {NextFetchEvent} ev fetch event
   */
  abstract handle(req: NextRequest, res: NextResponse, ev: NextFetchEvent): Promise<NextResponse>;
}

/**
 * Base middleware class with common methods
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
   * @returns {string} language
   */
  protected getLanguage(req: NextRequest) {
    return req.nextUrl.locale || req.nextUrl.defaultLocale || this.config.defaultLanguage || 'en';
  }

  /**
   * Extract 'host' header
   * @param {NextRequest} req request
   */
  protected getHostHeader(req: NextRequest) {
    return req.headers.get('host')?.split(':')[0];
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
 */
export const defineMiddleware = (...middlewares: Middleware[]) => {
  return {
    /**
     * Execute all middlewares
     * @param {NextRequest} req request
     * @param {NextFetchEvent} ev fetch event
     * @param {NextResponse} [res] response
     */
    exec: async (req: NextRequest, ev: NextFetchEvent, res?: NextResponse) => {
      const response = res || NextResponse.next();

      debug.common('middleware start');

      const start = Date.now();

      const middlewareResponse = await middlewares.reduce(
        (p, middleware) => p.then((res) => middleware.handle(req, res, ev)),
        Promise.resolve(response)
      );

      debug.common('middleware end in %dms', Date.now() - start);

      return middlewareResponse;
    },
  };
};
