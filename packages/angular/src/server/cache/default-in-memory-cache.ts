import {
  InvalidateInput,
  LoaderCache,
  LoaderCacheConfig,
  LoaderCacheEntry,
  LoaderCacheEntryInfo,
  LoaderCacheReadResult,
} from '../../loaders/models';
import { evaluateCacheRead, applyLoaderCacheConfigDefaults } from './utils';

/**
 * Default LoaderCache implementation: in-process Map + tag → keys index.
 * @internal
 */
export class InMemoryLoaderCache implements LoaderCache {
  private readonly config: Required<LoaderCacheConfig>;
  private readonly store = new Map<string, LoaderCacheEntry>();
  private readonly tagIndex = new InMemoryTagIndex();

  constructor(config: LoaderCacheConfig = {}) {
    this.config = applyLoaderCacheConfigDefaults(config);
  }

  async get(key: string): Promise<LoaderCacheReadResult> {
    const entry = this.store.get(key);
    return evaluateCacheRead(key, entry ?? null);
  }

  async set(key: string, value: unknown, ttlSeconds: number, tags: string[]): Promise<void> {
    const existing = this.store.get(key);
    if (existing) {
      this.tagIndex.unlink(key, existing.tags);
    }

    const expiresAt = ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, {
      value,
      tags: [...tags],
      storedAt: Date.now(),
      expiresAt,
      stale: false,
    });
    this.tagIndex.link(key, tags);
  }

  async invalidate(filter: InvalidateInput): Promise<number> {
    const tags = filter.tags ?? [];
    if (tags.length === 0) {
      return 0;
    }
    const keys = this.tagIndex.resolveKeys(tags);
    let marked = 0;
    for (const key of keys) {
      if (await this.markStale(key)) {
        marked++;
      }
    }
    return marked;
  }

  async markStale(key: string): Promise<boolean> {
    const entry = this.store.get(key);
    if (!entry) {
      return false;
    }
    if (entry.stale) {
      return true;
    }
    this.store.set(key, { ...entry, stale: true });
    return true;
  }

  async delete(key: string): Promise<boolean> {
    const entry = this.store.get(key);
    if (!entry) {
      return false;
    }
    this.tagIndex.unlink(key, entry.tags);
    this.store.delete(key);
    return true;
  }

  async flush(): Promise<void> {
    this.store.clear();
    this.tagIndex.clear();
  }

  async entries(): Promise<LoaderCacheEntryInfo[]> {
    const out: LoaderCacheEntryInfo[] = [];
    for (const [key, entry] of this.store) {
      out.push({
        key,
        tags: [...entry.tags],
        storedAt: entry.storedAt,
        expiresAt: entry.expiresAt,
        stale: entry.stale,
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

  getConfig(): Readonly<LoaderCacheConfig> {
    return this.config;
  }
}

/**
 * In-process tag index: tag → set of cache keys.
 * @internal
 */
export class InMemoryTagIndex {
  private readonly tagToKeys = new Map<string, Set<string>>();

  link(cacheKey: string, tags: string[]): void {
    for (const tag of tags) {
      if (!this.tagToKeys.has(tag)) {
        this.tagToKeys.set(tag, new Set());
      }
      this.tagToKeys.get(tag)!.add(cacheKey);
    }
  }

  unlink(cacheKey: string, tags: string[]): void {
    for (const tag of tags) {
      const keys = this.tagToKeys.get(tag);
      keys?.delete(cacheKey);
      if (keys?.size === 0) {
        this.tagToKeys.delete(tag);
      }
    }
  }

  resolveKeys(tags: string[]): Set<string> {
    const out = new Set<string>();
    for (const tag of tags) {
      for (const key of this.tagToKeys.get(tag) ?? []) {
        out.add(key);
      }
    }
    return out;
  }

  clear(): void {
    this.tagToKeys.clear();
  }
}
