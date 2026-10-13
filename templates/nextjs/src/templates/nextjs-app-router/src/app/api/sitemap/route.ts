import { createSitemapRouteHandler } from '@sitecore-content-sdk/nextjs/route-handler';
import sites from '.sitecore/sites.json';
import client from 'lib/sitecore-client';

/**
 * API route for generating sitemap.xml
 *
 * This Next.js API route handler dynamically generates and serves the sitemap XML for your site.
 * The sitemap configuration can be managed within XM Cloud.
 */

// Force dynamic rendering since this route uses request headers
export const dynamic = 'force-dynamic';

export const { GET } = createSitemapRouteHandler({
  client,
  sites,
});
