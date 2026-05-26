/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import memoryDriver from 'unstorage/drivers/memory';
import fsDriver from 'unstorage/drivers/fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { LoaderCache, InvalidateInput } from '../../loaders/models';
import { createLoaderCache } from './loader-cache';
import { buildCacheKey, buildDefaultTags } from './cache-key';
import type { LoaderContext } from '../../loaders/models';

const sampleContext: LoaderContext = {
  url: '/products',
  params: { site: 'shop', locale: 'en' },
  query: {},
};

function sampleKey(loaderId = 'page') {
  return buildCacheKey(loaderId, sampleContext).key;
}

function sampleTags(loaderId = 'page') {
  const { dimensions } = buildCacheKey(loaderId, sampleContext);
  return buildDefaultTags(dimensions);
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
      it('returns null on a cache miss and the stored value on a hit', async () => {
        const key = sampleKey();
        expect(await cache.get(key)).toBeNull();

        await cache.set(key, { title: 'Products' }, 300, sampleTags());
        const hit = await cache.get(key);

        expect(hit?.value).toEqual({ title: 'Products' });
        expect(hit?.tags).toEqual(sampleTags());
      });
    });

    describe('when an entry TTL expires', () => {
      it('treats the entry as missing and removes it from storage', async () => {
        vi.useFakeTimers();
        const key = sampleKey('expiring');
        await cache.set(key, { stale: true }, 30, sampleTags('expiring'));

        vi.advanceTimersByTime(31_000);
        expect(await cache.get(key)).toBeNull();
      });
    });

    describe('when ttl is zero or negative', () => {
      it('keeps the entry until it is explicitly invalidated', async () => {
        vi.useFakeTimers();
        const key = sampleKey('persistent');
        await cache.set(key, { permanent: true }, 0, sampleTags('persistent'));

        vi.advanceTimersByTime(3600_000);
        expect(await cache.get(key)).not.toBeNull();
      });
    });

    describe('when invalidating by route tag', () => {
      it('deletes only entries whose tags match every required tag', async () => {
        const keyA = sampleKey('page');
        const keyB = buildCacheKey('footer', {
          ...sampleContext,
          url: '/other',
        }).key;

        await cache.set(keyA, { page: true }, 300, sampleTags('page'));
        await cache.set(
          keyB,
          { footer: true },
          300,
          buildDefaultTags(buildCacheKey('footer', { ...sampleContext, url: '/other' }).dimensions)
        );

        const deleted = await cache.invalidate({
          route: '/products',
          site: 'shop',
        } satisfies InvalidateInput);

        expect(deleted).toBe(1);
        expect(await cache.get(keyA)).toBeNull();
        expect(await cache.get(keyB)).not.toBeNull();
      });
    });

    describe('when deleting entries', () => {
      it('removes a single key and reports whether it existed', async () => {
        const key = sampleKey('delete-me');
        await cache.set(key, { temp: true }, 300, sampleTags('delete-me'));

        expect(await cache.delete(key)).toBe(true);
        expect(await cache.get(key)).toBeNull();
        expect(await cache.delete(key)).toBe(false);
      });
    });

    describe('when flushing entries', () => {
      it('removes every key from the in-memory backend', async () => {
        if (label !== 'InMemoryLoaderCache') return;

        const key = sampleKey('flush-me');
        await cache.set(key, { temp: true }, 300, sampleTags('flush-me'));
        await cache.flush();
        expect(await cache.get(key)).toBeNull();
      });
    });

    describe('when listing entries for admin tooling', () => {
      it('returns metadata without values and skips expired entries', async () => {
        vi.useFakeTimers();
        const liveKey = sampleKey('live');
        const expiredKey = sampleKey('expired-list');

        await cache.set(liveKey, { live: true }, 300, sampleTags('live'));
        await cache.set(expiredKey, { expired: true }, 10, sampleTags('expired-list'));
        vi.advanceTimersByTime(11_000);

        const entries = await cache.entries();
        expect(entries.some((entry) => entry.key === liveKey)).toBe(true);
        expect(entries.some((entry) => entry.key === expiredKey)).toBe(false);
        expect(entries.find((entry) => entry.key === liveKey)?.tags).toEqual(sampleTags('live'));
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

    expect(hit?.value).toEqual({ persisted: true });
  });
});

describe('createLoaderCache factory', () => {
  it('uses the in-memory backend when no unstorage driver is supplied', async () => {
    const cache = createLoaderCache();
    const key = sampleKey('factory-default');
    await cache.set(key, { ok: true }, 300, sampleTags('factory-default'));
    expect(await cache.get(key)).not.toBeNull();
  });

  it('still stores and retrieves entries when a namespace is configured', async () => {
    const cache = createLoaderCache({
      driver: memoryDriver(),
      namespace: 'preview-app',
      revalidate: 300,
    });
    const key = sampleKey('namespaced');
    await cache.set(key, { namespaced: true }, 300, sampleTags('namespaced'));

    expect(await cache.get(key)).toEqual(
      expect.objectContaining({ value: { namespaced: true } })
    );
  });
});
