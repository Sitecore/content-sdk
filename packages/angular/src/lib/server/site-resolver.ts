import { SiteInfo, SiteResolver, SITE_KEY } from '@sitecore-content-sdk/core/site';
import { debug } from '@sitecore-content-sdk/core';

/**
 * Request context containing information from the incoming HTTP request.
 * Used for site resolution and other request-dependent operations in loaders.
 * @public
 */
export interface RequestContext {
  /**
   * The hostname from the request (without port)
   */
  hostname?: string;
  /**
   * Cookies from the request
   */
  cookies?: Record<string, string>;
  /**
   * Query parameters from the request
   */
  query?: Record<string, string | string[] | undefined>;
  /**
   * Headers from the request
   */
  headers?: Record<string, string | string[] | undefined>;
}

/**
 * Options for the site resolver
 * @public
 */
export interface SiteResolverOptions {
  /**
   * Array of site configurations
   */
  sites: SiteInfo[];
  /**
   * Default site name to use if resolution fails
   */
  defaultSite: string;
  /**
   * Fallback hostname when host header is not present
   * @default 'localhost'
   */
  defaultHostname?: string;
}

/**
 * Result of site resolution
 * @public
 */
export interface SiteResolutionResult {
  /**
   * The resolved site info
   */
  site: SiteInfo;
  /**
   * How the site was resolved
   */
  source: 'query' | 'cookie' | 'hostname' | 'default';
}

/**
 * Get the host from request context
 * @param context - The request context
 * @param defaultHostname - Default hostname to use if not found
 * @returns The hostname
 */
function getHostFromContext(
  context: RequestContext,
  defaultHostname: string
): string {
  const headers = context.headers || {};
  const forwardedHost = headers['x-forwarded-host'];
  const host = headers.host;

  const hostValue = forwardedHost || host;
  if (typeof hostValue === 'string') {
    return hostValue.split(':')[0];
  }
  if (Array.isArray(hostValue) && hostValue.length > 0) {
    return hostValue[0].split(':')[0];
  }

  return context.hostname || defaultHostname;
}

/**
 * Get a query parameter value as a string
 * @param query - The query parameters
 * @param key - The key to get
 * @returns The value as a string or undefined
 */
function getQueryParam(
  query: Record<string, string | string[] | undefined> | undefined,
  key: string
): string | undefined {
  if (!query) return undefined;
  const value = query[key];
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return undefined;
}

/**
 * Creates a site resolver function that can be used to resolve sites from request context.
 * This function can be used in loaders to determine the current site.
 *
 * @param options - Configuration options including sites array and default site
 * @returns A function that resolves the site from a given request context
 *
 * @example
 * ```typescript
 * import { createSiteResolver } from '@sitecore-content-sdk/angular/server';
 * import sites from './sites.json';
 * import config from './sitecore.config';
 *
 * const resolveSite = createSiteResolver({
 *   sites,
 *   defaultSite: config.defaultSite,
 * });
 *
 * // In a loader
 * export const pageLoader: LoaderFn = async (ctx) => {
 *   const { site } = resolveSite(ctx.requestContext);
 *   return client.getPage(ctx.url, { site: site.name });
 * };
 * ```
 * @public
 */
export function createSiteResolver(
  options: SiteResolverOptions
): (context: RequestContext) => SiteResolutionResult {
  const { sites, defaultSite, defaultHostname = 'localhost' } = options;
  const siteResolver = new SiteResolver(sites);

  return (context: RequestContext): SiteResolutionResult => {
    const query = context.query || {};
    const cookies = context.cookies || {};

    // Priority 1: Check query parameters (for editing mode)
    const siteFromQuery = getQueryParam(query, 'site') || getQueryParam(query, 'sc_site');
    if (siteFromQuery) {
      const site = siteResolver.getByName(siteFromQuery);
      if (site) {
        debug.multisite('site resolved from query param: %s', siteFromQuery);
        return { site, source: 'query' };
      }
    }

    // Priority 2: Check SITE_KEY cookie
    const siteFromCookie = cookies[SITE_KEY];
    if (siteFromCookie) {
      const site = siteResolver.getByName(siteFromCookie);
      if (site) {
        debug.multisite('site resolved from cookie: %s', siteFromCookie);
        return { site, source: 'cookie' };
      }
    }

    // Priority 3: Resolve by hostname
    const hostname = getHostFromContext(context, defaultHostname);
    try {
      const site = siteResolver.getByHost(hostname);
      debug.multisite('site resolved by hostname %s: %s', hostname, site.name);
      return { site, source: 'hostname' };
    } catch {
      debug.multisite('could not resolve site for hostname %s, using default', hostname);
    }

    // Priority 4: Use default site
    const defaultSiteInfo = siteResolver.getByName(defaultSite);
    if (defaultSiteInfo) {
      debug.multisite('using default site: %s', defaultSite);
      return { site: defaultSiteInfo, source: 'default' };
    }

    // Fallback: create a basic site info if default site not found in sites array
    debug.multisite('default site not found in sites array, creating fallback');
    return {
      site: {
        name: defaultSite,
        hostName: defaultHostname,
        language: 'en',
      },
      source: 'default',
    };
  };
}

/**
 * Express-like request object interface
 */
interface ExpressLikeRequest {
  headers?: Record<string, string | string[] | undefined>;
  cookies?: Record<string, string>;
  query?: Record<string, string | string[] | undefined>;
}

/**
 * Parse cookies from a cookie header string
 */
function parseCookieHeader(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name) {
      cookies[name] = rest.join('=');
    }
  });
  return cookies;
}

/**
 * Convert Headers object to plain object
 */
function headersToObject(headers: Headers): Record<string, string | string[] | undefined> {
  const result: Record<string, string | string[] | undefined> = {};
  headers.forEach((value, key) => {
    result[key.toLowerCase()] = value;
  });
  return result;
}

/**
 * Parse query parameters from URL
 */
function parseQueryFromUrl(url: string): Record<string, string | string[] | undefined> {
  try {
    const urlObj = new URL(url);
    const query: Record<string, string | string[] | undefined> = {};
    urlObj.searchParams.forEach((value, key) => {
      const existing = query[key];
      if (existing) {
        if (Array.isArray(existing)) {
          existing.push(value);
        } else {
          query[key] = [existing, value];
        }
      } else {
        query[key] = value;
      }
    });
    return query;
  } catch {
    return {};
  }
}

/**
 * Extracts request context from a request object.
 * Supports both Fetch API Request objects (from Angular's REQUEST token) and Express-like request objects.
 *
 * @param req - The request object (Fetch API Request or Express-like object)
 * @returns The request context
 *
 * @example
 * ```typescript
 * import { extractRequestContext } from '@sitecore-content-sdk/angular/server';
 *
 * // From Express request
 * const requestContext = extractRequestContext(expressReq);
 *
 * // From Fetch API Request (Angular's REQUEST token)
 * const requestContext = extractRequestContext(request);
 * ```
 * @public
 */
export function extractRequestContext(
  req: Request | ExpressLikeRequest
): RequestContext {
  // Check if it's a Fetch API Request object
  if (req instanceof Request) {
    const headers = headersToObject(req.headers);
    const cookies = parseCookieHeader(req.headers.get('cookie'));
    const query = parseQueryFromUrl(req.url);

    // Extract hostname from URL
    let hostname: string | undefined;
    try {
      hostname = new URL(req.url).hostname;
    } catch {
      // URL parsing failed, hostname will be resolved from headers
    }

    return {
      hostname,
      headers,
      cookies,
      query,
    };
  }

  // Express-like request object
  return {
    headers: req.headers,
    cookies: req.cookies,
    query: req.query,
  };
}

/**
 * Re-export SiteInfo for convenience
 */
export { SiteInfo };
