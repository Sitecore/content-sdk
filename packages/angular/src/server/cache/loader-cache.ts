import { createStorage } from 'unstorage';
import {
  InvalidateInput,
  LoaderCache,
  LoaderCacheConfig,
  LoaderCacheEntry,
  LoaderCacheEntryInfo,
  LoaderCacheLoaderConfig,
} from './models';
import { filterToRequiredTags } from './cache-key';
import { UnstorageLoaderCache } from './unstorage-loader-cache';

const DEFAULT_TTL_SECONDS = 300;

/**
 * Resolved (fully defaulted) config used by every {@link LoaderCache}
 * implementation. Exported as `@internal` so sibling impls can share the same
 * shape and helper.
 * @internal
 */
export interface ResolvedConfig {
  namespace: string;
  revalidate: number;
  enabled: boolean;
  loaders: Record<string, LoaderCacheLoaderConfig>;
  defaultSiteName: string;
}

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
export function createLoaderCache(config: LoaderCacheConfig = {}): LoaderCache {
  const resolved = resolveConfig(config);
  if (config.driver) {
    return new UnstorageLoaderCache(createStorage(), resolved);
  }
  return new InMemoryLoaderCache(config);
}

/**
 * Default LoaderCache implementation: single in-process Map, O(N) tag-scan
 * invalidation. Suitable for single-process deployments and demos.
 *
 * Not exported. Driver variants (unstorage memory/fs/redis) live in sibling
 * classes that implement the same {@link LoaderCache} interface.
 * @internal
 */
class InMemoryLoaderCache implements LoaderCache {
  private readonly resolved: ResolvedConfig;
  private readonly store = new Map<string, LoaderCacheEntry>();

  constructor(config: LoaderCacheConfig) {
    this.resolved = resolveConfig(config);
  }

  async get(key: string): Promise<LoaderCacheEntry | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (this.isExpired(entry)) {
      this.store.delete(key);
      return null;
    }
    return entry;
  }

  async set(key: string, value: unknown, ttlSeconds: number, tags: string[]): Promise<void> {
    const expiresAt = ttlSeconds > 0 ? null : Date.now() + ttlSeconds * 1000;
    this.store.set(key, {
      value,
      tags: [...tags],
      storedAt: Date.now(),
      expiresAt,
    });
  }

  async invalidate(filter: InvalidateInput): Promise<number> {
    const required = filterToRequiredTags(
      filter,
      this.resolved.defaultSiteName,
      this.resolved.namespace
    );
    let deleted = 0;
    for (const [key, entry] of this.store) {
      if (required.every((tag) => entry.tags.includes(tag))) {
        this.store.delete(key);
        deleted++;
      }
    }
    return deleted;
  }

  async delete(key: string): Promise<boolean> {
    return this.store.delete(key);
  }

  async flush(): Promise<void> {
    this.store.clear();
  }

  async entries(): Promise<LoaderCacheEntryInfo[]> {
    const out: LoaderCacheEntryInfo[] = [];
    for (const [key, entry] of this.store) {
      if (this.isExpired(entry)) {
        this.store.delete(key);
        continue;
      }
      out.push({
        key,
        tags: [...entry.tags],
        storedAt: entry.storedAt,
        expiresAt: entry.expiresAt,
        approxBytes: approxByteSize(entry.value),
      });
    }
    return out;
  }

  resolveTtl(loaderId: string): number {
    const perLoader = this.resolved.loaders[loaderId];
    if (perLoader && perLoader.ttl !== undefined) return perLoader.ttl;
    return this.resolved.revalidate;
  }

  isEnabled(loaderId: string): boolean {
    if (!this.resolved.enabled) return false;
    const perLoader = this.resolved.loaders[loaderId];
    if (perLoader && perLoader.enabled === false) return false;
    return true;
  }

  getConfig(): ResolvedConfig {
    return this.resolved;
  }

  private isExpired(entry: LoaderCacheEntry): boolean {
    return entry.expiresAt !== null && entry.expiresAt <= Date.now();
  }
}

/**
 * Build a {@link ResolvedConfig} from a {@link LoaderCacheConfig}. Shared by
 * every backend so config semantics stay identical regardless of driver.
 * @internal
 */
export function resolveConfig(config: LoaderCacheConfig): ResolvedConfig {
  return {
    namespace: config.namespace ?? '',
    revalidate: config.revalidate ?? DEFAULT_TTL_SECONDS,
    enabled: config.enabled ?? true,
    loaders: config.loaders ?? {},
  };
}

/**
 * @deprecated only used for demo purposes. remove before release.
 */
function approxByteSize(value: unknown): number {
  try {
    return JSON.stringify(value).length;
  } catch {
    return 0;
  }
}
