/**
 * Node-only entry: loader cache backed by unstorage.
 * Import from `@sitecore-content-sdk/angular/node` in `server.ts` / server bootstrap — not in browser bundles.
 * @public
 */
export type { LoaderCacheDiagnostics, LoaderCacheEntryDiagnostics } from './loader-result-cache';
export { LoaderResultCache, getLoaderResultCache } from './loader-result-cache';
export {
  createLoaderCacheAdminMiddleware,
  type LoaderCacheAdminMiddlewareOptions,
} from './loader-cache-admin-middleware';
