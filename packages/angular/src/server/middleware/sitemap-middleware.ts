import type { SitecoreClient, SitemapXmlOptions } from '@sitecore-content-sdk/content/client';
import type { SiteInfo } from '@sitecore-content-sdk/content/site';
import { SiteResolver } from '@sitecore-content-sdk/content/site';
import { constants } from '@sitecore-content-sdk/core';
import { ExpressMiddleware, ExpressRequest, ExpressResponse } from './models';
import debug from '../../debug';

const { ERROR_MESSAGES } = constants;

/** @public */
export interface CreateSitemapMiddlewareOptions {
  client: SitecoreClient;
  sites: SiteInfo[];
}

/**
 * Sitemap handler for Express. Mount at `/sitemap.xml` and `/sitemap-:id.xml`.
 * @param {CreateSitemapMiddlewareOptions} options - Middleware options.
 * @public
 */
export function createSitemapMiddleware(
  options: CreateSitemapMiddlewareOptions
): ExpressMiddleware {
  const { client, sites } = options;
  const siteResolver = new SiteResolver(sites);

  return async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
    const idFromQuery = Array.isArray(req.query?.id) ? req.query.id[0] : req.query?.id;
    const id = req.params?.id ?? idFromQuery ?? undefined;
    const headers = req.headers ?? {};
    const reqHost = headers['x-forwarded-host'] || headers.host || '';
    const reqProtocol = headers['x-forwarded-proto'] || 'https';
    const site = siteResolver.getByHost(String(reqHost));

    const sitemapOptions: SitemapXmlOptions = {
      reqHost: String(reqHost),
      reqProtocol: String(reqProtocol),
      id,
      siteName: site.name,
    };

    const startTimestamp = Date.now();

    debug.sitemap('sitemap middleware start: %o', sitemapOptions);

    try {
      const xmlContent = await client.getSiteMap(sitemapOptions);

      debug.sitemap('sitemap middleware end in %dms', Date.now() - startTimestamp);

      res.setHeader?.('Content-Type', 'text/xml;charset=utf-8');
      res.send?.(xmlContent);
    } catch (error) {
      debug.sitemap('sitemap middleware error: %o', error);

      if (error instanceof Error && error.message === 'REDIRECT_404') {
        res.redirect?.('/404');
      } else {
        res.status(500).send?.(`Internal Server Error. ${ERROR_MESSAGES.CONTACT_SUPPORT}`);
      }
    }
  };
}
