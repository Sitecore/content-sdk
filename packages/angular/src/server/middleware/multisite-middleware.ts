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
} from '../models';
import { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { SC_PARAMS_HEADER } from '../../loaders/constants';
import { DEFAULT_VARIANT } from '@sitecore-content-sdk/content/personalize';
import debug from '../../debug';
import { PREVIEW_KEY } from '@sitecore-content-sdk/content/editing';

type MultsiteMiddlewareOptions = SitecoreConfig['multisite'] & {
  sites?: SiteInfo[];
  defaultSite?: string;
  skip?: (req: CsdkExpressRequest) => boolean;
};

const hostnameMatcher = /(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}/;

/**
 *
 * @param req
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
 *
 * @param options
 */
export function createMultisiteMiddleware(options: MultsiteMiddlewareOptions): ExpressMiddleware {
  const siteResolver = new SiteResolver(options.sites ?? []);
  return (req: CsdkExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    try {
      if (req.url.startsWith('/api')) {
        debug.multisite('multisite middleware skipped for /api/* routes');
        return next();
      }
      if (!options.enabled || options.skip?.(req)) {
        debug.multisite('multisite middleware skipped');
        return next();
      }
      const startTimestamp = Date.now();
      debug.multisite('multisite middleware start: %o', {
        url: req.url,
        headers: req.headers,
        cookies: req.cookies,
        query: req.query,
      });
      let resolvedSite: string;
      const hostname = getHostname(req);

      const isSitecorePreview = req.cookies?.[PREVIEW_KEY];

      if (isSitecorePreview) {
        // This cookie is required to be set in the Sitecore Preview mode to support navigation
        // and preserve the site name
        resolvedSite = req.cookies?.[SITE_KEY]!;
      } else {
        resolvedSite =
          (req.query?.[SITE_KEY] as string | undefined) ||
          (req.query?.site as string | undefined) ||
          (options.useCookieResolution &&
            options.useCookieResolution(req as RequestInit) &&
            (req.cookies?.[SITE_KEY] as string | undefined)) ||
          siteResolver.getByHost(hostname).name;
      }

      if (!resolvedSite) {
        resolvedSite = options.defaultSite ?? '';
      }
      req.scParams
        ? (req.scParams.siteName = resolvedSite)
        : (req.scParams = { siteName: resolvedSite, variantId: DEFAULT_VARIANT });
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
