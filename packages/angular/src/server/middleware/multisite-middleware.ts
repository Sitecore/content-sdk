import {
  getHostnameFromHostHeader,
  SITE_KEY,
  SiteInfo,
  SiteResolver,
} from '@sitecore-content-sdk/content/site';
import {
  CsdkExpressRequest,
  ExpressMiddleware,
  ExpressNextFunction,
  ExpressResponse,
  CookieOptions,
  BaseMiddlewareOptions,
} from './models';
import { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { SC_PARAMS_HEADER } from '../../loaders/constants';
import debug from '../../debug';
import { getMiddlewareRequest, shouldProcessPath } from './utils';
import { isEditingPreview } from '../utils';
import type { IncomingMessage } from 'http';

/**
 * Configuration options for the multisite middleware.
 * @public
 */
export type MultisiteMiddlewareOptions = BaseMiddlewareOptions &
  SitecoreConfig['multisite'] & {
    sites?: SiteInfo[];
    defaultSite?: string;
  };

const hostnameMatcher = /(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}/;

/**
 * Get the hostname from the request.
 * @param {CsdkExpressRequest} req - The request.
 * @returns {string} The hostname.
 */
export function getHostname(req: CsdkExpressRequest): string {
  return getHostnameFromHostHeader(
    (req.headers?.['x-forwarded-host'] as string | undefined) ||
      (req.headers?.host as string | undefined) ||
      hostnameMatcher.exec(req.url ?? '')?.[0] ||
      '*'
  );
}

/**
 * Create the multisite middleware.
 * @param {MultsiteMiddlewareOptions} options - The options.
 * @returns {ExpressMiddleware} The multisite middleware.
 */
export function createMultisiteMiddleware(options: MultisiteMiddlewareOptions): ExpressMiddleware {
  const siteResolver = new SiteResolver(options.sites ?? []);
  return (req: CsdkExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    try {
      // For browser loader navigations (/_data) routing data comes from the loader payload, not
      // the request; getMiddlewareRequest normalizes both into path/query/data.
      const { path, query, data } = getMiddlewareRequest(req);

      if (options.enabled === false) {
        debug.multisite('multisite middleware disabled');
        return next();
      }

      if (isEditingPreview(data.cookies)) {
        debug.multisite('skipped (editing/preview mode)');
        return next();
      }

      if (!shouldProcessPath(path, options.matcher)) {
        debug.multisite(
          'multisite middleware skipped (path does not match provided include/exclude patterns)'
        );
        return next();
      }

      if (options.skip?.(req)) {
        debug.multisite('multisite middleware skipped (skip predicate)');
        return next();
      }
      const startTimestamp = Date.now();
      debug.multisite('multisite middleware start: %o', {
        path,
        headers: data.headers,
        cookies: data.cookies,
        query,
      });
      let resolvedSite: string;
      const hostname = data.hostname || getHostname(req);

      resolvedSite =
        (query[SITE_KEY] as string | undefined) ||
        (query.site as string | undefined) ||
        (options.useCookieResolution &&
          options.useCookieResolution(req as unknown as IncomingMessage) &&
          (data.cookies?.[SITE_KEY] as string | undefined)) ||
        siteResolver.getByHost(hostname).name;

      if (!resolvedSite) {
        resolvedSite = options.defaultSite ?? '';
      }
      req.scParams = {
        ...(req.scParams || {}),
        siteName: resolvedSite,
      };
      // Also ride the params on a header so they survive Angular's conversion of the
      // Express request to a web Request on the SSR path (same mechanism as editing params).
      req.headers = req.headers ?? {};
      req.headers[SC_PARAMS_HEADER] = JSON.stringify(req.scParams);
      debug.multisite('multisite middleware end in %dms: %o', Date.now() - startTimestamp, {
        resolvedSite,
      });
      if (res.cookie) {
        const defaultCookieAttributes = {
          secure: true,
          httpOnly: true,
          sameSite: 'none',
        } as CookieOptions;
        res.cookie(SITE_KEY, resolvedSite, defaultCookieAttributes);
      } else {
        debug.multisite(
          'could not set site cookie, response does not support cookies. Enable cookieParser in your server configuration to changes this.'
        );
      }
    } catch (error) {
      console.log('Multisite middleware failed:');
      console.log(error);
    }
    next();
  };
}
