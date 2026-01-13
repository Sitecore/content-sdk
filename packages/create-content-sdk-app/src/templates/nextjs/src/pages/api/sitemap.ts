import { SitemapProxy } from '@sitecore-content-sdk/nextjs/proxy';
import scClient from 'lib/sitecore-client';
import sites from '.sitecore/sites.json';

/**
 * API route for generating sitemap.xml
 *
 * This Next.js API route dynamically generates and serves the sitemap XML for your site.
 * The sitemap configuration can be managed within XM Cloud.
 */

// Wire up the SitemapProxy handler
const handler = new SitemapProxy(scClient, sites).getHandler();

export default handler;
