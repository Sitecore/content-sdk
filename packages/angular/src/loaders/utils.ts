import { RedirectCommand } from '@angular/router';
import type { Router } from '@angular/router';
import { CsdkRequestData, CsdkRequestParams } from './models';
import { EDITING_PARAMS_HEADER } from '../server/middleware/editing-render-middleware';
import { EditingPreviewData } from '@sitecore-content-sdk/content/editing';
import { SC_PARAMS_HEADER } from './constants';
import debug from '../debug';

/**
 * Apply a redirect: internal URLs → RedirectCommand; external URLs → full page navigation.
 * Use in resolvers and in the navigation error handler (fallback) so redirect behavior is consistent.
 * Redirects are not errors; this helper is the single place that defines how to perform them.
 * @param {Router} router - Angular Router (for internal redirects)
 * @param {string} location - Target URL (path or full URL)
 * @returns RedirectCommand for internal, void after window.location.assign for external
 * @public
 */
export function applyRedirect(router: Router, location: string): RedirectCommand | void {
  // TODO: implement server-side redirect with custom status code when implementing SXA redirects proxy
  const isExternal = /^https?:\/\//i.test(location);
  if (isExternal) {
    if (typeof window !== 'undefined') {
      window.location.assign(location);
    }
    return;
  }
  return new RedirectCommand(router.parseUrl(location), {});
}

/**
 * Express-like request object interface with Content SDK request params
 */
interface ExpressLikeRequest {
  headers?: Record<string, string | string[] | undefined>;
  cookies?: Record<string, string>;
  query?: Record<string, string | string[] | undefined>;
  scParams?: CsdkRequestParams;
}

interface FetchLikeRequest extends Request {
  scParams?: CsdkRequestParams;
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
 * import { extractRequestData } from '@sitecore-content-sdk/angular/server';
 *
 * // From Express request
 * const requestContext = extractRequestData(expressReq);
 *
 * // From Fetch API Request (Angular's REQUEST token)
 * const requestContext = extractRequestData(request);
 * ```
 * @public
 */
export function extractRequestData(req: FetchLikeRequest | ExpressLikeRequest): CsdkRequestData {
  let hostname: string | undefined;
  let headers: Record<string, string | string[] | undefined> = {};
  let cookies: Record<string, string> = {};
  let query: Record<string, string | string[] | undefined> = {};
  let scPreviewData: EditingPreviewData | undefined;
  let scParams = 'scParams' in req ? req.scParams : undefined;
  // Check if it's a Fetch API Request object - we're in browser loaders flow in this case
  if (req instanceof Request) {
    headers = headersToObject(req.headers);
    cookies = parseCookieHeader(req.headers.get('cookie'));
    query = parseQueryFromUrl(req.url);
    try {
      hostname = new URL(req.url).hostname;
    } catch {
      // empty catch - resolve hostname from host header later
    }
  } else {
    headers = req.headers ?? {};
    cookies = req.cookies ?? {};
    query = req.query ?? {};
  }
  hostname =
    hostname ??
    pickHostnameFromHostHeader(Array.isArray(headers?.host) ? headers?.host[0] : headers?.host);

  const scPreviewDataHeader = headers?.[EDITING_PARAMS_HEADER] as string;
  if (scPreviewDataHeader) {
    try {
      scPreviewData = JSON.parse(scPreviewDataHeader) as EditingPreviewData;
    } catch {
      debug.editing('Failed to parse editing preview data from header');
    }
  }

  // Express request properties don't survive Angular's conversion to a web Request,
  // so middleware-resolved params also ride the SC_PARAMS_HEADER (set alongside req.scParams).
  const scParamsHeader = headers?.[SC_PARAMS_HEADER] as string;
  if (!scParams && scParamsHeader) {
    try {
      scParams = JSON.parse(scParamsHeader) as CsdkRequestParams;
    } catch {
      debug.common('Failed to parse Content SDK request params from header');
    }
  }
  return {
    hostname,
    headers,
    cookies,
    query,
    scPreviewData,
    scParams,
  };
}

/**
 * Pick the hostname from the host header
 * @param {string | undefined} host - The host header
 * @returns {string | undefined} The hostname
 */
function pickHostnameFromHostHeader(host: string | undefined): string | undefined {
  if (!host) return undefined;
  const colon = host.indexOf(':');
  return colon === -1 ? host : host.slice(0, colon);
}
