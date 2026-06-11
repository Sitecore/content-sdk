import {
  SITE_KEY,
  SiteInfo,
  SiteResolver,
  getHostnameFromHostHeader,
} from '@sitecore-content-sdk/content/site';
import { GraphQLRequestClientFactory } from '@sitecore-content-sdk/core';
import { NextRequest, NextResponse } from 'next/server';
import {
  createGraphQLClientFactory,
  GraphQLClientOptions,
} from '@sitecore-content-sdk/content/client';
import { PREVIEW_COOKIES } from '../editing/utils';
import debug from '../debug';
import { ProxiesContext } from './types';

export const REWRITE_HEADER_NAME = 'x-sc-rewrite';
export const LOCALE_HEADER_NAME = 'x-sc-locale';

/**
 * The interface for the Proxy configuration.
 * @public
 */
export type ProxyBaseConfig = {
  /**
   * function, determines if proxy execution should be skipped, based on cookie, header, or other considerations
   * @param {NextRequest} req request object from proxy handler
   * @param {NextResponse} res response object from proxy handler
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
 * Proxy handler class to be extended by all proxy implementations
 * @public
 */
export abstract class ProxyHandler {
  /**
   * Name of the proxy, used as a key in the context to store information about executed proxies
   */
  abstract get name(): string;

  /**
   * Handler method to execute proxy logic
   * @param {NextRequest} req request
   * @param {NextResponse} res response
   * @param {ProxiesContext} proxiesContext context to share information between proxies
   */
  abstract handle(
    req: NextRequest,
    res: NextResponse,
    proxiesContext?: ProxiesContext
  ): Promise<NextResponse>;
}

/**
 * Base proxy class with common methods
 * @public
 */
export abstract class ProxyBase extends ProxyHandler {
  protected defaultHostname: string;
  protected siteResolver: SiteResolver;

  constructor(protected config: ProxyBaseConfig) {
    super();
    this.siteResolver = new SiteResolver(config.sites);
    this.defaultHostname = config.defaultHostname || 'localhost';
  }

  /**
   * Name of the proxy, used as a key in the context to store information about executed proxies
   */
  get name() {
    return 'ProxyBase';
  }

  /**
   * Determines if mode is preview
   * @param {NextRequest} req request
   * @returns {boolean} is preview
   */
  protected isPreview(req: NextRequest) {
    return !!(
      req.cookies.get(PREVIEW_COOKIES.PRERENDER_BYPASS)?.value ||
      req.cookies.get(PREVIEW_COOKIES.PREVIEW_DATA)?.value
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
    const proxyPrefetch = req.headers.get('x-middleware-prefetch');

    // Some real navigations on different devices may incorrectly include 'prefetch' headers.
    // To avoid skipping personalization in such cases, we treat 'x-middleware-prefetch' as a more reliable signal of true prefetch behavior.
    if (isKnownDevice && proxyPrefetch === '1') {
      return false;
    }

    // Otherwise, standard prefetch detection
    return purpose === 'prefetch' || nextRouterPrefetch === '1' || proxyPrefetch === '1';
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
   * Necessary to avoid proxy issue https://github.com/vercel/next.js/issues/39765
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
   * set by LocaleProxy for app router application
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
    return getHostnameFromHostHeader(
      req.headers.get('x-forwarded-host') || req.headers.get('host') || ''
    );
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
    // NextResponse.rewrite requires a string URL, not a NextURL object
    const response = NextResponse.rewrite(rewriteUrl.href, res);

    // Share rewrite path with following executed proxies
    if (!skipHeader) {
      response.headers.set(REWRITE_HEADER_NAME, rewritePath);
    }

    return response;
  }
}

/**
 * Define a proxy with a list of proxy handlers
 * @param {ProxyHandler[]} proxies List of proxy handlers to execute
 * @public
 */
export const defineProxy = (...proxies: ProxyHandler[]) => {
  return {
    /**
     * Execute all proxies
     * @param {NextRequest} req request
     * @param {NextResponse} [res] response
     * @param {ProxiesContext} [proxiesContext] context to share information between proxies
     */
    exec: async (req: NextRequest, res?: NextResponse, proxiesContext?: ProxiesContext) => {
      const response = res || NextResponse.next();

      debug.common('proxy start');

      const start = Date.now();

      const proxyResponse = await proxies.reduce(
        (p, proxy) =>
          p.then((res) => {
            // Short-circuit the remaining proxies once a previous one
            // denied the request (e.g. PreviewProxy returning 403).
            if (res.status === 403) return res;

            return proxy.handle(req, res, proxiesContext);
          }),
        Promise.resolve(response)
      );

      debug.common('proxy end in %dms', Date.now() - start);

      return proxyResponse;
    },
  };
};
