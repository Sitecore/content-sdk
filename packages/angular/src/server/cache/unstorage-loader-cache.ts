import { Storage, createStorage, Driver } from 'unstorage';
import {
  GlobalLoaderCacheConfig,
  InvalidateInput,
  LoaderCache,
  LoaderCacheEntry,
  LoaderCacheEntryInfo,
} from '../../loaders/models';
import { CACHE_KEY_PREFIX, resolveTagsToInvalidate } from './cache-key';
import { ResolvedConfig } from './models';

/**
 * Unstorage-backed {@link LoaderCache}. Pluggable across `unstorage` drivers —
 * `memory` for dev, `fs` / `fsLite` for single-process persistence, `redis` /
 * `vercelKv` / `cloudflareKv` for multi-worker deployments.
 *
 * Entries are stored under the same composite key built by
 * {@link buildCacheKey} so prerendered, runtime, and admin-CLI writes collide
 * by design (the cross-process consistency promised in plan §4.3).
 *
 * Invalidation walks every key under the cache prefix and reads each entry's
 * tags — O(N) over the cache size. Acceptable up to thousands of entries; a
 * driver-native tag index (Redis `SADD`, etc.) is a Phase 3 optimization.
 * @internal
 */
export class UnstorageLoaderCache implements LoaderCache {
  private readonly storage: Storage;
  private readonly config: ResolvedConfig;
  /** Prefix passed to `storage.getKeys()` / `storage.clear()` for scoped scans. */
  private readonly keyPrefix: string;

  constructor(driver: Driver, config: ResolvedConfig) {
    this.storage = createStorage({ driver });
    this.config = config;
    // Mirrors the serializeKey() prefix in cache-key.ts so getKeys() returns
    // only this cache's entries — never anything else the user stores in the
    // same Storage instance. Namespace is appended when configured.
    this.keyPrefix = config.namespace
      ? `${CACHE_KEY_PREFIX}:${config.namespace}`
      : CACHE_KEY_PREFIX;
  }

  async get(key: string): Promise<LoaderCacheEntry | null> {
    const entry = await this.storage.getItem<LoaderCacheEntry>(key);
    if (!entry) return null;
    if (this.isExpired(entry)) {
      await this.storage.removeItem(key);
      return null;
    }
    return entry;
  }

  async set(key: string, value: unknown, ttlSeconds: number, tags: string[]): Promise<void> {
    const expiresAt = ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null;
    const entry: LoaderCacheEntry = {
      value,
      tags: [...tags],
      storedAt: Date.now(),
      expiresAt,
    };
    await this.storage.setItem(key, entry);
  }

  async invalidate(filter: InvalidateInput): Promise<number> {
    const tags = resolveTagsToInvalidate(filter, this.config.defaultSiteName);
    const keys = await this.storage.getKeys(this.keyPrefix);
    let deleted = 0;
    for (const key of keys) {
      const entry = await this.storage.getItem<LoaderCacheEntry>(key);
      if (!entry) continue;
      if (tags.every((tag) => entry.tags.includes(tag))) {
        await this.storage.removeItem(key);
        deleted++;
      }
    }
    return deleted;
  }

  async delete(key: string): Promise<boolean> {
    const had = await this.storage.hasItem(key);
    if (!had) return false;
    await this.storage.removeItem(key);
    return true;
  }

  async flush(): Promise<void> {
    await this.storage.clear(this.keyPrefix);
  }

  async entries(): Promise<LoaderCacheEntryInfo[]> {
    const keys = await this.storage.getKeys(this.keyPrefix);
    const out: LoaderCacheEntryInfo[] = [];
    for (const key of keys) {
      const entry = await this.storage.getItem<LoaderCacheEntry>(key);
      if (!entry) continue;
      if (this.isExpired(entry)) {
        await this.storage.removeItem(key);
        continue;
      }
      out.push({
        key,
        tags: [...entry.tags],
        storedAt: entry.storedAt,
        expiresAt: entry.expiresAt,
      });
    }
    return out;
  }

  resolveTtl(): number {
    return this.config.revalidate;
  }

  enabled(): boolean {
    return this.config.enabled;
  }

  getConfig(): Readonly<GlobalLoaderCacheConfig> {
    return this.config;
  }

  private isExpired(entry: LoaderCacheEntry): boolean {
    return entry.expiresAt !== null && entry.expiresAt <= Date.now();
  }
}
