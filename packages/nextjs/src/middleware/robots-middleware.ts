import { NextApiRequest, NextApiResponse } from 'next';
import { SitecoreClient } from '@sitecore-content-sdk/core/client';
import { SiteInfo } from '../site';
import { ApiMiddlewareBase } from './api-middleware';

/**
 * Middleware for handling robots.txt requests in a Next.js application.
 */
export class RobotsMiddleware extends ApiMiddlewareBase {
  constructor(client: SitecoreClient, sites: SiteInfo[]) {
    super(client, sites);
  }

  protected async handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    res.setHeader('Content-Type', 'text/plain');

    const hostName = req.headers.host?.split(':')[0] || 'localhost';
    const site = this.getSite(hostName);

    try {
      const robotsContent = await this.client.getRobots(site.name);

      if (!robotsContent) {
        return res.status(404).send('User-agent: *\nDisallow: /');
      }

      res.status(200).send(robotsContent);
    } catch {
      res.status(500).send('Internal Server Error');
    }
  }
}
