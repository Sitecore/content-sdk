import { NextApiRequest, NextApiResponse } from 'next';
import { SitecoreClient } from '@sitecore-content-sdk/core/client';

/**
 * Middleware for handling robots.txt requests in a Next.js application.
 */
export class RobotsMiddleware {
  private client: SitecoreClient;

  constructor(client: SitecoreClient) {
    this.client = client;
  }

  getHandler() {
    return this.handler.bind(this);
  }

  private async handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    res.setHeader('Content-Type', 'text/plain');

    const hostName = req.headers.host?.split(':')[0] || 'localhost';
    const site = this.client.resolveSite(hostName);

    try {
      const robotsContent = await this.client.getRobots({ siteName: site.name });

      if (!robotsContent) {
        return res.status(404).send('User-agent: *\nDisallow: /');
      }

      res.status(200).send(robotsContent);
    } catch {
      res.status(500).send('Internal Server Error');
    }
  }
}
