import { SiteInfo, SiteResolver, getSiteRewrite, SITE_KEY } from '@sitecore-content-sdk/core/site';
import { debug } from '@sitecore-content-sdk/core';
import { ExpressRequest, ExpressResponse, ExpressNextFunction } from './express-data-handler';
import { DEFAULT_DATA_ENDPOINT } from './config';

/**
 * Extended Express Request interface with cookie support
 * @public
 */
export interface MultisiteExpressRequest extends ExpressRequest {
  cookies?: Record<string, string>;
  headers?: Record<string, string | string[] | undefined>;
}

/**
 * Extended Express Response interface with cookie support
 * @public
 */
export interface MultisiteExpressResponse extends ExpressResponse {
  cookie(name: string, value: string, options?: CookieOptions): MultisiteExpressResponse;
  redirect(url: string): void;
}

/**
 * Express-compatible middleware type for multisite
 * @public
 */
export type MultisiteExpressMiddleware = (
  req: MultisiteExpressRequest,
  res: MultisiteExpressResponse,
  next: ExpressNextFunction
) => void | Promise<void>;

/**
 * Cookie options for setting cookies
 * @public
 */
export interface CookieOptions {
  /**
   * the Secure attribute of the cookie
   */
  secure?: boolean;
  /**
   * the HttpOnly attribute of the cookie
   */
  httpOnly?: boolean;
  /**
   * the SameSite attribute of the cookie
   */
  sameSite?: 'lax' | 'strict' | 'none';
  /**
   * the Max-Age attribute of the cookie (in seconds)
   */
  maxAge?: number;
}

/**
 * Options for the Express multisite middleware
 * @public
 */
export interface ExpressMultisiteMiddlewareOptions {
  /**
   * Array of site configurations
   */
  sites: SiteInfo[];
  /**
   * Fallback hostname in case 'host' header is not present
   * @default 'localhost'
   */
  defaultHostname?: string;
  /**
   * The data endpoint path used by loaders
   * @default '/_data'
   */
  dataEndpoint?: string;
  /**
   * The editing render API prefix path
   * @default '/api/editing/render'
   */
  editingRenderPath?: string;
  /**
   * Cookie attributes for the site cookie
   */
  cookieAttributes?: CookieOptions;
  /**
   * Function to determine if a request should be skipped by the middleware
   */
  skip?: (req: MultisiteExpressRequest) => boolean;
}

/**
 * Default editing render path
 */
export const DEFAULT_EDITING_RENDER_PATH = '/api/editing/render';

/**
 * Get the host header from the request
 * @param req - The Express request
 * @returns The host header value or undefined
 */
function getHostHeader(req: MultisiteExpressRequest): string | undefined {
  const headers = req.headers || {};
  const forwardedHost = headers['x-forwarded-host'];
  const host = headers.host;

  const hostValue = forwardedHost || host;
  if (typeof hostValue === 'string') {
    return hostValue.split(':')[0];
  }
  if (Array.isArray(hostValue) && hostValue.length > 0) {
    return hostValue[0].split(':')[0];
  }
  return undefined;
}

/**
 * Parse URL to extract pathname and search params
 * @param url - The URL string
 * @returns Object with pathname and search params
 */
function parseUrl(url: string): { pathname: string; searchParams: URLSearchParams } {
  try {
    const urlObj = new URL(url, 'http://localhost');
    return {
      pathname: urlObj.pathname,
      searchParams: urlObj.searchParams,
    };
  } catch {
    return {
      pathname: url.split('?')[0],
      searchParams: new URLSearchParams(url.split('?')[1] || ''),
    };
  }
}

/**
 * Check if the request is a file request (has extension)
 * @param pathname - The pathname to check
 * @returns true if the pathname contains a file extension
 */
function isFileRequest(pathname: string): boolean {
  return pathname.includes('.');
}

/**
 * Check if the request should be skipped
 * @param pathname - The pathname to check
 * @returns true if the request should be skipped
 */
function shouldSkipRequest(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/__') ||
    pathname.startsWith('/favicon') ||
    isFileRequest(pathname)
  );
}

/**
 * Create an Express middleware for multisite support.
 * This middleware resolves the site based on the hostname and rewrites the request path
 * to include the site name for proper routing.
 *
 * Features:
 * - Resolves site by hostname using SiteResolver
 * - Handles SITE_KEY cookie for site persistence
 * - Handles editing render requests by extracting site from query params
 * - Rewrites loader API data requests to include site context
 * - Rewrites request paths to encode site name
 *
 * @param options - Handler options including the sites configuration
 * @returns Express middleware that handles multisite routing
 * @example
 * ```typescript
 * import express from 'express';
 * import { createExpressMultisiteMiddleware } from '@sitecore-content-sdk/angular';
 * import sites from './sites.json';
 *
 * const app = express();
 * app.use(express.json());
 *
 * // Mount the multisite middleware (should be early in the middleware chain)
 * app.use(createExpressMultisiteMiddleware({ sites }));
 * ```
 * @public
 */
export function createExpressMultisiteMiddleware(
  options: ExpressMultisiteMiddlewareOptions
): MultisiteExpressMiddleware {
  const {
    sites,
    defaultHostname = 'localhost',
    dataEndpoint = DEFAULT_DATA_ENDPOINT,
    editingRenderPath = DEFAULT_EDITING_RENDER_PATH,
    cookieAttributes = {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    },
    skip,
  } = options;

  const siteResolver = new SiteResolver(sites);

  return async (
    req: MultisiteExpressRequest,
    res: MultisiteExpressResponse,
    next: ExpressNextFunction
  ): Promise<void> => {
    const startTimestamp = Date.now();
    const { pathname, searchParams } = parseUrl(req.url);

    debug.multisite('multisite middleware start: %o', {
      url: req.url,
      pathname,
      method: req.method,
    });

    try {
      // Check if middleware should be skipped via custom skip function
      if (skip && skip(req)) {
        debug.multisite('skipped (custom skip function)');
        next();
        return;
      }

      // Skip static files and internal paths
      if (shouldSkipRequest(pathname)) {
        debug.multisite('skipped (static file or internal path)');
        next();
        return;
      }

      const hostname = getHostHeader(req) || defaultHostname;
      let siteName: string | undefined;

      // Priority 1: Check if this is an editing render request
      // Extract site from 'site' or 'sc_site' query parameter
      if (pathname.startsWith(editingRenderPath)) {
        const siteParam = searchParams.get('site') || searchParams.get('sc_site');
        if (siteParam) {
          siteName = siteParam;
          debug.multisite('site from editing render query param: %s', siteName);

          // Set the SITE_KEY cookie for subsequent requests
          if (res.cookie) {
            res.cookie(SITE_KEY, siteName, cookieAttributes);
            debug.multisite('set SITE_KEY cookie: %s', siteName);
          }
        }
      }

      // Priority 2: Check SITE_KEY cookie
      if (!siteName && req.cookies && req.cookies[SITE_KEY]) {
        siteName = req.cookies[SITE_KEY];
        debug.multisite('site from SITE_KEY cookie: %s', siteName);
      }

      // Priority 3: Resolve by hostname
      if (!siteName) {
        try {
          const site = siteResolver.getByHost(hostname);
          siteName = site.name;
          debug.multisite('site resolved by hostname %s: %s', hostname, siteName);
        } catch {
          // If we can't resolve the site, let the request pass through
          debug.multisite('could not resolve site for hostname %s, skipping', hostname);
          next();
          return;
        }
      }

      // Handle loader API data requests - rewrite URL in request payload only
      // Do NOT rewrite the request path, otherwise the data handler won't match the endpoint
      if (pathname === dataEndpoint && req.method === 'POST' && req.body) {
        const body = req.body as Record<string, unknown> & { url?: string };
        if (body.url) {
          // Rewrite the URL in the request body to include site prefix
          const originalUrl = body.url;
          body.url = getSiteRewrite(body.url, { siteName });
          debug.multisite('rewrote loader data request URL: %s -> %s', originalUrl, body.url);
        }

        // Set site cookie for response but don't rewrite the path
        if (res.cookie) {
          res.cookie(SITE_KEY, siteName, cookieAttributes);
        }

        debug.multisite('multisite middleware end in %dms: %o', Date.now() - startTimestamp, {
          originalPath: pathname,
          siteName,
          isDataEndpoint: true,
        });

        next();
        return;
      }

      // Rewrite the request URL to include site prefix (for non-data endpoint requests)
      const rewritePath = getSiteRewrite(pathname, { siteName });

      // Update the request URL with the rewritten path
      // Preserve query string if present
      const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
      req.url = rewritePath + queryString;

      // Set site cookie for response
      if (res.cookie) {
        res.cookie(SITE_KEY, siteName, cookieAttributes);
      }

      debug.multisite('multisite middleware end in %dms: %o', Date.now() - startTimestamp, {
        originalPath: pathname,
        rewritePath,
        siteName,
      });

      next();
    } catch (error) {
      console.log('Multisite middleware failed:');
      console.log(error);
      next();
    }
  };
}
