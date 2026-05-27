/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import memoryDriver from 'unstorage/drivers/memory';
import fsDriver from 'unstorage/drivers/fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { UnstorageLoaderCache } from './unstorage-loader-cache';
import { buildCacheKey } from './cache-key';
import {
  runSharedLoaderCacheContract,
  sampleContext,
  sampleKey,
  sampleTags,
} from './cache.spec-helpers';

function getStorage(cache: UnstorageLoaderCache) {
  return (
    cache as unknown as {
      storage: {
        getItem: <T>(key: string) => Promise<T | null>;
        removeItem: (key: string) => Promise<void>;
      };
    }
  ).storage;
}

describe('UnstorageLoaderCache', () => {
  runSharedLoaderCacheContract(
    'UnstorageLoaderCache (memory driver)',
    () => new UnstorageLoaderCache(memoryDriver(), { revalidate: 300, defaultSiteName: 'default' })
  );

  it('applies config defaults from the constructor', () => {
    const cache = new UnstorageLoaderCache(memoryDriver(), { revalidate: 120, enabled: false });
    expect(cache.resolveTtl()).toBe(120);
    expect(cache.enabled()).toBe(false);
    expect(cache.getConfig()).toMatchObject({ revalidate: 120, enabled: false });
  });

  it('returns false when deleting a missing key', async () => {
    const cache = new UnstorageLoaderCache(memoryDriver(), { revalidate: 300 });
    expect(await cache.delete('sc:loader:page:missing')).toBe(false);
  });

  it('skips missing entries while invalidating stale tags', async () => {
    const cache = new UnstorageLoaderCache(memoryDriver(), { revalidate: 300 });
    const key = sampleKey('ghost');
    await cache.set(key, { ghost: true }, 300, sampleTags('ghost'));
    await cache.delete(key);

    expect(await cache.invalidate({ tags: [key] })).toBe(0);
  });

  it('counts already stale entries during invalidate without rewriting them', async () => {
    const cache = new UnstorageLoaderCache(memoryDriver(), { revalidate: 300 });
    const key = sampleKey('stale-twice');
    await cache.set(key, { value: 1 }, 300, sampleTags('stale-twice'));

    expect(await cache.invalidate({ tags: [key] })).toBe(1);
    expect(await cache.invalidate({ tags: [key] })).toBe(1);
    expect((await cache.get(key)).kind).toBe('stale');
  });

  it('omits ghost keys from entries listing', async () => {
    const cache = new UnstorageLoaderCache(memoryDriver(), { revalidate: 300 });
    const key = sampleKey('ghost-entry');
    await cache.set(key, { live: true }, 300, sampleTags('ghost-entry'));

    const storage = getStorage(cache);
    await storage.removeItem(key);

    const entries = await cache.entries();
    expect(entries.find((entry) => entry.key === key)).toBeUndefined();
  });

  it('keeps tag index entries when other keys still reference the tag', async () => {
    const cache = new UnstorageLoaderCache(memoryDriver(), { revalidate: 300 });
    const sharedTag = 'sc:site:shared';
    const keyA = sampleKey('shared-a');
    const keyB = buildCacheKey('footer', { ...sampleContext, url: '/footer' }).key;

    await cache.set(keyA, { a: true }, 300, [sharedTag, keyA]);
    await cache.set(keyB, { b: true }, 300, [sharedTag, keyB]);

    expect(await cache.delete(keyA)).toBe(true);
    expect(await cache.invalidate({ tags: [sharedTag] })).toBe(1);
    expect((await cache.get(keyB)).kind).toBe('stale');
  });

  it('stores tag index buckets under tag:{tag} keys', async () => {
    const cache = new UnstorageLoaderCache(memoryDriver(), { revalidate: 300 });
    const key = sampleKey('tag-index');
    const tag = 'sc:site:tag-index';

    await cache.set(key, { ok: true }, 300, [tag, key]);

    const storage = getStorage(cache);
    const indexedKeys = await storage.getItem<string[]>(`tag:${tag}`);
    expect(indexedKeys).toContain(key);
  });

  it('does not duplicate cache keys in a tag bucket when set is called twice', async () => {
    const cache = new UnstorageLoaderCache(memoryDriver(), { revalidate: 300 });
    const key = sampleKey('dedupe-tag');
    const tag = 'sc:site:dedupe';

    await cache.set(key, { v: 1 }, 300, [tag]);
    await cache.set(key, { v: 2 }, 300, [tag]);

    const storage = getStorage(cache);
    const indexedKeys = await storage.getItem<string[]>(`tag:${tag}`);
    expect(indexedKeys?.filter((entryKey) => entryKey === key)).toHaveLength(1);
  });
});

describe('UnstorageLoaderCache (fs driver)', () => {
  let cacheDir: string;

  beforeEach(async () => {
    cacheDir = await mkdtemp(join(tmpdir(), 'sc-loader-cache-'));
  });

  afterEach(async () => {
    await rm(cacheDir, { recursive: true, force: true });
  });

  it('persists entries across separate cache instances on disk', async () => {
    const key = sampleKey('persisted');
    const tags = sampleTags('persisted');

    const writer = new UnstorageLoaderCache(fsDriver({ base: cacheDir }), { revalidate: 300 });
    await writer.set(key, { persisted: true }, 300, tags);

    const reader = new UnstorageLoaderCache(fsDriver({ base: cacheDir }), { revalidate: 300 });
    expect(await reader.get(key)).toEqual({
      kind: 'hit',
      value: { persisted: true },
      cacheKey: key,
    });
  });
});
