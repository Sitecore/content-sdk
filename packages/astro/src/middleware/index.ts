/**
 * Middleware exports for @sitecore-content-sdk/astro
 */

export { createMultisiteMiddleware, type MultisiteMiddlewareConfig } from './multisite-middleware';

// Re-export site utilities for convenience
export {
  SiteResolver,
  getSiteRewrite,
  getSiteRewriteData,
  normalizeSiteRewrite,
  SITE_KEY,
  SITE_PREFIX,
  type SiteInfo,
  type SiteRewriteData,
} from '@sitecore-content-sdk/content/site';
