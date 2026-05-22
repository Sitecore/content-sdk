import {
  InvalidateFilter,
  LoaderCache,
  LoaderCacheConfig,
  LoaderCacheEntry,
  LoaderCacheEntryInfo,
  LoaderCacheLoaderConfig,
} from './models';
import { filterToRequiredTags } from './cache-key';

const DEFAULT_TTL_SECONDS = 300;

interface ResolvedConfig {
  namespace: string;
  defaultTtl: number | 'infinite';
  enabled: boolean;
  loaders: Record<string, LoaderCacheLoaderConfig>;
  defaultSiteName: string;
}

/**
 * Public factory for the v1 in-memory loader cache. Returns a {@link LoaderCache}
 * backed by an internal {@link InMemoryLoaderCache} class.
 *
 * The class is intentionally not exported: callers should depend on the
 * {@link LoaderCache} interface, so we can swap the implementation (unstorage,
 * Redis, etc.) without touching public types. See plan §4.3.
 * @public
 */
export function createLoaderCache(config: LoaderCacheConfig = {}): LoaderCache {
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

  async set(
    key: string,
    value: unknown,
    ttlSeconds: number | 'infinite',
    tags: string[]
  ): Promise<void> {
    const ttl = ttlSeconds === 'infinite' ? null : ttlSeconds;
    const expiresAt = ttl === null ? null : this.now() + ttl * 1000;
    this.store.set(key, {
      value,
      tags: [...tags],
      storedAt: this.now(),
      expiresAt,
    });
  }

  async invalidate(filter: InvalidateFilter): Promise<number> {
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

  resolveTtl(loaderId: string): number | 'infinite' {
    const perLoader = this.resolved.loaders[loaderId];
    if (perLoader && perLoader.ttl !== undefined) return perLoader.ttl;
    return this.resolved.defaultTtl;
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

  private now(): number {
    return Date.now();
  }

  private isExpired(entry: LoaderCacheEntry): boolean {
    return entry.expiresAt !== null && entry.expiresAt <= this.now();
  }
}

function resolveConfig(config: LoaderCacheConfig): ResolvedConfig {
  return {
    namespace: config.namespace ?? '',
    defaultTtl: config.defaultTtl ?? DEFAULT_TTL_SECONDS,
    enabled: config.enabled ?? true,
    loaders: config.loaders ?? {},
    defaultSiteName: config.defaultSiteName ?? 'default',
  };
}

function approxByteSize(value: unknown): number {
  try {
    return JSON.stringify(value).length;
  } catch {
    return 0;
  }
}
