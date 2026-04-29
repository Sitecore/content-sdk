/**
 * Node-only entry: caches backed by unstorage.
 * Import from `@sitecore-content-sdk/angular/node` in `server.ts` / server bootstrap — not in browser bundles.
 * @public
 */

export type {
  ScClientCacheDiagnostics,
  ScClientCacheEntryDiagnostics,
} from './sc-client-cache';
export { ScClientCache, getScClientCache } from './sc-client-cache';
export {
  createScClientCacheAdminMiddleware,
  type ScClientCacheAdminMiddlewareOptions,
} from './sc-client-cache-admin-middleware';
