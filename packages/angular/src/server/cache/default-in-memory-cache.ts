import { resolveTagsToInvalidate } from './cache-key';
import { GlobalLoaderCacheConfig, LoaderCache, LoaderCacheEntry } from '../../loaders/models';
import { resolveConfig } from './utils';
import { ResolvedConfig } from './models';
import { InvalidateInput, LoaderCacheEntryInfo } from '../../loaders/models';

/**
 * Default LoaderCache implementation: single in-process Map, O(N) tag-scan
 * invalidation. Suitable for single-process deployments and demos.
 *
 * Not exported. Driver variants (unstorage memory/fs/redis) live in sibling
 * classes that implement the same {@link LoaderCache} interface.
 * @internal
 */
export class InMemoryLoaderCache implements LoaderCache {
  private readonly resolved: ResolvedConfig;
  private readonly store = new Map<string, LoaderCacheEntry>();

  constructor(config: GlobalLoaderCacheConfig) {
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
    const required = resolveTagsToInvalidate(filter);
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
