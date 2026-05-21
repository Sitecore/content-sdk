/* eslint-disable jsdoc/require-jsdoc */
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID, REQUEST, TransferState, makeStateKey } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, RedirectCommand, Router } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loaderResolver } from './loader-resolver';
import { LOADER_ID, LOADER_REGISTRY } from './loader-registry.token';
import { LoaderDataService } from './loader-data.service';
import { LOADER_DATA_ENDPOINT } from '../server/constants';
import type { LoaderFn } from './models';
import type { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SITECORE_CONFIG_TOKEN } from '../lib/tokens';
import type { AngularSitecoreConfig } from '../config/define-config';

function makeRouteSnapshot(
  overrides: Partial<{
    params: Record<string, string>;
    queryParams: Record<string, string | string[]>;
    pathFromRoot: Array<{ params: Record<string, string> }>;
  }> = {}
): ActivatedRouteSnapshot {
  return {
    params: overrides.params ?? {},
    queryParams: overrides.queryParams ?? {},
    pathFromRoot: overrides.pathFromRoot ?? [{ params: {} }],
  } as ActivatedRouteSnapshot;
}

function makeRouterStateSnapshot(url: string): RouterStateSnapshot {
  return { url } as RouterStateSnapshot;
}

describe('loaderResolver', () => {
  describe('browser', () => {
    let mockLoaderData: { getData: ReturnType<typeof vi.fn> };
    let transferState: TransferState;
    let parseUrlSpy: ReturnType<typeof vi.spyOn>;

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
      const router = TestBed.inject(Router);
      parseUrlSpy = vi.spyOn(router, 'parseUrl');
    });

    it('should return data from transfer state when key exists', async () => {
      const resolver = loaderResolver('page');
      const key = makeStateKey<unknown>('loader:page:/path');
      transferState.set(key, { fromTransfer: true });

      const route = makeRouteSnapshot();
      const state = makeRouterStateSnapshot('/path');
      const result = await TestBed.runInInjectionContext(async () => {
        return (
          resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>
        )(route, state);
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
        return (
          resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>
        )(route, state);
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
        redirect: { loaderRedirectTarget: '/other' },
      });

      const resolver = loaderResolver('page');
      const route = makeRouteSnapshot();
      const state = makeRouterStateSnapshot('/path');

      const result = await TestBed.runInInjectionContext(async () => {
        return (
          resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>
        )(route, state);
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
        return (
          resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>
        )(route, state);
      });

      expect(result).toBeInstanceOf(RedirectCommand);
      expect(parseUrlSpy).toHaveBeenCalledWith('/500');
    });

    it('should return RedirectCommand to /404 when getData returns notFound', async () => {
      mockLoaderData.getData.mockResolvedValue({ kind: 'notFound', status: 404 });

      const resolver = loaderResolver('page');
      const route = makeRouteSnapshot();
      const state = makeRouterStateSnapshot('/path');

      const result = await TestBed.runInInjectionContext(async () => {
        return (
          resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>
        )(route, state);
      });

      expect(result).toBeInstanceOf(RedirectCommand);
      expect(parseUrlSpy).toHaveBeenCalledWith('/404');
    });
  });

  describe('browser with real LoaderDataService (pending handling)', () => {
    let httpController: HttpTestingController;

    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          provideHttpClient(),
          provideHttpClientTesting(),
          TransferState,
          LoaderDataService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: LOADER_REGISTRY, useValue: { page: (async () => ({})) as LoaderFn } },
        ],
      });
      httpController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpController.verify();
    });

    it('should set pending promise when getData starts a fetch (concurrent resolver calls result in one HTTP request)', async () => {
      const resolver = loaderResolver('page');
      const route = makeRouteSnapshot({ pathFromRoot: [{ params: {} }] });
      const state = makeRouterStateSnapshot('/same-url');

      const promise1 = TestBed.runInInjectionContext(async () => {
        return (
          resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>
        )(route, state);
      });
      const promise2 = TestBed.runInInjectionContext(async () => {
        return (
          resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>
        )(route, state);
      });

      const req = httpController.expectOne(LOADER_DATA_ENDPOINT);
      expect(req.request.method).toBe('POST');
      req.flush({ kind: 'data', data: { shared: true } });

      const [result1, result2] = await Promise.all([promise1, promise2]);
      expect(result1).toEqual({ shared: true });
      expect(result2).toEqual({ shared: true });
    });

    it('should return pending promise if present instead of launching a new request', async () => {
      const resolver = loaderResolver('page');
      const route = makeRouteSnapshot({ pathFromRoot: [{ params: {} }] });
      const state = makeRouterStateSnapshot('/pending-return');

      const promise1 = TestBed.runInInjectionContext(async () => {
        return (
          resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>
        )(route, state);
      });
      const promise2 = TestBed.runInInjectionContext(async () => {
        return (
          resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>
        )(route, state);
      });

      const req = httpController.expectOne(LOADER_DATA_ENDPOINT);
      req.flush({ kind: 'data', data: { single: true } });

      const [r1, r2] = await Promise.all([promise1, promise2]);
      expect(r1).toEqual({ single: true });
      expect(r2).toEqual({ single: true });
      httpController.expectNone(LOADER_DATA_ENDPOINT);
    });

    it('should remove pending promise when fetch settles so a later call triggers a new request', async () => {
      const loaderData = TestBed.inject(LoaderDataService);
      const resolver = loaderResolver('page');
      const route = makeRouteSnapshot({ pathFromRoot: [{ params: {} }] });
      const state = makeRouterStateSnapshot('/after-settle');

      loaderData.prefetch({ loaderId: 'page', url: '/after-settle' });
      const req0 = httpController.expectOne(LOADER_DATA_ENDPOINT);
      req0.flush({ kind: 'data', data: { prefetched: true } });
      await new Promise((r) => setTimeout(r, 0));

      const result1 = await TestBed.runInInjectionContext(async () => {
        return (
          resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>
        )(route, state);
      });
      expect(result1).toEqual({ prefetched: true });
      httpController.expectNone(LOADER_DATA_ENDPOINT);

      const promise2 = TestBed.runInInjectionContext(async () => {
        return (
          resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>
        )(route, state);
      });
      const req2 = httpController.expectOne(LOADER_DATA_ENDPOINT);
      req2.flush({ kind: 'data', data: { second: true } });
      expect(await promise2).toEqual({ second: true });
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
        pathFromRoot: [{ params: {} }, { params: { slug: 'about' } }],
      });
      const state = makeRouterStateSnapshot('/about');

      const result = await TestBed.runInInjectionContext(async () => {
        return (
          resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>
        )(route, state);
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
        return (
          resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>
        )(route, state);
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
          return (
            resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>
          )(route, state);
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
          return (
            resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>
          )(route, state);
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
        return (
          resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>
        )(route, state);
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
      const resolver = loaderResolver('page') as unknown as Record<symbol, string>;
      expect(resolver[LOADER_ID]).toBe('page');
    });
  });

  describe('locale plumbing into loader params', () => {
    let mockLoader: ReturnType<typeof vi.fn> & LoaderFn;

    beforeEach(() => {
      TestBed.resetTestingModule();
      mockLoader = vi.fn().mockResolvedValue({ ok: true }) as ReturnType<typeof vi.fn> & LoaderFn;
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          TransferState,
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: LOADER_REGISTRY, useValue: { page: mockLoader } },
          { provide: LoaderDataService, useValue: { getData: vi.fn() } },
          {
            provide: SITECORE_CONFIG_TOKEN,
            useValue: {
              defaultLanguage: 'en',
              angular: { locales: ['en', 'de'] },
            } as AngularSitecoreConfig,
          },
        ],
      });
    });

    it('should pass the matched locale from route params to the loader', async () => {
      const resolver = loaderResolver('page');
      const route = makeRouteSnapshot({
        pathFromRoot: [{ params: { locale: 'de' } }, { params: {} }],
      });
      const state = makeRouterStateSnapshot('/de/about');

      await TestBed.runInInjectionContext(async () => {
        return (
          resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>
        )(route, state);
      });

      expect(mockLoader).toHaveBeenCalledWith(
        expect.objectContaining({ params: expect.objectContaining({ locale: 'de' }) })
      );
    });

    it('should default params.locale to defaultLanguage when no locale segment was matched', async () => {
      const resolver = loaderResolver('page');
      const route = makeRouteSnapshot({ pathFromRoot: [{ params: {} }] });
      const state = makeRouterStateSnapshot('/about');

      await TestBed.runInInjectionContext(async () => {
        return (
          resolver as (r: ActivatedRouteSnapshot, s: RouterStateSnapshot) => Promise<unknown>
        )(route, state);
      });

      expect(mockLoader).toHaveBeenCalledWith(
        expect.objectContaining({ params: expect.objectContaining({ locale: 'en' }) })
      );
    });
  });
});
