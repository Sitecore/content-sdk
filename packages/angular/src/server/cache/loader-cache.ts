import { LoaderCache } from '../../loaders/models';
import { GlobalLoaderCacheConfig } from './models';
import { InMemoryLoaderCache } from './default-in-memory-cache';
import { UnstorageLoaderCache } from './unstorage-loader-cache';
import { resolveConfig } from './utils';

/**
 * Public factory for the loader cache. Dispatches to the right backend:
 * - `config.driver` provided → {@link UnstorageLoaderCache} wrapping the driver in `createStorage({ driver })`
 * - otherwise → {@link InMemoryLoaderCache} (plain Map)
 *
 * Drivers are imported and constructed in the app's `server.ts` and passed here as an instance.
 * Callers depend on the {@link LoaderCache} interface; concrete classes are not exported.
 * @param {GlobalLoaderCacheConfig} [config] - Global cache config and optional unstorage driver.
 * @returns {LoaderCache} Cache implementation with Phase 3 SWR + tag semantics.
 * @example
 * ```ts
 * const cache = createLoaderCache({
 *   revalidate: config.angular.isrCache.revalidate,
 *   enabled: config.angular.isrCache.enabled,
 *   defaultSiteName: config.defaultSite,
 *   driver: fsDriver({ base: './.cache/loaders' }),
 * });
 * ```
 * @public
 */
export function createLoaderCache(config: GlobalLoaderCacheConfig = {}): LoaderCache {
  const resolved = resolveConfig(config);
  if (config.driver) {
    return new UnstorageLoaderCache(config.driver, resolved);
  }
  return new InMemoryLoaderCache(resolved);
}
