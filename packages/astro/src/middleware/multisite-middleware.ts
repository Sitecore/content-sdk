import type { MiddlewareHandler, APIContext } from 'astro';
import {
  SiteResolver,
  getSiteRewrite,
  SITE_KEY,
  type SiteInfo,
} from '@sitecore-content-sdk/content/site';

/**
 * Configuration for the multisite middleware
 * @public
 */
export type MultisiteMiddlewareConfig = {
  /**
   * List of sites for site resolution
   */
  sites: SiteInfo[];
  /**
   * Default site name to use when hostname cannot be matched
   */
  defaultSite: string;
  /**
   * Fallback hostname in case `host` header is not present
   * @default 'localhost'
   */
  defaultHostname?: string;
  /**
   * List of locales supported by the application.
   * Used to detect locale prefix in the URL path.
   */
  locales?: string[];
  /**
   * Function to determine if site should be resolved from sc_site cookie when present
   * @param {Request} request - The incoming request
   * @returns {boolean} - Whether to use cookie resolution
   */
  useCookieResolution?: (request: Request) => boolean;
  /**
   * Function to determine if the middleware should be skipped for this request
   * @param {Request} request - The incoming request
   * @returns {boolean} - Whether to skip middleware processing
   */
  skip?: (request: Request) => boolean;
  /**
   * Enable or disable the middleware
   * @default true
   */
  enabled?: boolean;
};

/**
 * Parses cookies from a Cookie header string
 * @param {string | null} cookieHeader - The Cookie header value
 * @returns {Record<string, string>} - Parsed cookies as key-value pairs
 */
function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};

  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name && rest.length > 0) {
      cookies[name] = rest.join('=');
    }
    return cookies;
  }, {} as Record<string, string>);
}

/**
 * Extracts the hostname from the request headers
 * @param {Request} request - The incoming request
 * @param {string} defaultHostname - Fallback hostname
 * @returns {string} - The resolved hostname
 */
function getHostname(request: Request, defaultHostname: string): string {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const hostHeader = request.headers.get('host');

  // Remove port from host header if present
  const host = forwardedHost || hostHeader?.split(':')[0];

  return host || defaultHostname;
}

/**
 * Extracts locale from the URL path if it matches one of the configured locales
 * @param {string} pathname - The URL pathname
 * @param {string[]} locales - List of supported locales
 * @returns {{ locale: string | null, pathWithoutLocale: string }} - Extracted locale and remaining path
 */
function extractLocaleFromPath(
  pathname: string,
  locales: string[]
): { locale: string | null; pathWithoutLocale: string } {
  if (!locales.length) {
    return { locale: null, pathWithoutLocale: pathname };
  }

  // Get the first path segment
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0]?.toLowerCase();

  // Check if it matches a locale
  const matchedLocale = locales.find((l) => l.toLowerCase() === firstSegment);

  if (matchedLocale) {
    // Remove the locale from the path
    const pathWithoutLocale = '/' + segments.slice(1).join('/');
    return { locale: matchedLocale, pathWithoutLocale };
  }

  return { locale: null, pathWithoutLocale: pathname };
}

/**
 * Checks if the request should be skipped (static files, API routes, etc.)
 * @param {URL} url - The request URL
 * @returns {boolean} - Whether to skip processing
 */
function shouldSkipRequest(url: URL): boolean {
  const pathname = url.pathname;

  return (
    pathname.includes('.') || // Static files
    pathname.startsWith('/api/') || // API routes
    pathname.startsWith('/_') || // Internal routes (like _astro)
    pathname.startsWith('/sitecore/') // Sitecore API routes
  );
}

/**
 * Creates an Astro middleware for multisite support.
 * Resolves the site based on hostname, query parameters, or cookies,
 * and rewrites the request path to include the site prefix.
 * @param {MultisiteMiddlewareConfig} config - Middleware configuration
 * @returns {MiddlewareHandler} - Astro middleware handler
 * @public
 */
export function createMultisiteMiddleware(config: MultisiteMiddlewareConfig): MiddlewareHandler {
  const {
    sites,
    defaultSite,
    defaultHostname = 'localhost',
    locales = [],
    useCookieResolution,
    skip,
    enabled = true,
  } = config;

  // Initialize the site resolver with the provided sites
  const siteResolver = new SiteResolver(sites);

  return async (context: APIContext, next: () => Promise<Response>): Promise<Response> => {
    const { request, url } = context;

    // Check if middleware is disabled
    if (!enabled) {
      return next();
    }

    // Skip for prerendered (static) pages - rewriting doesn't work for pre-built pages
    // The page will fall back to defaultSite via getSiteRewriteData()
    if (context.isPrerendered) {
      return next();
    }

    // Check if request should be skipped
    if (shouldSkipRequest(url)) {
      return next();
    }

    // Check custom skip function
    if (skip && skip(request)) {
      return next();
    }

    try {
      const pathname = url.pathname;
      const hostname = getHostname(request, defaultHostname);
      const cookies = parseCookies(request.headers.get('cookie'));

      // Determine site name from various sources (in order of priority):
      // 1. Query string parameter (sc_site or site)
      // 2. Cookie (if useCookieResolution allows)
      // 3. Hostname matching via SiteResolver
      // 4. Default site fallback
      let siteName: string;

      const siteFromQuery = url.searchParams.get(SITE_KEY) || url.searchParams.get('site');
      const siteFromCookie = cookies[SITE_KEY];

      if (siteFromQuery) {
        siteName = siteFromQuery;
      } else if (siteFromCookie && useCookieResolution && useCookieResolution(request)) {
        siteName = siteFromCookie;
      } else {
        // Try to resolve by hostname, fallback to default
        try {
          siteName = siteResolver.getByHost(hostname).name;
        } catch {
          // Hostname not matched, use default site
          siteName = defaultSite;
        }
      }

      // Extract locale from path if present
      const { locale, pathWithoutLocale } = extractLocaleFromPath(pathname, locales);

      // Generate the site rewrite path
      const siteRewritePath = getSiteRewrite(pathWithoutLocale, { siteName });

      // Reconstruct the full path with locale prefix if present
      // Format: /{locale}/_site_{siteName}/{rest} or /_site_{siteName}/{path}
      const rewritePath = locale ? `/${locale}${siteRewritePath}` : siteRewritePath;

      // Set site cookie for downstream consumers
      const response = await context.rewrite(rewritePath);

      // Add site name cookie to response for subsequent requests
      response.headers.append(
        'Set-Cookie',
        `${SITE_KEY}=${siteName}; Path=/; SameSite=None; Secure; HttpOnly`
      );

      return response;
    } catch (error) {
      console.error('Multisite middleware failed:', error);
      return next();
    }
  };
}
