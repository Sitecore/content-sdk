import { RedirectCommand } from '@angular/router';
import type { Router } from '@angular/router';
import { RequestContext } from './models';

/**
 * Apply a redirect: internal URLs → RedirectCommand; external URLs → full page navigation.
 * Use in resolvers and in the navigation error handler (fallback) so redirect behavior is consistent.
 * Redirects are not errors; this helper is the single place that defines how to perform them.
 *
 * @param router - Angular Router (for internal redirects)
 * @param location - Target URL (path or full URL)
 * @param options - replaceUrl for internal redirects (default true)
 * @returns RedirectCommand for internal, void after window.location.assign for external
 * @public
 */
export function applyRedirect(
  router: Router,
  location: string,
  options?: { replaceUrl?: boolean }
): RedirectCommand | void {
  const isExternal = /^https?:\/\//i.test(location);
  if (isExternal) {
    if (typeof window !== 'undefined') {
      window.location.assign(location);
    }
    return;
  }
  return new RedirectCommand(router.parseUrl(location), {
    replaceUrl: options?.replaceUrl ?? true,
  });
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
 * Parse query parameters from URL
 * @param {string} url - The URL to parse
 * @returns {Record<string, string | string[] | undefined>} The query parameters
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
 * Convert Headers object to plain object
 * @param {Headers} headers - The Headers object to convert
 * @returns {Record<string, string | string[] | undefined>} The headers
 */
function headersToObject(headers: Headers): Record<string, string | string[] | undefined> {
  const result: Record<string, string | string[] | undefined> = {};
  headers.forEach((value, key) => {
    result[key.toLowerCase()] = value;
  });
  return result;
}

/**
 * Parse cookies from a cookie header string
 * @param {string | null} cookieHeader - The cookie header string to parse
 * @returns {Record<string, string>} The cookies
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
 * Extracts request context from a request object.
 * Supports both Fetch API Request objects (from Angular's REQUEST token) and Express-like request objects.
 * @param {Request | ExpressLikeRequest} req - The request object (Fetch API Request or Express-like object)
 * @returns {RequestContext} The request context
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
export function extractRequestContext(req: Request | ExpressLikeRequest): RequestContext {
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
 * Extract the loader ID from a resolver function if it was created by loaderResolver.
 * @param {Function}fn - The resolver function to check
 * @returns {string | undefined} The loader ID if found, undefined otherwise
 * @internal
 */
export const getLoaderId = (fn: unknown): string | undefined => {
  if (fn && typeof fn === 'function' && LOADER_ID in fn) {
    return (fn as Record<symbol, string>)[LOADER_ID];
  }

  return undefined;
};

/**
 * Symbol used to tag resolver functions with their loader ID.
 * This allows the prefetch service to identify loader resolvers in the route tree.
 * @internal
 */
export const LOADER_ID = Symbol('loaderId');
