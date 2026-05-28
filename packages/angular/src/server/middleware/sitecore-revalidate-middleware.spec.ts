/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSitecoreRevalidateMiddleware } from './sitecore-revalidate-middleware';
import { createLoaderCache } from '../cache/loader-cache';
import { buildCacheKey } from '../cache/cache-key';
import { buildLoaderCacheTags } from '../cache/cache-tags';
import type { ExpressRequest, ExpressResponse } from '../models';

function createMockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as ExpressResponse & {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
  };
}

describe('createSitecoreRevalidateMiddleware', () => {
  let cache: ReturnType<typeof createLoaderCache>;
  let cacheKey: string;
  const next = vi.fn();

  beforeEach(async () => {
    delete process.env.SITECORE_REVALIDATE_SECRET;
    next.mockClear();
    cache = createLoaderCache({ revalidate: 300 });
    const built = buildCacheKey('page', {
      url: '/about',
      params: { site: 'demo', locale: 'en' },
      query: {},
    });
    cacheKey = built.key;
    await cache.set(
      cacheKey,
      { title: 'About' },
      300,
      buildLoaderCacheTags('page', built.dimensions, cacheKey, {
        layout: { sitecore: { route: { itemId: '71B0BA0716214254AEE4429B1A970C8B' } } },
        locale: 'en',
        mode: {},
      })
    );
  });

  afterEach(() => {
    delete process.env.SITECORE_REVALIDATE_SECRET;
  });

  it('marks entries stale on item publish webhook', async () => {
    const middleware = createSitecoreRevalidateMiddleware({ cache, defaultLocale: 'en' });
    const res = createMockRes();

    await middleware(
      {
        method: 'POST',
        path: '/api/revalidate',
        url: '/api/revalidate',
        headers: {},
        body: {
          updates: [{ identifier: '71B0BA0716214254AEE4429B1A970C8B', entity_culture: 'en' }],
        },
        query: {},
      } as ExpressRequest,
      res,
      next
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect((await cache.get(cacheKey)).kind).toBe('stale');
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        revalidated: true,
        tagsCount: expect.any(Number),
        marked: expect.any(Number),
        invocation_id: null,
        continues: false,
        durationMs: expect.any(Number),
      })
    );
    const body = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(body.tagsCount).toBeGreaterThan(0);
    expect(body.marked).toBeGreaterThan(0);
    expect(body.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('returns 401 when secret is configured but header mismatches', async () => {
    process.env.SITECORE_REVALIDATE_SECRET = 'expected';
    const middleware = createSitecoreRevalidateMiddleware({ cache });
    const res = createMockRes();

    await middleware(
      {
        method: 'POST',
        path: '/api/revalidate',
        url: '/api/revalidate',
        headers: {},
        body: { tags: ['sc:site:demo'] },
        query: {},
      } as ExpressRequest,
      res,
      next
    );

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('falls through non-POST requests', async () => {
    const middleware = createSitecoreRevalidateMiddleware({ cache });
    const res = createMockRes();

    await middleware(
      {
        method: 'GET',
        path: '/api/revalidate',
        url: '/api/revalidate',
        headers: {},
        body: {},
        query: {},
      } as ExpressRequest,
      res,
      next
    );

    expect(next).toHaveBeenCalled();
  });

  it('returns 400 when request body is not a JSON object', async () => {
    const middleware = createSitecoreRevalidateMiddleware({ cache });
    const res = createMockRes();

    await middleware(
      {
        method: 'POST',
        path: '/api/revalidate',
        url: '/api/revalidate',
        headers: {},
        body: ['not', 'an', 'object'],
        query: {},
      } as ExpressRequest,
      res,
      next
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Request body must be a JSON object.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 when resolved tags are empty', async () => {
    const middleware = createSitecoreRevalidateMiddleware({ cache, defaultLocale: 'en' });
    const res = createMockRes();

    await middleware(
      {
        method: 'POST',
        path: '/api/revalidate',
        url: '/api/revalidate',
        headers: {},
        body: { updates: [] },
        query: {},
      } as ExpressRequest,
      res,
      next
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        'Provide non-empty `updates` (with identifiers) and/or `tags` that resolve to at least one cache tag.',
    });
  });

  it('marks dictionary loader entries stale via sites fan-out even without webhook tags', async () => {
    const dictBuilt = buildCacheKey('dictionary', {
      url: '/',
      params: { site: 'demo', locale: 'en' },
      query: {},
    });
    const dictKey = dictBuilt.key;
    await cache.set(dictKey, { hello: 'world' }, 300, buildLoaderCacheTags('dictionary', dictBuilt.dimensions, dictKey));

    const middleware = createSitecoreRevalidateMiddleware({
      cache,
      defaultLocale: 'en',
      sites: [{ name: 'demo', hostName: '*', language: 'en' }],
    });
    const res = createMockRes();

    await middleware(
      {
        method: 'POST',
        path: '/api/revalidate',
        url: '/api/revalidate',
        headers: {},
        body: { invocation_id: 'dict-fanout', continues: true },
        query: {},
      } as ExpressRequest,
      res,
      next
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect((await cache.get(dictKey)).kind).toBe('stale');
    expect(res.json).toHaveBeenCalledWith({
      revalidated: true,
      tagsCount: 1,
      marked: 1,
      invocation_id: 'dict-fanout',
      continues: true,
      durationMs: expect.any(Number),
    });
  });

  it('returns 500 when cache.invalidate throws', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const failingCache = {
      ...cache,
      invalidate: vi.fn().mockRejectedValue(new Error('invalidate failed')),
    };
    const middleware = createSitecoreRevalidateMiddleware({ cache: failingCache, defaultLocale: 'en' });
    const res = createMockRes();

    await middleware(
      {
        method: 'POST',
        path: '/api/revalidate',
        url: '/api/revalidate',
        headers: {},
        body: { tags: ['sc:site:demo'] },
        query: {},
      } as ExpressRequest,
      res,
      next
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' });
    errorSpy.mockRestore();
  });
});
