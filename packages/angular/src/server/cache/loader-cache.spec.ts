/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import memoryDriver from 'unstorage/drivers/memory';
import { createLoaderCache } from './loader-cache';
import { InMemoryLoaderCache } from './default-in-memory-cache';
import { UnstorageLoaderCache } from './unstorage-loader-cache';
import { sampleKey, sampleTags } from './cache.spec-helpers';

describe('createLoaderCache factory', () => {
  it('returns an InMemoryLoaderCache when no driver is supplied', () => {
    const cache = createLoaderCache();
    expect(cache).toBeInstanceOf(InMemoryLoaderCache);
  });

  it('returns an UnstorageLoaderCache when a driver is supplied', () => {
    const cache = createLoaderCache({ driver: memoryDriver(), revalidate: 300 });
    expect(cache).toBeInstanceOf(UnstorageLoaderCache);
  });

  it('uses the in-memory backend for get/set when no driver is supplied', async () => {
    const cache = createLoaderCache();
    const key = sampleKey('factory-default');
    await cache.set(key, { ok: true }, 300, sampleTags('factory-default'));
    expect((await cache.get(key)).kind).toBe('hit');
  });

  it('uses the unstorage backend for get/set when a driver is supplied', async () => {
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
