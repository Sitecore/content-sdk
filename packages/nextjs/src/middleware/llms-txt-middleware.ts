import { NextApiRequest, NextApiResponse } from 'next';
import { SitecoreClient } from '@sitecore-content-sdk/content/client';
import { constants } from '@sitecore-content-sdk/core';
import { SiteInfo, SiteResolver, LLMS_TXT_CONTENT_TYPE, DEFAULT_LLMS_TXT } from '../site';

const { ERROR_MESSAGES } = constants;

/**
 * Middleware for handling llms.txt requests in a Next.js application.
 * @public
 */
export class LlmsTxtMiddleware {
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
    res.setHeader('Content-Type', LLMS_TXT_CONTENT_TYPE);

    const hostName =
      req.headers['x-forwarded-host'] || req.headers.host?.split(':')[0] || 'localhost';
    const site = this.siteResolver.getByHost(hostName);

    try {
      const llmsTxtContent = await this.client.getLlmsTxt(site.name);
      if (!llmsTxtContent) {
        return res.status(404).send(DEFAULT_LLMS_TXT);
      }
      res.status(200).send(llmsTxtContent);
    } catch {
      res.status(500).send(`Internal Server Error. ${ERROR_MESSAGES.CONTACT_SUPPORT}`);
    }
  }
}
