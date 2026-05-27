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
});
