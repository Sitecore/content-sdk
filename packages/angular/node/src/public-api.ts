/**
 * Node-only entry: server-side caching and middleware.
 * Import from `@sitecore-content-sdk/angular/node` in `server.ts` / server bootstrap — not in browser bundles.
 * @public
 */

// ─── Loader Result Cache (deprecated - prefer HTML cache) ──────────────────
export type { LoaderCacheDiagnostics, LoaderCacheEntryDiagnostics } from './loader-result-cache';
export { LoaderResultCache, getLoaderResultCache } from './loader-result-cache';
export {
  createLoaderCacheAdminMiddleware,
  type LoaderCacheAdminMiddlewareOptions,
} from './loader-cache-admin-middleware';

// ─── HTML Cache Middleware ─────────────────────────────────────────────────
export {
  HtmlCache,
  createHtmlCache,
  createPersonalizationMiddleware,
  createHtmlCacheMiddleware,
  storeHtmlInCache,
  buildHtmlCacheKey,
  type HtmlCacheEntry,
  type HtmlCacheConfig,
  type HtmlCacheMiddlewareOptions,
  type PersonalizationMiddlewareOptions,
  type PersonalizedRequest,
  type CacheableResponse,
  type HtmlCacheFromConfigOptions,
} from './html-cache-middleware';
