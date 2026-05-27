/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import { InMemoryLoaderCache, InMemoryTagIndex } from './default-in-memory-cache';
import { runSharedLoaderCacheContract, sampleKey, sampleTags } from './cache.spec-helpers';

describe('InMemoryTagIndex', () => {
  it('links keys under multiple tags and resolves the union', () => {
    const index = new InMemoryTagIndex();
    index.link('key-a', ['sc:site:demo', 'sc:locale:en']);
    index.link('key-b', ['sc:site:demo']);

    expect(index.resolveKeys(['sc:site:demo']).has('key-a')).toBe(true);
    expect(index.resolveKeys(['sc:site:demo']).has('key-b')).toBe(true);
    expect(index.resolveKeys(['sc:locale:en']).has('key-a')).toBe(true);
    expect(index.resolveKeys(['sc:locale:en']).has('key-b')).toBe(false);
  });

  it('unlinks keys and removes empty tag buckets', () => {
    const index = new InMemoryTagIndex();
    index.link('key-a', ['sc:site:demo']);
    index.unlink('key-a', ['sc:site:demo']);

    expect(index.resolveKeys(['sc:site:demo']).size).toBe(0);
  });

  it('clears all tag buckets', () => {
    const index = new InMemoryTagIndex();
    index.link('key-a', ['sc:site:demo', 'sc:locale:en']);
    index.clear();

    expect(index.resolveKeys(['sc:site:demo']).size).toBe(0);
    expect(index.resolveKeys(['sc:locale:en']).size).toBe(0);
  });
});

describe('InMemoryLoaderCache', () => {
  runSharedLoaderCacheContract(
    'InMemoryLoaderCache',
    () => new InMemoryLoaderCache({ revalidate: 300, defaultSiteName: 'default' })
  );

  it('applies config defaults from the constructor', () => {
    const cache = new InMemoryLoaderCache({ revalidate: 60, enabled: false });
    expect(cache.resolveTtl()).toBe(60);
    expect(cache.enabled()).toBe(false);
    expect(cache.getConfig()).toMatchObject({
      revalidate: 60,
      enabled: false,
      defaultSiteName: 'default',
      defaultLocale: 'en',
    });
  });

  it('markStale returns false for missing keys', async () => {
    const cache = new InMemoryLoaderCache({ revalidate: 300 });
    expect(await cache.markStale('missing-key')).toBe(false);
  });

  it('markStale returns true for already stale entries without rewriting them', async () => {
    const cache = new InMemoryLoaderCache({ revalidate: 300 });
    const key = sampleKey('already-stale');
    await cache.set(key, { value: true }, 300, sampleTags('already-stale'));
    await cache.markStale(key);

    const before = await cache.get(key);
    expect(await cache.markStale(key)).toBe(true);
    const after = await cache.get(key);
    expect(after).toEqual(before);
  });

  it('does not leave stale tag pointers after delete', async () => {
    const cache = new InMemoryLoaderCache({ revalidate: 300 });
    const key = sampleKey('deleted-tag');
    const tag = 'sc:site:deleted';

    await cache.set(key, { value: true }, 300, [tag, key]);
    await cache.delete(key);

    expect(await cache.invalidate({ tags: [tag] })).toBe(0);
  });
});
