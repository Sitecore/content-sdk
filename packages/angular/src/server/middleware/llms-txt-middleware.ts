import type { SitecoreClient } from '@sitecore-content-sdk/content/client';
import type { SiteInfo } from '@sitecore-content-sdk/content/site';
import {
  SiteResolver,
  LLMS_TXT_CONTENT_TYPE,
  DEFAULT_LLMS_TXT,
} from '@sitecore-content-sdk/content/site';
import { constants } from '@sitecore-content-sdk/core';
import { ExpressMiddleware, ExpressRequest, ExpressResponse } from './models';
import debug from '../../debug';

const { ERROR_MESSAGES } = constants;

/** @public */
export interface CreateLlmsTxtMiddlewareOptions {
  client: SitecoreClient;
  sites: SiteInfo[];
}

/**
 * llms.txt handler for Express. Mount at `/llms.txt`.
 * Serves the llms.txt content managed via SitecoreAI for the site resolved by host name.
 * @param {CreateLlmsTxtMiddlewareOptions} options - Middleware options.
 * @public
 */
export function createLlmsTxtMiddleware(
  options: CreateLlmsTxtMiddlewareOptions
): ExpressMiddleware {
  const { client, sites } = options;
  const siteResolver = new SiteResolver(sites);

  return async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
    res.setHeader?.('Content-Type', LLMS_TXT_CONTENT_TYPE);

    const headers = req.headers ?? {};
    const hostName =
      headers['x-forwarded-host'] || String(headers.host ?? '').split(':')[0] || 'localhost';
    const site = siteResolver.getByHost(String(hostName));

    const startTimestamp = Date.now();

    debug.llmsTxt('llms.txt middleware start: %o', { hostName, siteName: site.name });

    try {
      const llmsTxtContent = await client.getLlmsTxt({ siteName: site.name });

      debug.llmsTxt('llms.txt middleware end in %dms', Date.now() - startTimestamp);

      if (!llmsTxtContent) {
        res.status(404).send?.(DEFAULT_LLMS_TXT);
        return;
      }
      res.status(200).send?.(llmsTxtContent);
    } catch (error) {
      debug.llmsTxt('llms.txt middleware error: %o', error);

      res.status(500).send?.(`Internal Server Error. ${ERROR_MESSAGES.CONTACT_SUPPORT}`);
    }
  };
}
