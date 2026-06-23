/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServerLoaderRunner } from './server-loader-runner';
import type { LoaderCache, LoaderFn, LoaderRunnerInit } from '../loaders/models';
import { createLoaderCache } from './cache/loader-cache';
import { buildCacheKey } from './cache/cache-key';
import {
  mockAngularSitecoreConfig,
  makeLoaderContext,
  mockScParams,
} from '../testing/loader-spec-helpers';
import { LayoutServicePageState } from '@sitecore-content-sdk/content/layout';

describe('ServerLoaderRunner', () => {
  const mockConfig = mockAngularSitecoreConfig();
  const demoConfig = mockAngularSitecoreConfig({ defaultSite: 'demo' });
  const pageLoader: LoaderFn = vi.fn().mockResolvedValue({ title: 'Page' });

  beforeEach(async () => {
    vi.mocked(pageLoader).mockClear();
    vi.mocked(pageLoader).mockResolvedValue({ title: 'Page' });
  });

  it('should return error when loader id is not in registry', async () => {
    const provider = new ServerLoaderRunner({}, mockConfig);
    const result = await provider.resolve({
      loaderId: 'missing',
      url: '/path',
      routeParams: {},
      query: {},
      csdkRequestData: null,
    });
    expect(result).toEqual({
      kind: 'error',
      status: 500,
      message: 'No loader registered for id "missing"',
    });
  });

  it('should invoke loader and return data on cache miss', async () => {
    const provider = new ServerLoaderRunner({ page: pageLoader }, mockConfig);
    const result = await provider.resolve({
      loaderId: 'page',
      url: '/about',
      routeParams: { slug: 'about' },
      query: { q: '1' },
      csdkRequestData: null,
    });

    expect(pageLoader).toHaveBeenCalledWith({
      url: '/about',
      routeParams: { slug: 'about' },
      query: { q: '1' },
      scParams: {
        siteName: 'default',
      },
      csdkRequestData: undefined,
    });
    expect(result).toEqual({ kind: 'data', data: { title: 'Page' } });
  });

  it('should use scPreviewData.site as siteName for editing requests (multisite middleware skips /api/*)', async () => {
    const provider = new ServerLoaderRunner({ page: pageLoader }, mockConfig);
    await provider.resolve({
      loaderId: 'page',
      url: '/about',
      routeParams: {},
      query: {},
      csdkRequestData: {
        scPreviewData: {
          site: 'demo',
          itemId: 'item-1',
          language: 'en',
          mode: LayoutServicePageState.Edit,
          variantIds: ['_default'],
        },
      },
    });

    expect(pageLoader).toHaveBeenCalledWith(
      expect.objectContaining({
        scParams: { siteName: 'demo' },
      })
    );
  });

  it('should fall back to defaultSite when scParams.siteName is an empty string', async () => {
    const provider = new ServerLoaderRunner({ page: pageLoader }, demoConfig);
    await provider.resolve({
      loaderId: 'page',
      url: '/about',
      routeParams: {},
      query: {},
      csdkRequestData: { scParams: { siteName: '' } },
    });

    expect(pageLoader).toHaveBeenCalledWith(
      expect.objectContaining({
        scParams: { siteName: 'demo' },
      })
    );
  });

  it('should fall back to scPreviewData.site when scParams.siteName is an empty string', async () => {
    const provider = new ServerLoaderRunner({ page: pageLoader }, mockConfig);
    await provider.resolve({
      loaderId: 'page',
      url: '/about',
      routeParams: {},
      query: {},
      csdkRequestData: {
        scParams: { siteName: '' },
        scPreviewData: {
          site: 'demo',
          itemId: 'item-1',
          language: 'en',
          mode: LayoutServicePageState.Edit,
          variantIds: ['_default'],
        },
      },
    });

    expect(pageLoader).toHaveBeenCalledWith(
      expect.objectContaining({
        scParams: { siteName: 'demo' },
      })
    );
  });

  it('should return cached data without invoking loader', async () => {
    const cache: LoaderCache = {
      get: vi.fn().mockResolvedValue({ kind: 'hit', value: { cached: true }, cacheKey: 'k' }),
      set: vi.fn(),
      invalidate: vi.fn(),
      delete: vi.fn(),
      flush: vi.fn(),
      entries: vi.fn(),
      ttl: 300,
      enabled: vi.fn().mockReturnValue(true),
      config: {},
    };

    const provider = new ServerLoaderRunner({ page: pageLoader }, mockConfig, cache);
    const result = await provider.resolve({
      loaderId: 'page',
      url: '/cached',
      routeParams: {},
      query: {},
      csdkRequestData: null,
    });

    expect(result).toEqual({ kind: 'data', data: { cached: true } });
    expect(pageLoader).not.toHaveBeenCalled();
  });

  it('should return redirect when loader returns redirect result', async () => {
    vi.mocked(pageLoader).mockResolvedValueOnce({
      loaderRedirectTarget: '/other',
      status: 302,
    });
    const provider = new ServerLoaderRunner({ page: pageLoader }, mockConfig);
    const result = await provider.resolve({
      loaderId: 'page',
      url: '/redirect',
      routeParams: {},
      query: {},
      csdkRequestData: null,
    });

    expect(result).toEqual({
      kind: 'redirect',
      redirect: { loaderRedirectTarget: '/other', status: 302 },
    });
  });

  it('should return error with cause when loader throws', async () => {
    const err = new Error('Loader failed');
    vi.mocked(pageLoader).mockRejectedValueOnce(err);
    const provider = new ServerLoaderRunner({ page: pageLoader }, mockConfig);
    const result = await provider.resolve({
      loaderId: 'page',
      url: '/fail',
      routeParams: {},
      query: {},
      csdkRequestData: null,
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
      ttl: 300,
      enabled: vi.fn().mockReturnValue(true),
      config: {},
    };

    const provider = new ServerLoaderRunner({ page: pageLoader }, mockConfig, cache);
    await provider.resolve({
      loaderId: 'page',
      url: '/store',
      routeParams: {},
      query: {},
      csdkRequestData: null,
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
      ttl: 300,
      enabled: vi.fn().mockReturnValue(false),
      config: {},
    };

    const provider = new ServerLoaderRunner({ page: pageLoader }, mockConfig, cache);
    const payload = {
      loaderId: 'page',
      url: '/live',
      routeParams: {},
      query: {},
      csdkRequestData: null,
    };
    await provider.resolve(payload);
    await provider.resolve(payload);

    expect(pageLoader).toHaveBeenCalledTimes(2);
    expect(cache.get).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('should use the cache for a route that opts in even when global caching is disabled', async () => {
    const cache = createLoaderCache({ enabled: false, revalidate: 300 });
    const provider = new ServerLoaderRunner({ page: pageLoader }, demoConfig, cache);
    const request: LoaderRunnerInit = {
      loaderId: 'page',
      url: '/featured',
      routeParams: { locale: 'en' },
      query: {},
      csdkRequestData: null,
      cacheOptions: { enabled: true, tags: ['featured'], revalidate: 60 },
    };

    await provider.resolve(request);
    await provider.resolve(request);

    expect(pageLoader).toHaveBeenCalledTimes(1);
  });

  it('should pass cacheOptions.revalidate as TTL to cache.set', async () => {
    const cache = createLoaderCache({ revalidate: 300 });
    const setSpy = vi.spyOn(cache, 'set');
    const provider = new ServerLoaderRunner({ page: pageLoader }, demoConfig, cache);
    const request: LoaderRunnerInit = {
      loaderId: 'page',
      url: '/ttl-override',
      routeParams: { locale: 'en' },
      query: {},
      csdkRequestData: null,
      cacheOptions: { enabled: true, revalidate: 60 },
    };

    await provider.resolve(request);

    expect(setSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenCalledWith(
      expect.any(String),
      { title: 'Page' },
      60,
      expect.any(Array)
    );
    setSpy.mockRestore();
  });

  it('should merge cacheOptions.tags into tags passed to cache.set', async () => {
    const cache = createLoaderCache({ revalidate: 300 });
    const setSpy = vi.spyOn(cache, 'set');
    const provider = new ServerLoaderRunner({ page: pageLoader }, demoConfig, cache);
    const request: LoaderRunnerInit = {
      loaderId: 'page',
      url: '/tagged',
      routeParams: { locale: 'en' },
      query: {},
      csdkRequestData: null,
      cacheOptions: { enabled: true, tags: ['featured', 'campaign-x'] },
    };

    await provider.resolve(request);

    expect(setSpy).toHaveBeenCalledTimes(1);
    const tags = setSpy.mock.calls[0][3] as string[];
    expect(tags).toContain('featured');
    expect(tags).toContain('campaign-x');
    expect(tags).toContain('sc:site:demo');
    setSpy.mockRestore();
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
      ttl: 300,
      enabled: vi.fn().mockReturnValue(true),
      config: {},
    };

    const provider = new ServerLoaderRunner({ page: pageLoader }, mockConfig, cache);
    const result = await provider.resolve({
      loaderId: 'page',
      url: '/protected',
      routeParams: {},
      query: {},
      csdkRequestData: null,
    });

    expect(result.kind).toBe('redirect');
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('should serve stale data immediately and refresh in the background', async () => {
    let version = 1;
    const loader = vi.fn(async () => ({ title: `v${version++}` }));
    const cache = createLoaderCache({ revalidate: 300 });
    const provider = new ServerLoaderRunner({ page: loader }, demoConfig, cache);
    const request: LoaderRunnerInit = {
      loaderId: 'page',
      url: '/about',
      routeParams: { locale: 'en' },
      query: {},
      csdkRequestData: null,
    };

    await provider.resolve(request);
    const { key } = buildCacheKey(
      'page',
      makeLoaderContext({
        url: request.url,
        routeParams: request.routeParams,
        query: request.query,
        scParams: mockScParams({ siteName: 'demo' }),
      })
    );
    await cache.invalidate({ tags: [key] });

    const staleResult = await provider.resolve(request);
    expect(staleResult).toEqual({ kind: 'data', data: { title: 'v1' } });

    await vi.waitFor(async () => {
      expect(await cache.get(key)).toEqual(
        expect.objectContaining({ kind: 'hit', value: { title: 'v2' } })
      );
    });
    expect(loader).toHaveBeenCalledTimes(2);

    const freshResult = await provider.resolve(request);
    expect(freshResult).toEqual({ kind: 'data', data: { title: 'v2' } });
  });

  it('should coalesce concurrent stale-while-revalidate refreshes', async () => {
    let version = 1;
    const loader = vi.fn(async () => ({ title: `v${version++}` }));
    const cache = createLoaderCache({ revalidate: 300 });
    const provider = new ServerLoaderRunner({ page: loader }, demoConfig, cache);
    const request: LoaderRunnerInit = {
      loaderId: 'page',
      url: '/coalesce',
      routeParams: { locale: 'en' },
      query: {},
      csdkRequestData: null,
    };

    await provider.resolve(request);
    const { key } = buildCacheKey(
      'page',
      makeLoaderContext({
        url: request.url,
        routeParams: request.routeParams,
        query: request.query,
        scParams: mockScParams({ siteName: 'demo' }),
      })
    );
    await cache.invalidate({ tags: [key] });

    await Promise.all([provider.resolve(request), provider.resolve(request)]);

    await vi.waitFor(() => expect(loader.mock.calls.length).toBeGreaterThanOrEqual(2));
    expect(loader.mock.calls.length).toBe(2);
  });

  it('should warn when background cache write fails but still return stale data', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const loader = vi.fn().mockResolvedValue({ title: 'v2' });
    const cache: LoaderCache = {
      get: vi.fn().mockResolvedValue({ kind: 'stale', value: { title: 'v1' }, cacheKey: 'k' }),
      set: vi.fn().mockRejectedValue(new Error('write failed')),
      invalidate: vi.fn(),
      delete: vi.fn(),
      flush: vi.fn(),
      entries: vi.fn(),
      ttl: 300,
      enabled: vi.fn().mockReturnValue(true),
      config: {},
    };

    const provider = new ServerLoaderRunner({ page: loader }, demoConfig, cache);
    const result = await provider.resolve({
      loaderId: 'page',
      url: '/warn',
      routeParams: { locale: 'en' },
      query: {},
      csdkRequestData: null,
    });

    expect(result).toEqual({ kind: 'data', data: { title: 'v1' } });

    await vi.waitFor(() =>
      expect(warnSpy).toHaveBeenCalledWith(
        '[sitecore-loader-cache] background refresh failed to write cache entry:',
        'write failed'
      )
    );

    warnSpy.mockRestore();
  });
});
