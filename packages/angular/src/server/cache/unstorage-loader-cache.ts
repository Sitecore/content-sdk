import { Storage, createStorage, Driver } from 'unstorage';
import {
  InvalidateInput,
  LoaderCache,
  LoaderCacheConfig,
  LoaderCacheEntry,
  LoaderCacheEntryInfo,
  LoaderCacheReadResult,
} from '../../loaders/models';
import { evaluateCacheRead, applyLoaderCacheConfigDefaults } from './utils';
import { CACHE_KEY_PREFIX } from './cache-key';
import { GlobalLoaderCacheConfig } from './models';

/** Prefix for tag-index keys in unstorage (entries use `sc:loader:…` keys directly). */
const TAG_INDEX_PREFIX = 'tag:';

/**
 * Unstorage-backed {@link LoaderCache} for persistent or shared storage.
 * Two key spaces share one driver: `{cacheKey}` entries and `tag:{tag}` index arrays.
 * Semantics match {@link InMemoryLoaderCache}: `invalidate` marks stale; `get` uses
 * {@link evaluateCacheRead} for hit/stale/miss.
 * @internal
 */
export class UnstorageLoaderCache implements LoaderCache {
  private readonly storage: Storage;
  private readonly config: Required<LoaderCacheConfig>;

  /**
   * @param {Driver} driver - Unstorage driver instance from the app (`server.ts`).
   * @param {LoaderCacheConfig} [config] - Resolved cache configuration.
   */
  constructor(driver: Driver, config: LoaderCacheConfig = {}) {
    this.storage = createStorage({ driver });
    this.config = applyLoaderCacheConfigDefaults(config);
  }

  /** @inheritdoc */
  async get(cacheKey: string): Promise<LoaderCacheReadResult> {
    const entry = await this.storage.getItem<LoaderCacheEntry>(this.cacheStorageKey(cacheKey));
    return evaluateCacheRead(cacheKey, entry ?? null);
  }

  /** @inheritdoc */
  async set(cacheKey: string, value: unknown, ttlSeconds: number, tags: string[]): Promise<void> {
    const existing = await this.storage.getItem<LoaderCacheEntry>(this.cacheStorageKey(cacheKey));
    if (existing) {
      await this.unlinkTags(cacheKey, existing.tags);
    }

    const expiresAt = ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null;
    const entry: LoaderCacheEntry = {
      value,
      tags: [...tags],
      storedAt: Date.now(),
      expiresAt,
      stale: false,
    };
    await this.storage.setItem(this.cacheStorageKey(cacheKey), entry);
    await this.linkTags(cacheKey, tags);
  }

  /** @inheritdoc */
  async invalidate(filter: InvalidateInput): Promise<number> {
    const tags = filter.tags ?? [];
    if (tags.length === 0) {
      return 0;
    }
    const keys = await this.resolveCacheKeysFromTags(tags);
    let marked = 0;
    for (const cacheKey of keys) {
      const entry = await this.storage.getItem<LoaderCacheEntry>(this.cacheStorageKey(cacheKey));
      if (!entry) {
        continue;
      }
      if (!entry.stale) {
        await this.storage.setItem(this.cacheStorageKey(cacheKey), { ...entry, stale: true });
      }
      marked++;
    }
    return marked;
  }

  /** @inheritdoc */
  async delete(cacheKey: string): Promise<boolean> {
    const entry = await this.storage.getItem<LoaderCacheEntry>(this.cacheStorageKey(cacheKey));
    if (!entry) {
      return false;
    }
    await this.unlinkTags(cacheKey, entry.tags);
    await this.storage.removeItem(this.cacheStorageKey(cacheKey));
    return true;
  }

  /** @inheritdoc */
  async flush(): Promise<void> {
    await this.storage.clear();
  }

  /** @inheritdoc */
  async entries(): Promise<LoaderCacheEntryInfo[]> {
    const keys = await this.storage.getKeys(CACHE_KEY_PREFIX);
    const out: LoaderCacheEntryInfo[] = [];
    for (const cacheKey of keys) {
      const entry = await this.storage.getItem<LoaderCacheEntry>(cacheKey);
      if (!entry) {
        continue;
      }
      out.push({
        key: cacheKey,
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
  getConfig(): Readonly<GlobalLoaderCacheConfig> {
    return this.config;
  }

  /**
   * Cache entry storage key (OSR-aligned `sc:loader:…`).
   * @param {string} cacheKey - Public loader cache key.
   * @returns {string} Unstorage key for the entry payload.
   */
  private cacheStorageKey(cacheKey: string): string {
    return cacheKey;
  }

  /**
   * Tag index storage key (`tag:{tag}`).
   * @param {string} tag - OSR cache tag.
   * @returns {string} Unstorage key for the tag index bucket.
   */
  private tagStorageKey(tag: string): string {
    return `${TAG_INDEX_PREFIX}${tag}`;
  }

  /**
   * Links a cache key into each tag bucket.
   * @param {string} cacheKey - Cache entry key.
   * @param {string[]} tags - Tags to link.
   */
  private async linkTags(cacheKey: string, tags: string[]): Promise<void> {
    for (const tag of tags) {
      const storageKey = this.tagStorageKey(tag);
      const current = (await this.storage.getItem<string[]>(storageKey)) ?? [];
      if (!current.includes(cacheKey)) {
        await this.storage.setItem(storageKey, [...current, cacheKey]);
      }
    }
  }

  /**
   * Unlinks a cache key from each tag bucket.
   * @param {string} cacheKey - Cache entry key.
   * @param {string[]} tags - Tags to unlink.
   */
  private async unlinkTags(cacheKey: string, tags: string[]): Promise<void> {
    for (const tag of tags) {
      const storageKey = this.tagStorageKey(tag);
      const current = (await this.storage.getItem<string[]>(storageKey)) ?? [];
      const next = current.filter((k) => k !== cacheKey);
      if (next.length === 0) {
        await this.storage.removeItem(storageKey);
      } else {
        await this.storage.setItem(storageKey, next);
      }
    }
  }

  /** @param {string[]} tags - Tags to resolve. @returns {Promise<Set<string>>} Matching cache keys. */
  private async resolveCacheKeysFromTags(tags: string[]): Promise<Set<string>> {
    const out = new Set<string>();
    for (const tag of tags) {
      const keys = (await this.storage.getItem<string[]>(this.tagStorageKey(tag))) ?? [];
      for (const key of keys) {
        out.add(key);
      }
    }
    return out;
  }
}
