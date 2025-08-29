import { AppRouterEditingRenderMiddleware } from '@sitecore-content-sdk/nextjs/editing';
import { NextRequest } from 'next/server';

/**
 * This Next.js API route is used by Sitecore Editor in XM Cloud
 * to determine feature compatibility and configuration.
 */
export async function GET(request: NextRequest) {
  const handler = new AppRouterEditingRenderMiddleware().getHandler();

  return await handler(request);
}
