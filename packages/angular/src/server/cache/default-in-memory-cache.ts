import { resolveTagsToInvalidate } from './cache-key';
import {
  GlobalLoaderCacheConfig,
  InvalidateInput,
  LoaderCache,
  LoaderCacheEntry,
  LoaderCacheEntryInfo,
} from '../../loaders/models';
import { ResolvedConfig } from './models';

/**
 * Default LoaderCache implementation: single in-process Map, O(N) tag-scan
 * invalidation. Suitable for single-process deployments and demos.
 *
 * Not exported. Driver variants (unstorage memory/fs/redis) live in sibling
 * classes that implement the same {@link LoaderCache} interface.
 * @internal
 */
export class InMemoryLoaderCache implements LoaderCache {
  private readonly config: ResolvedConfig;
  private readonly store = new Map<string, LoaderCacheEntry>();

  constructor(config: ResolvedConfig) {
    this.config = config;
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
    const expiresAt = ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, {
      value,
      tags: [...tags],
      storedAt: Date.now(),
      expiresAt,
    });
  }

  async invalidate(filter: InvalidateInput): Promise<number> {
    const required = resolveTagsToInvalidate(filter, this.config.defaultSiteName);
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
