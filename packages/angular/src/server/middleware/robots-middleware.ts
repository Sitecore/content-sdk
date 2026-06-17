import type { SitecoreClient } from '@sitecore-content-sdk/content/client';
import type { SiteInfo } from '@sitecore-content-sdk/content/site';
import { SiteResolver } from '@sitecore-content-sdk/content/site';
import { constants } from '@sitecore-content-sdk/core';
import { ExpressMiddleware, ExpressRequest, ExpressResponse } from '../models';

const { ERROR_MESSAGES } = constants;

/** @public */
export interface CreateRobotsMiddlewareOptions {
  client: SitecoreClient;
  sites: SiteInfo[];
}

/**
 * Robots.txt handler for Express. Mount at `/robots.txt`.
 * @param {CreateRobotsMiddlewareOptions} options - Middleware options.
 * @public
 */
export function createRobotsMiddleware(
  options: CreateRobotsMiddlewareOptions
): ExpressMiddleware {
  const { client, sites } = options;
  const siteResolver = new SiteResolver(sites);

  return async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
    res.setHeader?.('Content-Type', 'text/plain');

    const headers = req.headers ?? {};
    const hostName =
      headers['x-forwarded-host'] || String(headers.host ?? '').split(':')[0] || 'localhost';
    const site = siteResolver.getByHost(String(hostName));

    try {
      const robotsContent = await client.getRobots(site.name);
      if (!robotsContent) {
        res.status(404).send?.('User-agent: *\nDisallow: /');
        return;
      }
      res.status(200).send?.(robotsContent);
    } catch {
      res.status(500).send?.(`Internal Server Error. ${ERROR_MESSAGES.CONTACT_SUPPORT}`);
    }
  };
}
