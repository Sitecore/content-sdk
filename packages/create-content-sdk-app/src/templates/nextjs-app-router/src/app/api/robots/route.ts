import { createRobotsRouteHandler } from '@sitecore-content-sdk/nextjs/route-handler';
import sites from '.sitecore/sites.json';
import client from 'lib/sitecore-client';

/**
 * API route for serving robots.txt
 *
 * This Next.js API route handler generates and returns the robots.txt content dynamically
 * based on the resolved site name. It is commonly
 * used by search engine crawlers to determine crawl and indexing rules.
 */

// Force dynamic rendering since this route uses request headers
export const dynamic = 'force-dynamic';

export const { GET } = createRobotsRouteHandler({
  client,
  sites,
});
