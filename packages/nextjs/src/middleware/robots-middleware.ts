import { NextApiRequest, NextApiResponse } from 'next';
import { SitecoreClient } from '@sitecore-content-sdk/content/client';
import { SiteInfo, SiteResolver } from '../site';

/**
 * Middleware for handling robots.txt requests in a Next.js application.
 * @public
 */
export class RobotsMiddleware {
  private client: SitecoreClient;
  private siteResolver: SiteResolver;

  constructor(client: SitecoreClient, sites: SiteInfo[]) {
    this.client = client;
    this.siteResolver = new SiteResolver(sites);
  }

  getHandler() {
    return this.handler.bind(this);
  }

  private async handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    res.setHeader('Content-Type', 'text/plain');

    const hostName =
      req.headers['x-forwarded-host'] || req.headers.host?.split(':')[0] || 'localhost';
    const site = this.siteResolver.getByHost(hostName);

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
