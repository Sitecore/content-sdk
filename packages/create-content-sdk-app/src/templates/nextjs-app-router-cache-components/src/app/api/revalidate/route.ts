/**
 * POST /api/revalidate — Sitecore webhook (Experience Edge / Content Operations) endpoint.
 * Also accepts ad-hoc `tags[]` (`sc:`-prefixed strings or bare item IDs). See SDK
 * `createSitecoreRevalidateRouteHandler` for the full payload contract.
 *
 * Dictionary tags are derived from `.sitecore/sites.json` (includes the default site from `generateSites`).
 */
import { createSitecoreRevalidateRouteHandler } from '@sitecore-content-sdk/nextjs/route-handler';
import type { SiteInfo } from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';
import sites from '.sitecore/sites.json';

export const { POST } = createSitecoreRevalidateRouteHandler({
  defaultLocale: scConfig.defaultLanguage,
  sites: sites as SiteInfo[],
});
