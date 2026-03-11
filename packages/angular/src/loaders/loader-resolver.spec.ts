import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID, REQUEST, TransferState, makeStateKey } from '@angular/core';
import { provideRouter, RedirectCommand } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loaderResolver } from './loader-resolver';
import { LOADER_REGISTRY } from './loader-registry.token';
import { LoaderDataService } from './loader-data.service';
import { getLoaderId } from './utils';
import type { LoaderFn } from './models';
import type { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

function makeRouteSnapshot(overrides: Partial<{
  params: Record<string, string>;
  queryParams: Record<string, string | string[]>;
  pathFromRoot: Array<{ params: Record<string, string> }>;
}> = {}): ActivatedRouteSnapshot {
  return {
    params: overrides.params ?? {},
    queryParams: overrides.queryParams ?? {},
    pathFromRoot: overrides.pathFromRoot ?? [{ params: {} }],
  } as unknown as ActivatedRouteSnapshot;
}

function makeRouterStateSnapshot(url: string): RouterStateSnapshot {
  return { url } as RouterStateSnapshot;
}

describe('loaderResolver', () => {
  describe('browser', () => {
    let mockLoaderData: { getData: ReturnType<typeof vi.fn> };
    let transferState: TransferState;

    beforeEach(() => {
      mockLoaderData = { getData: vi.fn() };
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          TransferState,
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: LOADER_REGISTRY, useValue: { page: (async () => ({})) as LoaderFn } },
          { provide: LoaderDataService, useValue: mockLoaderData },
        ],
      });
      transferState = TestBed.inject(TransferState);
    });

    it('should return data from transfer state when key exists', async () => {
      const resolver = loaderResolver('page');
      const key = makeStateKey<unknown>('loader:page:/path');
      transferState.set(key, { fromTransfer: true });

      const route = makeRouteSnapshot();
      const state = makeRouterStateSnapshot('/path');
      const result = await TestBed.runInInjectionContext(async () => {
        return (resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>)(
          route,
          state
        );
      });

      expect(result).toEqual({ fromTransfer: true });
      expect(transferState.hasKey(key)).toBe(false);
      expect(mockLoaderData.getData).not.toHaveBeenCalled();
    });

    it('should call LoaderDataService.getData with correct request and return data', async () => {
      mockLoaderData.getData.mockResolvedValue({ kind: 'data', data: { title: 'Home' } });

      const resolver = loaderResolver('page');
      const route = makeRouteSnapshot({
        params: { id: '123' },
        queryParams: { q: 'search' },
        pathFromRoot: [{ params: { id: '123' } }],
      });
      const state = makeRouterStateSnapshot('/page/123');

      const result = await TestBed.runInInjectionContext(async () => {
        return (resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>)(
          route,
          state
        );
      });

      expect(mockLoaderData.getData).toHaveBeenCalledTimes(1);
      expect(mockLoaderData.getData).toHaveBeenCalledWith({
        url: '/page/123',
        loaderId: 'page',
        params: { id: '123' },
        query: { q: 'search' },
      });
      expect(result).toEqual({ title: 'Home' });
    });

    it('should return RedirectCommand when getData returns redirect', async () => {
      mockLoaderData.getData.mockResolvedValue({
        kind: 'redirect',
        location: '/other',
        status: 302,
      });

      const resolver = loaderResolver('page');
      const route = makeRouteSnapshot();
      const state = makeRouterStateSnapshot('/path');

      const result = await TestBed.runInInjectionContext(async () => {
        return (resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>)(
          route,
          state
        );
      });

      expect(result).toBeInstanceOf(RedirectCommand);
    });

    it('should return RedirectCommand to /500 when getData returns error', async () => {
      mockLoaderData.getData.mockResolvedValue({
        kind: 'error',
        status: 500,
        message: 'Server error',
      });

      const resolver = loaderResolver('page');
      const route = makeRouteSnapshot();
      const state = makeRouterStateSnapshot('/path');

      const result = await TestBed.runInInjectionContext(async () => {
        return (resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>)(
          route,
          state
        );
      });

      expect(result).toBeInstanceOf(RedirectCommand);
      expect((result as RedirectCommand).url.toString()).toBe('/500');
    });

    it('should return RedirectCommand to /404 when getData returns notFound', async () => {
      mockLoaderData.getData.mockResolvedValue({ kind: 'notFound', status: 404 });

      const resolver = loaderResolver('page');
      const route = makeRouteSnapshot();
      const state = makeRouterStateSnapshot('/path');

      const result = await TestBed.runInInjectionContext(async () => {
        return (resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>)(
          route,
          state
        );
      });

      expect(result).toBeInstanceOf(RedirectCommand);
      expect((result as RedirectCommand).url.toString()).toBe('/404');
    });
  });

  describe('server', () => {
    let transferState: TransferState;
    let mockLoader: ReturnType<typeof vi.fn> & LoaderFn;

    beforeEach(() => {
      mockLoader = vi.fn().mockResolvedValue({ server: true, title: 'SSR' }) as ReturnType<
        typeof vi.fn
      > &
        LoaderFn;
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          TransferState,
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: LOADER_REGISTRY, useValue: { page: mockLoader } },
          { provide: LoaderDataService, useValue: { getData: vi.fn() } },
        ],
      });
      transferState = TestBed.inject(TransferState);
    });

    it('should invoke correct loader from registry with url, params, query', async () => {
      const resolver = loaderResolver('page');
      const route = makeRouteSnapshot({
        params: { slug: 'about' },
        queryParams: { lang: 'en' },
      });
      const state = makeRouterStateSnapshot('/about');

      const result = await TestBed.runInInjectionContext(async () => {
        return (resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>)(
          route,
          state
        );
      });

      expect(mockLoader).toHaveBeenCalledTimes(1);
      expect(mockLoader).toHaveBeenCalledWith({
        url: '/about',
        params: { slug: 'about' },
        query: { lang: 'en' },
        requestContext: undefined,
      });
      expect(result).toEqual({ server: true, title: 'SSR' });
    });

    it('should set transfer state with loader result and return data', async () => {
      const resolver = loaderResolver('page');
      const route = makeRouteSnapshot();
      const state = makeRouterStateSnapshot('/page');

      await TestBed.runInInjectionContext(async () => {
        return (resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>)(
          route,
          state
        );
      });

      const key = makeStateKey<unknown>('loader:page:/page');
      expect(transferState.hasKey(key)).toBe(true);
      expect(transferState.get(key, null)).toEqual({ server: true, title: 'SSR' });
    });

    it('should throw when loader id is not in registry', async () => {
      const resolver = loaderResolver('missing' as 'page');
      const route = makeRouteSnapshot();
      const state = makeRouterStateSnapshot('/path');

      await expect(
        TestBed.runInInjectionContext(async () => {
          return (resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>)(
            route,
            state
          );
        })
      ).rejects.toThrow('No loader registered for id "missing"');
    });

    it('should rethrow when loader throws', async () => {
      const loaderError = new Error('Loader failed');
      mockLoader.mockRejectedValueOnce(loaderError);

      const resolver = loaderResolver('page');
      const route = makeRouteSnapshot();
      const state = makeRouterStateSnapshot('/path');

      await expect(
        TestBed.runInInjectionContext(async () => {
          return (resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>)(
            route,
            state
          );
        })
      ).rejects.toThrow('Loader failed');
    });

  });

  describe('server with REQUEST', () => {
    let loaderWithRequest: ReturnType<typeof vi.fn> & LoaderFn;

    beforeEach(() => {
      TestBed.resetTestingModule();
      loaderWithRequest = vi.fn().mockResolvedValue({ server: true }) as ReturnType<typeof vi.fn> &
        LoaderFn;
      const mockRequest = new Request('https://example.com/path?foo=bar', {
        headers: new Headers({ cookie: 'session=abc' }),
      });
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          TransferState,
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: LOADER_REGISTRY, useValue: { page: loaderWithRequest } },
          { provide: LoaderDataService, useValue: { getData: vi.fn() } },
          { provide: REQUEST, useValue: mockRequest },
        ],
      });
    });

    it('should pass requestContext to loader', async () => {
      const resolver = loaderResolver('page');
      const route = makeRouteSnapshot();
      const state = makeRouterStateSnapshot('/path');

      await TestBed.runInInjectionContext(async () => {
        return (resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>)(
          route,
          state
        );
      });

      expect(loaderWithRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/path',
          requestContext: expect.any(Object),
        })
      );
      const call = (loaderWithRequest as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(call.requestContext).toBeDefined();
      expect(call.requestContext?.hostname).toBe('example.com');
      expect(call.requestContext?.query?.foo).toBe('bar');
    });
  });

  describe('resolver metadata', () => {
    it('should tag resolver with LOADER_ID for prefetch discovery', () => {
      const resolver = loaderResolver('page');
      expect(getLoaderId(resolver)).toBe('page');
    });
  });
});
