import { createLlmsTxtRouteHandler } from '@sitecore-content-sdk/nextjs/route-handler';
import sites from '.sitecore/sites.json';
import client from 'lib/sitecore-client';

/**
 * API route for serving llms.txt
 *
 * This Next.js API route handler generates and returns the llms.txt content dynamically
 * based on the resolved site name. Content is managed via Sitecore AI configuration.
 */

// Force dynamic rendering since this route uses request headers
export const dynamic = 'force-dynamic';

export const { GET } = createLlmsTxtRouteHandler({
  client,
  sites,
});
