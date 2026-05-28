/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCacheAdminMiddleware } from './cache-admin-middleware';
import { createLoaderCache } from '../loader-cache';
import { buildCacheKey } from '../cache-key';
import { buildLoaderCacheTags } from '../cache-tags';
import type { ExpressRequest, ExpressResponse } from '../../models';

function createMockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as ExpressResponse & {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
  };
}

function createMockNext() {
  return vi.fn();
}

describe('createCacheAdminMiddleware', () => {
  const endpoint = '/api/_cache';
  let cache: ReturnType<typeof createLoaderCache>;
  let cacheKey: string;

  beforeEach(async () => {
    cache = createLoaderCache({ revalidate: 300, defaultSiteName: 'demo' });
    const ctx = {
      url: '/about',
      params: { site: 'demo', locale: 'en' },
      query: {},
    };
    const built = buildCacheKey('page', ctx);
    cacheKey = built.key;
    await cache.set(
      cacheKey,
      { title: 'About' },
      300,
      buildLoaderCacheTags('page', built.dimensions, cacheKey)
    );
  });

  it('delegates when path is outside admin endpoint', async () => {
    const middleware = createCacheAdminMiddleware({ cache, endpoint });
    const next = createMockNext();
    const res = createMockRes();

    await middleware(
      { method: 'GET', path: '/other', url: '/other', body: {}, query: {} } as ExpressRequest,
      res,
      next
    );

    expect(next).toHaveBeenCalledWith();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('returns 403 when auth rejects', async () => {
    const middleware = createCacheAdminMiddleware({
      cache,
      endpoint,
      auth: () => false,
    });
    const res = createMockRes();

    await middleware(
      {
        method: 'GET',
        path: `${endpoint}/entries`,
        url: `${endpoint}/entries`,
        body: {},
        query: {},
      } as ExpressRequest,
      res,
      createMockNext()
    );

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('lists entries without values', async () => {
    const middleware = createCacheAdminMiddleware({ cache, endpoint });
    const res = createMockRes();

    await middleware(
      {
        method: 'GET',
        path: `${endpoint}/entries`,
        url: `${endpoint}/entries`,
        body: {},
        query: {},
      } as ExpressRequest,
      res,
      createMockNext()
    );

    expect(res.status).toHaveBeenCalledWith(200);
    const payload = res.json.mock.calls[0][0] as { entries: Array<{ key: string }> };
    expect(payload.entries.length).toBeGreaterThan(0);
    expect(payload.entries[0]).not.toHaveProperty('value');
  });

  it('requires non-empty tags for invalidate', async () => {
    const middleware = createCacheAdminMiddleware({ cache, endpoint });
    const res = createMockRes();

    await middleware(
      {
        method: 'POST',
        path: `${endpoint}/invalidate`,
        url: `${endpoint}/invalidate`,
        body: {},
        query: {},
      } as ExpressRequest,
      res,
      createMockNext()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'non-empty `tags` array is required' });
  });

  it('marks matching entries stale by tag', async () => {
    const middleware = createCacheAdminMiddleware({ cache, endpoint });
    const res = createMockRes();

    await middleware(
      {
        method: 'POST',
        path: `${endpoint}/invalidate`,
        url: `${endpoint}/invalidate`,
        body: { tags: [cacheKey] },
        query: {},
      } as ExpressRequest,
      res,
      createMockNext()
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ marked: 1 });
    expect((await cache.get(cacheKey)).kind).toBe('stale');
  });

  it('returns resolved cache config', async () => {
    const middleware = createCacheAdminMiddleware({ cache, endpoint });
    const res = createMockRes();

    await middleware(
      {
        method: 'GET',
        path: `${endpoint}/config`,
        url: `${endpoint}/config`,
        body: {},
        query: {},
      } as ExpressRequest,
      res,
      createMockNext()
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ revalidate: 300 }));
  });

  it('flushes all cache entries', async () => {
    const middleware = createCacheAdminMiddleware({ cache, endpoint });
    const res = createMockRes();

    await middleware(
      {
        method: 'POST',
        path: `${endpoint}/flush`,
        url: `${endpoint}/flush`,
        body: {},
        query: {},
      } as ExpressRequest,
      res,
      createMockNext()
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
    expect((await cache.get(cacheKey)).kind).toBe('miss');
  });

  it('returns 404 for unknown admin actions', async () => {
    const middleware = createCacheAdminMiddleware({ cache, endpoint });
    const res = createMockRes();

    await middleware(
      {
        method: 'GET',
        path: `${endpoint}/unknown`,
        url: `${endpoint}/unknown`,
        body: {},
        query: {},
      } as ExpressRequest,
      res,
      createMockNext()
    );

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns 500 when cache operations fail', async () => {
    const failingCache = createLoaderCache({ revalidate: 300 });
    vi.spyOn(failingCache, 'entries').mockRejectedValue(new Error('storage down'));

    const middleware = createCacheAdminMiddleware({ cache: failingCache, endpoint });
    const res = createMockRes();

    await middleware(
      {
        method: 'GET',
        path: `${endpoint}/entries`,
        url: `${endpoint}/entries`,
        body: {},
        query: {},
      } as ExpressRequest,
      res,
      createMockNext()
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'storage down' });
  });
});
