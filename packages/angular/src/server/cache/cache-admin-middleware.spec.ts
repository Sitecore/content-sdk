/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCacheAdminMiddleware } from './cache-admin-middleware';
import { createLoaderCache } from './loader-cache';
import { buildCacheKey, buildDefaultTags } from './cache-key';
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

function createMockNext() {
  return vi.fn();
}

describe('createCacheAdminMiddleware', () => {
  const endpoint = '/api/_cache';
  let cache: ReturnType<typeof createLoaderCache>;

  beforeEach(async () => {
    cache = createLoaderCache({ revalidate: 300, defaultSiteName: 'demo' });
    const ctx = {
      url: '/about',
      params: { site: 'demo', locale: 'en' },
      query: {},
    };
    const { key, dimensions } = buildCacheKey('page', ctx);
    await cache.set(key, { title: 'About' }, 300, buildDefaultTags(dimensions));
  });

  describe('when the request path is outside the admin endpoint', () => {
    it('delegates to the next middleware', async () => {
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
  });

  describe('when auth rejects the caller', () => {
    it('responds with forbidden and does not touch the cache', async () => {
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
      expect(res.json).toHaveBeenCalledWith({ error: 'forbidden' });
    });
  });

  describe('when listing cache entries', () => {
    it('returns metadata for live entries without exposing cached values', async () => {
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
  });

  describe('when reading cache configuration', () => {
    it('returns the resolved cache config', async () => {
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
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ revalidate: 300, defaultSiteName: 'demo' })
      );
    });
  });

  describe('when invalidating cache entries', () => {
    it('requires at least a route or custom tags in the request body', async () => {
      const middleware = createCacheAdminMiddleware({ cache, endpoint });
      const res = createMockRes();

      await middleware(
        {
          method: 'POST',
          path: `${endpoint}/invalidate`,
          url: `${endpoint}/invalidate`,
          body: { site: 'demo' },
          query: {},
        } as ExpressRequest,
        res,
        createMockNext()
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'at least one of `route` or `tags` is required',
      });
    });

    it('deletes matching entries and reports how many were removed', async () => {
      const middleware = createCacheAdminMiddleware({ cache, endpoint });
      const res = createMockRes();

      await middleware(
        {
          method: 'POST',
          path: `${endpoint}/invalidate`,
          url: `${endpoint}/invalidate`,
          body: { route: '/about' },
          query: {},
        } as ExpressRequest,
        res,
        createMockNext()
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ deleted: 1 });
      expect(await cache.entries()).toHaveLength(0);
    });
  });

  describe('when flushing the entire cache', () => {
    it('removes every entry and returns ok', async () => {
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
      expect(await cache.entries()).toHaveLength(0);
    });
  });

  describe('when the admin action is unknown', () => {
    it('responds with not found', async () => {
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
      expect(res.json).toHaveBeenCalledWith({
        error: 'unknown cache admin action: unknown',
      });
    });
  });

  describe('when the cache throws while handling a request', () => {
    it('returns a 500 with the error message', async () => {
      const brokenCache = {
        ...cache,
        entries: vi.fn().mockRejectedValue(new Error('storage offline')),
      };
      const middleware = createCacheAdminMiddleware({ cache: brokenCache, endpoint });
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
      expect(res.json).toHaveBeenCalledWith({ error: 'storage offline' });
    });
  });
});
