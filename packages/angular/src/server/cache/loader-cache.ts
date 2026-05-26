import { createStorage } from 'unstorage';
import { LoaderCache, GlobalLoaderCacheConfig } from '../../loaders/models';
import { InMemoryLoaderCache } from './default-in-memory-cache';
import { UnstorageLoaderCache } from './unstorage-loader-cache';
import { resolveConfig } from './utils';

/**
 * Public factory for the loader cache. Dispatches to the right backend:
 *
 *   - `config.storage`  → {@link UnstorageLoaderCache} using that Storage
 *   - `config.driver`   → {@link UnstorageLoaderCache} wrapping the driver
 *                         in `createStorage({ driver })`
 *   - otherwise         → {@link InMemoryLoaderCache} (plain Map)
 *
 * Callers depend on the {@link LoaderCache} interface; concrete classes are
 * not exported, so we can swap implementations without touching public types.
 * See plan §4.3.
 * @public
 */
export function createLoaderCache(config: GlobalLoaderCacheConfig = {}): LoaderCache {
  const resolved = resolveConfig(config);
  if (config.driver) {
    return new UnstorageLoaderCache(createStorage(), resolved);
  }
  return new InMemoryLoaderCache(config);
}
