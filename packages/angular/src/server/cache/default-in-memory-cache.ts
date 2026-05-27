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
 * In-process tag index mapping OSR tags to cache keys.
 * Maintained alongside {@link InMemoryLoaderCache} entries for O(1) tag invalidation.
 * @internal
 */
export class InMemoryTagIndex {
  private readonly tagToKeys = new Map<string, Set<string>>();

  /**
   * Registers `cacheKey` under each tag in the index.
   * @param {string} cacheKey - Cache entry key.
   * @param {string[]} tags - Tags to link.
   */
  link(cacheKey: string, tags: string[]): void {
    for (const tag of tags) {
      if (!this.tagToKeys.has(tag)) {
        this.tagToKeys.set(tag, new Set());
      }
      this.tagToKeys.get(tag)!.add(cacheKey);
    }
  }

  /**
   * Removes `cacheKey` from each tag bucket; deletes empty buckets.
   * @param {string} cacheKey - Cache entry key.
   * @param {string[]} tags - Tags to unlink.
   */
  unlink(cacheKey: string, tags: string[]): void {
    for (const tag of tags) {
      const keys = this.tagToKeys.get(tag);
      keys?.delete(cacheKey);
      if (keys?.size === 0) {
        this.tagToKeys.delete(tag);
      }
    }
  }

  /**
   * Union of cache keys linked to any of the supplied tags.
   * @param {string[]} tags - Tags to resolve.
   * @returns {Set<string>} Matching cache keys.
   */
  resolveKeys(tags: string[]): Set<string> {
    const out = new Set<string>();
    for (const tag of tags) {
      for (const key of this.tagToKeys.get(tag) ?? []) {
        out.add(key);
      }
    }
    return out;
  }

  /** Clears every tag bucket. */
  clear(): void {
    this.tagToKeys.clear();
  }
}

/**
 * Default {@link LoaderCache} implementation: in-process `Map` plus {@link InMemoryTagIndex}.
 * Suitable for single-process dev and tests. For persistence or multi-instance deploys,
 * pass an unstorage driver to {@link createLoaderCache} instead.
 * @internal
 */
export class InMemoryLoaderCache implements LoaderCache {
  private readonly config: Required<LoaderCacheConfig>;
  private readonly store = new Map<string, LoaderCacheEntry>();
  private readonly tagIndex = new InMemoryTagIndex();

  /**
   * @param {LoaderCacheConfig} [config] - Partial cache configuration.
   */
  constructor(config: LoaderCacheConfig = {}) {
    this.config = applyLoaderCacheConfigDefaults(config);
  }

  /** @inheritdoc */
  async get(key: string): Promise<LoaderCacheReadResult> {
    const entry = this.store.get(key);
    return evaluateCacheRead(key, entry ?? null);
  }

  /** @inheritdoc */
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

  /** @inheritdoc */
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

  /**
   * Marks a single entry stale without deleting it (SWR semantics).
   * @param {string} key - Cache entry key.
   * @returns {boolean} `false` when missing; `true` when the entry exists (including already stale).
   */
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

  /** @inheritdoc */
  async delete(key: string): Promise<boolean> {
    const entry = this.store.get(key);
    if (!entry) {
      return false;
    }
    this.tagIndex.unlink(key, entry.tags);
    this.store.delete(key);
    return true;
  }

  /** @inheritdoc */
  async flush(): Promise<void> {
    this.store.clear();
    this.tagIndex.clear();
  }

  /** @inheritdoc */
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

  /** @inheritdoc */
  resolveTtl(): number {
    return this.config.revalidate;
  }

  /** @inheritdoc */
  enabled(): boolean {
    return this.config.enabled;
  }

  /** @inheritdoc */
  getConfig(): Readonly<LoaderCacheConfig> {
    return this.config;
  }
}
