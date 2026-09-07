import { LlmsTxtMiddleware } from '@sitecore-content-sdk/nextjs/middleware';
import scClient from 'lib/sitecore-client';
import sites from '.sitecore/sites.json';

/**
 * API route for serving llms.txt
 *
 * This Next.js API route generates and returns the llms.txt content dynamically
 * based on the resolved site name. Content is managed via Sitecore AI configuration.
 */

// Wire up the LlmsTxtMiddleware handler
const handler = new LlmsTxtMiddleware(scClient, sites).getHandler();

export default handler;
