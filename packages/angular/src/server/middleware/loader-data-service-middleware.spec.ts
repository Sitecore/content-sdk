/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DEFAULT_VARIANT } from '@sitecore-content-sdk/content/personalize';
import type { LoaderFn } from '../../loaders/models';
import { NotFoundNavigationError, LoaderHttpError } from '../../loaders/models';
import { createLoaderDataServiceMiddleware } from './loader-data-service-middleware';
import { LOADER_DATA_ENDPOINT } from '../constants';
import type { LoaderRegistry } from '../../loaders/loader-registry.token';
import { createLoaderCache } from '../cache/loader-cache';
import { mockAngularSitecoreConfig } from '../../testing/loader-spec-helpers';

/**
 * Minimal Express `res` stub for middleware tests.
 * @returns {object} Mock with `status` and `json` spies.
 */
function createMockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
}

/**
 * Express `next` stub.
 * @returns {ReturnType<typeof vi.fn>} Spy function.
 */
function createMockNext() {
  return vi.fn();
}

describe('createLoaderDataServiceMiddleware', () => {
  const endpoint = LOADER_DATA_ENDPOINT;
  const mockConfig = mockAngularSitecoreConfig({ defaultSite: 'demo' });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /** eslint-disable jsdoc/require-jsdoc */
  /** eslint-disable jsdoc/require-param */
  function createMiddleware(opts: {
    loaders: LoaderRegistry;
    endpoint?: string;
    cache?: import('../../loaders/models').LoaderCache;
  }) {
    return createLoaderDataServiceMiddleware(mockConfig, {
      ...opts,
      endpoint: opts.endpoint ?? endpoint,
      cache: opts.cache ?? createLoaderCache({ revalidate: 300 }),
    });
  }

  it('should handle POST request', async () => {
    const mockLoader = vi.fn().mockResolvedValue({ title: 'Home' }) as LoaderFn;
    const middleware = createMiddleware({
      loaders: { page: mockLoader },
      endpoint,
    });
    const req = {
      method: 'POST',
      path: endpoint,
      body: { loaderId: 'page', url: '/', routeParams: {}, query: {} },
      query: {},
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockLoader).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/',
        routeParams: {},
        query: {},
        scParams: { siteName: 'demo', variantId: DEFAULT_VARIANT, componentVariantIds: [] },
        csdkRequestData: expect.any(Object),
      })
    );
    expect(res.json).toHaveBeenCalledWith({
      kind: 'data',
      data: { title: 'Home' },
    });
  });

  it('should handle GET request', async () => {
    const mockLoader = vi.fn().mockResolvedValue({ id: '1' }) as LoaderFn;
    const middleware = createMiddleware({
      loaders: { page: mockLoader },
      endpoint,
    });
    const req = {
      method: 'GET',
      path: endpoint,
      body: undefined,
      query: { loaderId: 'page', url: '/about', q: 'search' },
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockLoader).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/about',
        routeParams: {},
        query: { q: 'search' },
        scParams: { siteName: 'demo', variantId: DEFAULT_VARIANT, componentVariantIds: [] },
      })
    );
    expect(res.json).toHaveBeenCalledWith({
      kind: 'data',
      data: { id: '1' },
    });
  });

  it('should reject other request types', async () => {
    const mockLoader = vi.fn() as LoaderFn;
    const middleware = createMiddleware({
      loaders: { page: mockLoader },
      endpoint,
    });
    const req = {
      method: 'PUT',
      path: endpoint,
      body: {},
      query: {},
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockLoader).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({
      kind: 'error',
      status: 405,
      message: 'Method not allowed',
    });
  });

  it('should handle redirect data', async () => {
    const mockLoader = vi.fn().mockResolvedValue({
      loaderRedirectTarget: '/other-page',
      status: 302,
    }) as LoaderFn;
    const middleware = createMiddleware({
      loaders: { page: mockLoader },
      endpoint,
    });
    const req = {
      method: 'POST',
      path: endpoint,
      body: { loaderId: 'page', url: '/redirect-me', routeParams: {}, query: {} },
      query: {},
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      kind: 'redirect',
      redirect: {
        loaderRedirectTarget: '/other-page',
        status: 302,
      },
    });
  });

  it('should handle basic data', async () => {
    const mockLoader = vi.fn().mockResolvedValue({ items: [1, 2, 3] }) as LoaderFn;
    const middleware = createMiddleware({
      loaders: { page: mockLoader },
      endpoint,
    });
    const req = {
      method: 'POST',
      path: endpoint,
      body: { loaderId: 'page', url: '/list', routeParams: {}, query: {} },
      query: {},
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(res.json).toHaveBeenCalledWith({
      kind: 'data',
      data: { items: [1, 2, 3] },
    });
  });

  it('should handle loader error', async () => {
    const mockLoader = vi
      .fn()
      .mockRejectedValue(new LoaderHttpError(503, 'Service unavailable')) as LoaderFn;
    const middleware = createMiddleware({
      loaders: { page: mockLoader },
      endpoint,
    });
    const req = {
      method: 'POST',
      path: endpoint,
      body: { loaderId: 'page', url: '/', routeParams: {}, query: {} },
      query: {},
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      kind: 'error',
      status: 503,
      message: 'Service unavailable',
    });
  });

  it('should handle loader not found error', async () => {
    const mockLoader = vi.fn().mockRejectedValue(new NotFoundNavigationError()) as LoaderFn;
    const middleware = createMiddleware({
      loaders: { page: mockLoader },
      endpoint,
    });
    const req = {
      method: 'POST',
      path: endpoint,
      body: { loaderId: 'page', url: '/missing', routeParams: {}, query: {} },
      query: {},
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      kind: 'notFound',
      status: 404,
    });
  });

  it('should return error when loader id is not in registry', async () => {
    const middleware = createMiddleware({
      loaders: { page: vi.fn() as LoaderFn },
      endpoint,
    });
    const req = {
      method: 'POST',
      path: endpoint,
      body: { loaderId: 'unknownLoader', url: '/', routeParams: {}, query: {} },
      query: {},
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(res.json).toHaveBeenCalledWith({
      kind: 'error',
      status: 500,
      message: 'No loader registered for id "unknownLoader"',
    });
  });

  it('should call next when path does not match endpoint', async () => {
    const middleware = createMiddleware({
      loaders: { page: vi.fn() as LoaderFn },
      endpoint,
    });
    const req = {
      method: 'POST',
      path: '/other-path',
      body: {},
      query: {},
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(next).toHaveBeenCalledWith();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should serve cached loader data on repeat requests without re-running the loader', async () => {
    const mockLoader = vi.fn().mockResolvedValue({ title: 'Cached page' }) as LoaderFn;
    const cache = createLoaderCache({ revalidate: 300 });
    const setSpy = vi.spyOn(cache, 'set');
    const middleware = createMiddleware({
      loaders: { page: mockLoader },
      endpoint,
      cache,
    });
    const req = {
      method: 'POST',
      path: endpoint,
      body: {
        loaderId: 'page',
        url: '/cached-page',
        routeParams: { locale: 'en' },
        query: {},
      },
      query: {},
      headers: {},
    };
    const res1 = createMockRes();
    const res2 = createMockRes();

    await middleware(req as any, res1 as any, createMockNext());
    await middleware(req as any, res2 as any, createMockNext());

    expect(mockLoader).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenCalledWith(
      'sc:loader:page:demo:en:_default:cached-page',
      { title: 'Cached page' },
      300,
      expect.arrayContaining([
        'sc:loader:page:demo:en:_default:cached-page',
        'sc:site:demo',
        'sc:locale:en',
      ])
    );
    expect(res1.json).toHaveBeenCalledWith({
      kind: 'data',
      data: { title: 'Cached page' },
    });
    expect(res2.json).toHaveBeenCalledWith({
      kind: 'data',
      data: { title: 'Cached page' },
    });
    setSpy.mockRestore();
  });

  it('should return 400 when POST body missing loaderId', async () => {
    const middleware = createMiddleware({
      loaders: { page: vi.fn() as LoaderFn },
      endpoint,
    });
    const req = {
      method: 'POST',
      path: endpoint,
      body: { url: '/', routeParams: {}, query: {} },
      query: {},
    };
    const res = createMockRes();
    const next = createMockNext();

    await middleware(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      kind: 'error',
      status: 400,
      message: 'Missing loaderId',
    });
  });
});
