import { NextApiRequest, NextApiResponse } from 'next';
import { SitecoreClient, SitemapXmlOptions } from '@sitecore-content-sdk/core/client';

/**
 * Middleware for handling sitemap requests in a Next.js application.
 * Encapsulates all HTTP-related logic for sitemap generation and delivery.
 */
export class SitemapMiddleware {
  private client: SitecoreClient;

  constructor(client: SitecoreClient) {
    this.client = client;
  }

  getHandler() {
    return this.handler.bind(this);
  }

  private async handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    const reqHost = req.headers.host || '';
    const reqProtocol = req.headers['x-forwarded-proto'] || 'https';
    const site = this.client.resolveSite(reqHost);

    const options: SitemapXmlOptions = { reqHost, reqProtocol, id, siteName: site.name };

    try {
      const xmlContent = await this.client.getSiteMap(options);
      res.setHeader('Content-Type', 'text/xml;charset=utf-8');

      res.send(xmlContent);
    } catch (error) {
      if (error instanceof Error && error.message === 'REDIRECT_404') {
        res.redirect('/404');
      } else {
        res.status(500).send('Internal Server Error');
      }
    }
  }
}
