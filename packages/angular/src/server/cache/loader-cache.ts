import { LoaderCache } from '../../loaders/models';
import { GlobalLoaderCacheConfig } from './models';
import { UnstorageLoaderCache } from './unstorage-loader-cache';
import { resolveConfig } from './utils';
import memoryDriver from 'unstorage/drivers/memory';

/**
 * Public factory for the loader cache with unstorage backing.
 * Uses the memory driver by default.
 *
 * Drivers are best imported and constructed in the app's `server.ts` and passed here as an instance.
 * Callers depend on the {@link LoaderCache} interface; concrete classes are not exported.
 * @param {GlobalLoaderCacheConfig} [config] - Global cache config and optional unstorage driver.
 * @returns {LoaderCache} Cache implementation with Phase 3 SWR + tag semantics.
 * @example
 * ```ts
 * const cache = createLoaderCache({
 *   revalidate: config.angular.loadersCache.revalidate,
 *   enabled: config.angular.loadersCache.enabled,
 *   defaultSiteName: config.defaultSite,
 *   driver: fsDriver({ base: './.cache/loaders' }),
 * });
 * ```
 * @public
 */
export function createLoaderCache(config: GlobalLoaderCacheConfig = {}): LoaderCache {
  const resolved = resolveConfig(config);
  const driver = config.driver ?? memoryDriver();
  return new UnstorageLoaderCache(driver, resolved);
}
