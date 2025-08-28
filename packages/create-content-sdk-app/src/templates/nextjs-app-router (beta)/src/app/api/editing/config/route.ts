import { EditingConfigMiddleware } from '@sitecore-content-sdk/nextjs/editing';
import components from '.sitecore/component-map';
import metadata from '.sitecore/metadata.json';
import { NextRequest } from 'next/server';

/**
 * This Next.js API route is used by Sitecore Editor in XM Cloud
 * to determine feature compatibility and configuration.
 */
export async function GET(request: NextRequest) {
  const handler = new EditingConfigMiddleware({
    components,
    metadata,
  }).getAppRouterHandler();

  return await handler(request);
}
