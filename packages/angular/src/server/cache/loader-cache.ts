import { LoaderCache } from '../../loaders/models';
import { GlobalLoaderCacheConfig } from './models';
import { InMemoryLoaderCache } from './default-in-memory-cache';
import { UnstorageLoaderCache } from './unstorage-loader-cache';
import { resolveConfig } from './utils';

/**
 * Public factory for the loader cache. Dispatches to the right backend:
 *
 *   - `config.driver` provided → {@link UnstorageLoaderCache} wrapping the
 *                                 driver in `createStorage({ driver })`
 *   - otherwise                → {@link InMemoryLoaderCache} (plain Map)
 *
 * Drivers are imported and constructed in the app's `server.ts` and passed
 * here as an instance. The cache module does not know about driver-specific
 * options (filesystem base path, Redis URL, etc.) — the app owns that.
 *
 * Callers depend on the {@link LoaderCache} interface; concrete classes are
 * not exported, so we can swap implementations without touching public types.
 * See plan §4.3.
 * @public
 */
export function createLoaderCache(config: GlobalLoaderCacheConfig = {}): LoaderCache {
  const resolved = resolveConfig(config);
  if (config.driver) {
    return new UnstorageLoaderCache(config.driver, resolved);
  }
  return new InMemoryLoaderCache(resolved);
}
