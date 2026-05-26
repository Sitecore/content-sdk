/**
 * POST /api/revalidate — Sitecore webhook (Experience Edge / Content Operations) endpoint.
 * Also accepts ad-hoc `tags[]` (`sc:`-prefixed strings or bare item IDs). See SDK
 * `createSitecoreRevalidateRouteHandler` for the full payload contract.
 *
 * `extraDictionarySite` is dictionary-only: it adds one extra
 * `sc:dict:<scConfig.defaultSite>:<scConfig.defaultLanguage>` tag on every call, as a
 * defensive guarantee for the canonical site's dictionary cache.
 */
import { createSitecoreRevalidateRouteHandler } from '@sitecore-content-sdk/nextjs/route-handler';
import type { SiteInfo } from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';
import sites from '.sitecore/sites.json';

export const { POST } = createSitecoreRevalidateRouteHandler({
  defaultLocale: scConfig.defaultLanguage,
  sites: sites as SiteInfo[],
  extraDictionarySite: scConfig.defaultSite,
});
