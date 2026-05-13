/**
 * POST /api/revalidate — explicit `sc:` tags or Sitecore webhook-style JSON (see SDK `createSitecoreRevalidateRouteHandler`).
 */
import { createSitecoreRevalidateRouteHandler } from '@sitecore-content-sdk/nextjs/route-handler';
import type { SiteInfo } from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';
import sites from '.sitecore/sites.json';

export const { POST } = createSitecoreRevalidateRouteHandler({
  defaultLocale: scConfig.defaultLanguage,
  sites: sites as SiteInfo[],
  defaultSite: scConfig.defaultSite,
});
