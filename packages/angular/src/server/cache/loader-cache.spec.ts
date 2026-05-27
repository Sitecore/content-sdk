/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import memoryDriver from 'unstorage/drivers/memory';
import fsDriver from 'unstorage/drivers/fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { LoaderCache } from '../../loaders/models';
import { createLoaderCache } from './loader-cache';
import { buildCacheKey } from './cache-key';
import { buildLoaderCacheTags } from './cache-tags';
import type { LoaderContext } from '../../loaders/models';

const sampleContext: LoaderContext = {
  url: '/products',
  params: { site: 'shop', locale: 'en' },
  query: {},
};

function sampleKey(loaderId = 'page') {
  return buildCacheKey(loaderId, sampleContext).key;
}

function sampleTags(loaderId = 'page', value?: unknown) {
  const { key, dimensions } = buildCacheKey(loaderId, sampleContext);
  return buildLoaderCacheTags(loaderId, dimensions, key, value);
}

async function runSharedLoaderCacheContract(
  label: string,
  createCache: () => LoaderCache | Promise<LoaderCache>,
  cleanup?: () => Promise<void>
) {
  describe(`${label} shared cache contract`, () => {
    let cache: LoaderCache;

    beforeEach(async () => {
      cache = await createCache();
    });

    afterEach(async () => {
      await cleanup?.();
      vi.useRealTimers();
    });

    describe('when storing and reading loader output', () => {
      it('returns miss on empty key and hit after set', async () => {
        const key = sampleKey();
        expect(await cache.get(key)).toEqual({ kind: 'miss', cacheKey: key });

        await cache.set(key, { title: 'Products' }, 300, sampleTags());
        const hit = await cache.get(key);

        expect(hit).toEqual({ kind: 'hit', value: { title: 'Products' }, cacheKey: key });
      });
    });

    describe('when an entry TTL expires', () => {
      it('returns stale (does not delete) so SWR can serve last-known-good', async () => {
        vi.useFakeTimers();
        const key = sampleKey('expiring');
        await cache.set(key, { stale: true }, 30, sampleTags('expiring'));

        vi.advanceTimersByTime(31_000);
        const read = await cache.get(key);
        expect(read).toEqual({ kind: 'stale', value: { stale: true }, cacheKey: key });
      });
    });

    describe('when ttl is zero or negative', () => {
      it('keeps the entry until explicitly invalidated', async () => {
        vi.useFakeTimers();
        const key = sampleKey('persistent');
        await cache.set(key, { permanent: true }, 0, sampleTags('persistent'));

        vi.advanceTimersByTime(3600_000);
        const read = await cache.get(key);
        expect(read.kind).toBe('hit');
      });
    });

    describe('when invalidating by tag', () => {
      it('marks matching entries stale without deleting them', async () => {
        const keyA = sampleKey('page');
        const keyB = buildCacheKey('footer', {
          ...sampleContext,
          url: '/other',
        }).key;

        await cache.set(keyA, { page: true }, 300, sampleTags('page'));
        const tagsB = buildLoaderCacheTags(
          'footer',
          buildCacheKey('footer', { ...sampleContext, url: '/other' }).dimensions,
          keyB
        );
        await cache.set(keyB, { footer: true }, 300, tagsB);

        const marked = await cache.invalidate({ tags: ['sc:site:shop'] });

        expect(marked).toBe(2);
        expect(await cache.get(keyA)).toEqual({
          kind: 'stale',
          value: { page: true },
          cacheKey: keyA,
        });
        expect(await cache.get(keyB)).toEqual({
          kind: 'stale',
          value: { footer: true },
          cacheKey: keyB,
        });
      });

      it('marks a single entry stale by self-key tag', async () => {
        const key = sampleKey('page');
        await cache.set(key, { page: true }, 300, sampleTags('page'));

        const marked = await cache.invalidate({ tags: [key] });
        expect(marked).toBe(1);
        expect((await cache.get(key)).kind).toBe('stale');
      });
    });

    describe('when deleting entries', () => {
      it('removes a single key and reports whether it existed', async () => {
        const key = sampleKey('delete-me');
        await cache.set(key, { temp: true }, 300, sampleTags('delete-me'));

        expect(await cache.delete(key)).toBe(true);
        expect(await cache.get(key)).toEqual({ kind: 'miss', cacheKey: key });
        expect(await cache.delete(key)).toBe(false);
      });
    });

    describe('when flushing entries', () => {
      it('removes every key from the in-memory backend', async () => {
        if (label !== 'InMemoryLoaderCache') return;

        const key = sampleKey('flush-me');
        await cache.set(key, { temp: true }, 300, sampleTags('flush-me'));
        await cache.flush();
        expect(await cache.get(key)).toEqual({ kind: 'miss', cacheKey: key });
      });
    });

    describe('when listing entries for admin tooling', () => {
      it('returns metadata without values and includes stale flag', async () => {
        const liveKey = sampleKey('live');
        await cache.set(liveKey, { live: true }, 300, sampleTags('live'));
        await cache.invalidate({ tags: [liveKey] });

        const entries = await cache.entries();
        const live = entries.find((entry) => entry.key === liveKey);
        expect(live?.tags).toEqual(sampleTags('live'));
        expect(live?.stale).toBe(true);
      });
    });

    describe('when reading cache configuration', () => {
      it('reports enabled state and default ttl from the resolved config', () => {
        expect(cache.enabled()).toBe(true);
        expect(cache.resolveTtl()).toBe(300);
        expect(cache.getConfig()).toMatchObject({ revalidate: 300, defaultSiteName: 'default' });
      });
    });
  });
}

runSharedLoaderCacheContract('InMemoryLoaderCache', () =>
  createLoaderCache({ revalidate: 300, defaultSiteName: 'default' })
);

runSharedLoaderCacheContract('UnstorageLoaderCache (memory driver)', () =>
  createLoaderCache({ driver: memoryDriver(), revalidate: 300 })
);

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

    const writer = createLoaderCache({
      driver: fsDriver({ base: cacheDir }),
      revalidate: 300,
    });
    await writer.set(key, { persisted: true }, 300, tags);

    const reader = createLoaderCache({
      driver: fsDriver({ base: cacheDir }),
      revalidate: 300,
    });
    const hit = await reader.get(key);

    expect(hit).toEqual({ kind: 'hit', value: { persisted: true }, cacheKey: key });
  });
});

describe('createLoaderCache factory', () => {
  it('uses the in-memory backend when no unstorage driver is supplied', async () => {
    const cache = createLoaderCache();
    const key = sampleKey('factory-default');
    await cache.set(key, { ok: true }, 300, sampleTags('factory-default'));
    expect((await cache.get(key)).kind).toBe('hit');
  });

  it('uses the unstorage backend when a driver is supplied', async () => {
    const cache = createLoaderCache({
      driver: memoryDriver(),
      revalidate: 300,
    });
    const key = sampleKey('unstorage');
    await cache.set(key, { persisted: true }, 300, sampleTags('unstorage'));

    expect(await cache.get(key)).toEqual(
      expect.objectContaining({ kind: 'hit', value: { persisted: true } })
    );
  });
});
