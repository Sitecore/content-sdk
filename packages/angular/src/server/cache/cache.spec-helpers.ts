/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { LoaderCache, LoaderContext } from '../../loaders/models';
import { buildCacheKey } from './cache-key';
import { buildLoaderCacheTags } from './cache-tags';

export const sampleContext: LoaderContext = {
  url: '/products',
  params: { site: 'shop', locale: 'en' },
  query: {},
};

export function sampleKey(loaderId = 'page'): string {
  return buildCacheKey(loaderId, sampleContext).key;
}

export function sampleTags(loaderId = 'page', value?: unknown): string[] {
  const { key, dimensions } = buildCacheKey(loaderId, sampleContext);
  return buildLoaderCacheTags(loaderId, dimensions, key, value);
}

export function runSharedLoaderCacheContract(
  label: string,
  createCache: () => LoaderCache | Promise<LoaderCache>,
  cleanup?: () => Promise<void>
): void {
  describe(`${label} shared cache contract`, () => {
    let cache: LoaderCache;

    beforeEach(async () => {
      cache = await createCache();
    });

    afterEach(async () => {
      await cleanup?.();
      vi.useRealTimers();
    });

    it('returns miss on empty key and hit after set', async () => {
      const key = sampleKey();
      expect(await cache.get(key)).toEqual({ kind: 'miss', cacheKey: key });

      await cache.set(key, { title: 'Products' }, 300, sampleTags());
      expect(await cache.get(key)).toEqual({
        kind: 'hit',
        value: { title: 'Products' },
        cacheKey: key,
      });
    });

    it('returns stale after TTL expires without deleting the entry', async () => {
      vi.useFakeTimers();
      const key = sampleKey('expiring');
      await cache.set(key, { stale: true }, 30, sampleTags('expiring'));

      vi.advanceTimersByTime(31_000);
      expect(await cache.get(key)).toEqual({
        kind: 'stale',
        value: { stale: true },
        cacheKey: key,
      });
    });

    it('keeps zero-TTL entries until explicitly invalidated', async () => {
      vi.useFakeTimers();
      const key = sampleKey('persistent');
      await cache.set(key, { permanent: true }, 0, sampleTags('persistent'));

      vi.advanceTimersByTime(3_600_000);
      expect((await cache.get(key)).kind).toBe('hit');
    });

    it('marks matching entries stale by site tag without deleting them', async () => {
      const keyA = sampleKey('page');
      const keyB = buildCacheKey('footer', { ...sampleContext, url: '/other' }).key;

      await cache.set(keyA, { page: true }, 300, sampleTags('page'));
      const tagsB = buildLoaderCacheTags(
        'footer',
        buildCacheKey('footer', { ...sampleContext, url: '/other' }).dimensions,
        keyB
      );
      await cache.set(keyB, { footer: true }, 300, tagsB);

      expect(await cache.invalidate({ tags: ['sc:site:shop'] })).toBe(2);
      expect((await cache.get(keyA)).kind).toBe('stale');
      expect((await cache.get(keyB)).kind).toBe('stale');
    });

    it('marks a single entry stale by self-key tag', async () => {
      const key = sampleKey('page');
      await cache.set(key, { page: true }, 300, sampleTags('page'));

      expect(await cache.invalidate({ tags: [key] })).toBe(1);
      expect((await cache.get(key)).kind).toBe('stale');
    });

    it('counts already stale entries during invalidate without rewriting them', async () => {
      const key = sampleKey('stale-twice');
      await cache.set(key, { value: 1 }, 300, sampleTags('stale-twice'));

      expect(await cache.invalidate({ tags: [key] })).toBe(1);
      expect(await cache.invalidate({ tags: [key] })).toBe(1);
      expect((await cache.get(key)).kind).toBe('stale');
    });

    it('deletes a key and unlinks it from the tag index', async () => {
      const key = sampleKey('delete-me');
      await cache.set(key, { temp: true }, 300, sampleTags('delete-me'));

      expect(await cache.delete(key)).toBe(true);
      expect(await cache.get(key)).toEqual({ kind: 'miss', cacheKey: key });
      expect(await cache.delete(key)).toBe(false);
    });

    it('flushes every entry', async () => {
      const key = sampleKey('flush-me');
      await cache.set(key, { temp: true }, 300, sampleTags('flush-me'));
      await cache.flush();
      expect(await cache.get(key)).toEqual({ kind: 'miss', cacheKey: key });
    });

    it('returns zero from invalidate when tags are empty', async () => {
      const key = sampleKey('no-tags');
      await cache.set(key, { keep: true }, 300, sampleTags('no-tags'));
      expect(await cache.invalidate({ tags: [] })).toBe(0);
      expect((await cache.get(key)).kind).toBe('hit');
    });

    it('relinks tag index when overwriting an entry', async () => {
      const key = sampleKey('overwrite');
      await cache.set(key, { v: 1 }, 300, ['sc:site:old']);
      await cache.set(key, { v: 2 }, 300, ['sc:site:new']);

      expect(await cache.invalidate({ tags: ['sc:site:old'] })).toBe(0);
      expect(await cache.invalidate({ tags: ['sc:site:new'] })).toBe(1);
      expect((await cache.get(key)).kind).toBe('stale');
    });

    it('lists entry metadata without values', async () => {
      const liveKey = sampleKey('live');
      await cache.set(liveKey, { live: true }, 300, sampleTags('live'));
      await cache.invalidate({ tags: [liveKey] });

      const live = (await cache.entries()).find((entry) => entry.key === liveKey);
      expect(live?.tags).toEqual(sampleTags('live'));
      expect(live?.stale).toBe(true);
    });

    it('exposes resolved config and ttl', () => {
      expect(cache.enabled()).toBe(true);
      expect(cache.resolveTtl()).toBe(300);
      expect(cache.getConfig()).toMatchObject({ revalidate: 300, defaultSiteName: 'default' });
    });
  });
}
