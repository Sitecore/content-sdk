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

/**
 * Unstorage-backed {@link LoaderCache}.
 *
 * Two key spaces in one driver:
 *   - `{cacheKey}` → loader entry (value + metadata; tags copied on the entry)
 *   - `tag:{tag}` → `string[]` of cache keys pointing at that entry
 * @internal
 */
/** Prefix for tag-index keys in unstorage (entries use `sc:loader:…` keys directly). */
const TAG_INDEX_PREFIX = 'tag:';

export class UnstorageLoaderCache implements LoaderCache {
  private readonly storage: Storage;
  private readonly config: Required<LoaderCacheConfig>;

  constructor(driver: Driver, config: LoaderCacheConfig = {}) {
    this.storage = createStorage({ driver });
    this.config = applyLoaderCacheConfigDefaults(config);
  }

  async get(cacheKey: string): Promise<LoaderCacheReadResult> {
    const entry = await this.storage.getItem<LoaderCacheEntry>(this.cacheStorageKey(cacheKey));
    return evaluateCacheRead(cacheKey, entry ?? null);
  }

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

  async delete(cacheKey: string): Promise<boolean> {
    const entry = await this.storage.getItem<LoaderCacheEntry>(this.cacheStorageKey(cacheKey));
    if (!entry) {
      return false;
    }
    await this.unlinkTags(cacheKey, entry.tags);
    await this.storage.removeItem(this.cacheStorageKey(cacheKey));
    return true;
  }

  async flush(): Promise<void> {
    await this.storage.clear();
  }

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

  resolveTtl(): number {
    return this.config.revalidate;
  }

  enabled(): boolean {
    return this.config.enabled;
  }

  getConfig(): Readonly<GlobalLoaderCacheConfig> {
    return this.config;
  }

  /** Cache entry: OSR-aligned `sc:loader:…` key → loader payload. */
  private cacheStorageKey(cacheKey: string): string {
    return cacheKey;
  }

  /** Tag index: `tag:{tag}` → cache keys. */
  private tagStorageKey(tag: string): string {
    return `${TAG_INDEX_PREFIX}${tag}`;
  }

  private async linkTags(cacheKey: string, tags: string[]): Promise<void> {
    for (const tag of tags) {
      const storageKey = this.tagStorageKey(tag);
      const current = (await this.storage.getItem<string[]>(storageKey)) ?? [];
      if (!current.includes(cacheKey)) {
        await this.storage.setItem(storageKey, [...current, cacheKey]);
      }
    }
  }

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
