import { RobotsMiddleware } from '@sitecore-content-sdk/nextjs/middleware';
import scClient from 'lib/sitecore-client';

/**
 * API route for serving robots.txt
 *
 * This Next.js API route generates and returns the robots.txt content dynamically
 * based on the resolved site name. It is commonly
 * used by search engine crawlers to determine crawl and indexing rules.
 */

// Wire up the RobotsMiddleware handler
const handler = new RobotsMiddleware(scClient).getHandler();

export default handler;
