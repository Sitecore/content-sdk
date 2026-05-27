import { Driver } from 'unstorage';
import { LoaderCacheConfig } from '../../loaders/models';

export const DEFAULT_CACHE_TTL = 300;

/**
 * Identity dimensions of a cache key. Derived from LoaderContext by buildCacheKey().
 * @public
 */
export interface CacheKeyDimensions {
  site: string;
  locale: string;
  variantId: string;
  loaderId: string;
  pathKey: string;
}

/**
 * Global config for the loader cache. Consumed by `createLoaderCache()` in
 * the app's `server.ts`.
 *
 * Drivers are imported and instantiated in the app (e.g.
 * `fsDriver({ base: './.cache/loaders' })`) — the package does not own driver
 * selection. When `driver` is omitted, the cache falls back to its built-in
 * in-memory implementation.
 * @public
 */
export interface GlobalLoaderCacheConfig extends LoaderCacheConfig {
  /**
   * Unstorage `Driver` instance. Pass an imported driver — the cache wraps it
   * with `createStorage({ driver })` internally. Omit for the in-memory default.
   */
  driver?: Driver;
}
