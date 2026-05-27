import { Driver } from 'unstorage';
import { LoaderCacheConfig } from '../../loaders/models';

/** Default global revalidate TTL (seconds) when {@link LoaderCacheConfig.revalidate} is omitted. @public */
export const DEFAULT_CACHE_TTL = 300;

/**
 * Identity dimensions of a cache key. Derived from {@link LoaderContext} by {@link buildCacheKey}.
 * @public
 */
export interface CacheKeyDimensions {
  /** Site name from route params (defaults to `'default'`). */
  site: string;
  /** Locale from route params (defaults to `'en'`). */
  locale: string;
  /** Personalization variant segment (currently always `'default'` until Phase 4). */
  variantId: string;
  /** Loader id (`page`, `dictionary`, etc.). */
  loaderId: string;
  /** Sanitized path segment from the loader URL; home route uses `'_'`. */
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
