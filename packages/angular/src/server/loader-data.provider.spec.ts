/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServerLoaderDataProvider } from './loader-data.provider';
import type { LoaderCache, LoaderFn } from '../loaders/models';
import { createLoaderCache } from './cache/loader-cache';

describe('ServerLoaderDataProvider', () => {
  const pageLoader: LoaderFn = vi.fn().mockResolvedValue({ title: 'Page' });

  beforeEach(() => {
    vi.mocked(pageLoader).mockClear();
    vi.mocked(pageLoader).mockResolvedValue({ title: 'Page' });
  });

  it('should return error when loader id is not in registry', async () => {
    const provider = new ServerLoaderDataProvider({});
    const result = await provider.resolve({
      loaderId: 'missing',
      url: '/path',
      params: {},
      query: {},
    });
    expect(result).toEqual({
      kind: 'error',
      status: 500,
      message: 'No loader registered for id "missing"',
    });
  });

  it('should invoke loader and return data on cache miss', async () => {
    const provider = new ServerLoaderDataProvider({ page: pageLoader });
    const result = await provider.resolve({
      loaderId: 'page',
      url: '/about',
      params: { slug: 'about' },
      query: { q: '1' },
    });

    expect(pageLoader).toHaveBeenCalledWith({
      url: '/about',
      params: { slug: 'about' },
      query: { q: '1' },
      requestContext: undefined,
    });
    expect(result).toEqual({ kind: 'data', data: { title: 'Page' } });
  });

  it('should return cached data without invoking loader', async () => {
    const cache: LoaderCache = {
      get: vi.fn().mockResolvedValue({ kind: 'hit', value: { cached: true }, cacheKey: 'k' }),
      set: vi.fn(),
      invalidate: vi.fn(),
      delete: vi.fn(),
      flush: vi.fn(),
      entries: vi.fn(),
      resolveTtl: vi.fn().mockReturnValue(300),
      enabled: vi.fn().mockReturnValue(true),
      getConfig: vi.fn(),
    };

    const provider = new ServerLoaderDataProvider({ page: pageLoader }, cache);
    const result = await provider.resolve({
      loaderId: 'page',
      url: '/cached',
      params: {},
      query: {},
    });

    expect(result).toEqual({ kind: 'data', data: { cached: true } });
    expect(pageLoader).not.toHaveBeenCalled();
  });

  it('should return redirect when loader returns redirect result', async () => {
    vi.mocked(pageLoader).mockResolvedValueOnce({
      loaderRedirectTarget: '/other',
      status: 302,
    });
    const provider = new ServerLoaderDataProvider({ page: pageLoader });
    const result = await provider.resolve({
      loaderId: 'page',
      url: '/redirect',
      params: {},
      query: {},
    });

    expect(result).toEqual({
      kind: 'redirect',
      redirect: { loaderRedirectTarget: '/other', status: 302 },
    });
  });

  it('should return error with cause when loader throws', async () => {
    const err = new Error('Loader failed');
    vi.mocked(pageLoader).mockRejectedValueOnce(err);
    const provider = new ServerLoaderDataProvider({ page: pageLoader });
    const result = await provider.resolve({
      loaderId: 'page',
      url: '/fail',
      params: {},
      query: {},
    });

    expect(result.kind).toBe('error');
    if (result.kind === 'error') {
      expect(result.message).toBe('Loader failed');
      expect(result.cause).toBe(err);
    }
  });

  it('should store loader result in cache when cacheable', async () => {
    const cache: LoaderCache = {
      get: vi.fn().mockResolvedValue({ kind: 'miss', cacheKey: 'k' }),
      set: vi.fn(),
      invalidate: vi.fn(),
      delete: vi.fn(),
      flush: vi.fn(),
      entries: vi.fn(),
      resolveTtl: vi.fn().mockReturnValue(300),
      enabled: vi.fn().mockReturnValue(true),
      getConfig: vi.fn(),
    };

    const provider = new ServerLoaderDataProvider({ page: pageLoader }, cache);
    await provider.resolve({
      loaderId: 'page',
      url: '/store',
      params: {},
      query: {},
    });

    expect(cache.set).toHaveBeenCalled();
  });

  it('should skip the cache when it is globally disabled and the route did not opt in', async () => {
    const cache: LoaderCache = {
      get: vi.fn(),
      set: vi.fn(),
      invalidate: vi.fn(),
      delete: vi.fn(),
      flush: vi.fn(),
      entries: vi.fn(),
      resolveTtl: vi.fn().mockReturnValue(300),
      enabled: vi.fn().mockReturnValue(false),
      getConfig: vi.fn(),
    };

    const provider = new ServerLoaderDataProvider({ page: pageLoader }, cache);
    await provider.resolve({
      loaderId: 'page',
      url: '/live',
      params: {},
      query: {},
    });
    await provider.resolve({
      loaderId: 'page',
      url: '/live',
      params: {},
      query: {},
    });

    expect(pageLoader).toHaveBeenCalledTimes(2);
    expect(cache.get).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('should use the cache for a route that opts in even when global caching is disabled', async () => {
    const cache = createLoaderCache({ enabled: false, revalidate: 300 });
    const provider = new ServerLoaderDataProvider({ page: pageLoader }, cache);
    const request = {
      loaderId: 'page',
      url: '/featured',
      params: { site: 'demo', locale: 'en' },
      query: {},
      cacheOptions: { enabled: true, tags: ['featured'], revalidate: 60 },
    };

    await provider.resolve(request);
    await provider.resolve(request);

    expect(pageLoader).toHaveBeenCalledTimes(1);
  });

  it('should not cache redirect responses', async () => {
    vi.mocked(pageLoader).mockResolvedValueOnce({
      loaderRedirectTarget: '/login',
      status: 302,
    });
    const cache: LoaderCache = {
      get: vi.fn().mockResolvedValue({ kind: 'miss', cacheKey: 'k' }),
      set: vi.fn(),
      invalidate: vi.fn(),
      delete: vi.fn(),
      flush: vi.fn(),
      entries: vi.fn(),
      resolveTtl: vi.fn().mockReturnValue(300),
      enabled: vi.fn().mockReturnValue(true),
      getConfig: vi.fn(),
    };

    const provider = new ServerLoaderDataProvider({ page: pageLoader }, cache);
    const result = await provider.resolve({
      loaderId: 'page',
      url: '/protected',
      params: {},
      query: {},
    });

    expect(result.kind).toBe('redirect');
    expect(cache.set).not.toHaveBeenCalled();
  });
});
