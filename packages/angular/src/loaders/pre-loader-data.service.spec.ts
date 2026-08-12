/* eslint-disable jsdoc/require-jsdoc */
import { TestBed } from '@angular/core/testing';
import { Component, PLATFORM_ID } from '@angular/core';
import { provideRouter, Router, type Routes } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ClientPreLoaderDataService } from './pre-loader-data.service';
import { ClientLoaderDataService } from './client-loader-data.service';
import { LOADER_ID } from './loader-registry.token';
import { SITECORE_CONFIG_TOKEN } from '../lib/tokens';

@Component({ template: '' })
class TestComponent {}

function makeResolverWithLoaderId(loaderId: string): (() => void) & { [LOADER_ID]: string } {
  const fn = () => {};
  (fn as unknown as Record<symbol, string>)[LOADER_ID] = loaderId;
  return fn as (() => void) & { [LOADER_ID]: string };
}

type MutableSnapshot = ActivatedRouteSnapshot & { pathFromRoot: ActivatedRouteSnapshot[] };

function makeRouteSnapshot(overrides: {
  pathFromRoot: ActivatedRouteSnapshot[];
  routeConfig?: { resolve?: Record<string, (() => void) & { [LOADER_ID]: string }> };
  params?: Record<string, string>;
  queryParams?: Record<string, string | string[]>;
  children?: ActivatedRouteSnapshot[];
}): MutableSnapshot {
  return {
    params: overrides.params ?? {},
    queryParams: overrides.queryParams ?? {},
    pathFromRoot: overrides.pathFromRoot,
    routeConfig: overrides.routeConfig,
    children: overrides.children ?? [],
  } as MutableSnapshot;
}

function makeRouterStateSnapshot(url: string): RouterStateSnapshot {
  return { url } as RouterStateSnapshot;
}

describe('ClientPreLoaderDataService', () => {
  let loaderDataPrefetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    loaderDataPrefetchSpy = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        ClientPreLoaderDataService,
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: ClientLoaderDataService,
          useValue: { prefetch: loaderDataPrefetchSpy },
        },
      ],
    });
  });

  describe('prefetchForRoute', () => {
    it('should prefetch for current active route and its parents (pathFromRoot)', async () => {
      const layoutResolver = makeResolverWithLoaderId('layout');
      const pageResolver = makeResolverWithLoaderId('page');

      const root = makeRouteSnapshot({
        pathFromRoot: [] as ActivatedRouteSnapshot[],
        routeConfig: { resolve: { layout: layoutResolver } },
        params: {},
      });
      (root as MutableSnapshot).pathFromRoot = [root];

      const child = makeRouteSnapshot({
        pathFromRoot: [root],
        routeConfig: { resolve: { page: pageResolver } },
        params: { id: '123' },
        queryParams: { q: 'search' },
      });
      (child as MutableSnapshot).pathFromRoot = [root, child];

      const state = makeRouterStateSnapshot('/page/123');
      const service = TestBed.inject(ClientPreLoaderDataService);

      await service.prefetchForRoute(child as ActivatedRouteSnapshot, state);

      expect(loaderDataPrefetchSpy).toHaveBeenCalledTimes(2);
      expect(loaderDataPrefetchSpy).toHaveBeenCalledWith({
        loaderId: 'layout',
        url: '/page/123',
        routeParams: {},
        query: {},
      });
      expect(loaderDataPrefetchSpy).toHaveBeenCalledWith({
        loaderId: 'page',
        url: '/page/123',
        routeParams: { id: '123' },
        query: { q: 'search' },
      });
    });

    it('should prefetch only for routes that have resolver with LOADER_ID', async () => {
      const pageResolver = makeResolverWithLoaderId('page');
      const root = makeRouteSnapshot({
        pathFromRoot: [] as ActivatedRouteSnapshot[],
        routeConfig: undefined,
        params: {},
      });
      (root as MutableSnapshot).pathFromRoot = [root];

      const child = makeRouteSnapshot({
        pathFromRoot: [root],
        routeConfig: { resolve: { page: pageResolver } },
        params: {},
      });
      (child as MutableSnapshot).pathFromRoot = [root, child];

      const state = makeRouterStateSnapshot('/page');
      const service = TestBed.inject(ClientPreLoaderDataService);

      await service.prefetchForRoute(child as ActivatedRouteSnapshot, state);

      expect(loaderDataPrefetchSpy).toHaveBeenCalledTimes(1);
      expect(loaderDataPrefetchSpy).toHaveBeenCalledWith({
        loaderId: 'page',
        url: '/page',
        routeParams: {},
        query: {},
      });
    });

    it('should no-op on server', async () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ClientPreLoaderDataService,
          provideRouter([]),
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: ClientLoaderDataService, useValue: { prefetch: loaderDataPrefetchSpy } },
        ],
      });
      const root = makeRouteSnapshot({
        pathFromRoot: [] as ActivatedRouteSnapshot[],
        routeConfig: { resolve: { layout: makeResolverWithLoaderId('layout') } },
        params: {},
      });
      (root as MutableSnapshot).pathFromRoot = [root];
      const state = makeRouterStateSnapshot('/');
      const service = TestBed.inject(ClientPreLoaderDataService);

      await service.prefetchForRoute(root as ActivatedRouteSnapshot, state);

      expect(loaderDataPrefetchSpy).not.toHaveBeenCalled();
    });
  });

  describe('prefetchForUrl', () => {
    function configureWithRoutes(routes: Routes, defaultLanguage?: string) {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ClientPreLoaderDataService,
          provideRouter(routes),
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: ClientLoaderDataService, useValue: { prefetch: loaderDataPrefetchSpy } },
          ...(defaultLanguage
            ? [{ provide: SITECORE_CONFIG_TOKEN, useValue: { defaultLanguage } }]
            : []),
        ],
      });
    }

    it('discovers loaders across parent + child route levels for a matched URL', () => {
      const routes: Routes = [
        {
          path: 'section/:id',
          resolve: { layout: makeResolverWithLoaderId('layout') },
          children: [
            {
              path: 'page',
              component: TestComponent,
              resolve: { page: makeResolverWithLoaderId('page') },
            },
          ],
        },
      ];
      configureWithRoutes(routes);
      const service = TestBed.inject(ClientPreLoaderDataService);

      service.prefetchForUrl('/section/33/page');

      expect(loaderDataPrefetchSpy).toHaveBeenCalledTimes(2);
      expect(loaderDataPrefetchSpy).toHaveBeenCalledWith(
        {
          loaderId: 'layout',
          url: '/section/33/page',
          routeParams: { id: '33' },
          query: {},
        },
        undefined
      );
      expect(loaderDataPrefetchSpy).toHaveBeenCalledWith(
        {
          loaderId: 'page',
          url: '/section/33/page',
          routeParams: { id: '33' },
          query: {},
        },
        undefined
      );
    });

    it('forwards { force: true } to ClientLoaderDataService.prefetch for every discovered loader', () => {
      const routes: Routes = [
        { path: 'about', component: TestComponent, resolve: { page: makeResolverWithLoaderId('page') } },
      ];
      configureWithRoutes(routes);
      const service = TestBed.inject(ClientPreLoaderDataService);

      service.prefetchForUrl('/about', { force: true });

      expect(loaderDataPrefetchSpy).toHaveBeenCalledWith(
        { loaderId: 'page', url: '/about', routeParams: {}, query: {} },
        { force: true }
      );
    });

    it('scopes routeParams per level — a parent-level loader does not see child-only params', () => {
      const routes: Routes = [
        {
          path: 'section',
          resolve: { layout: makeResolverWithLoaderId('layout') },
          children: [
            {
              path: 'page/:id',
              component: TestComponent,
              resolve: { page: makeResolverWithLoaderId('page') },
            },
          ],
        },
      ];
      configureWithRoutes(routes);
      const service = TestBed.inject(ClientPreLoaderDataService);

      service.prefetchForUrl('/section/page/33');

      expect(loaderDataPrefetchSpy).toHaveBeenCalledWith(
        {
          loaderId: 'layout',
          url: '/section/page/33',
          routeParams: {},
          query: {},
        },
        undefined
      );
      expect(loaderDataPrefetchSpy).toHaveBeenCalledWith(
        {
          loaderId: 'page',
          url: '/section/page/33',
          routeParams: { id: '33' },
          query: {},
        },
        undefined
      );
    });

    it('defaults locale from config.defaultLanguage when unmatched', () => {
      const routes: Routes = [
        { path: 'about', component: TestComponent, resolve: { page: makeResolverWithLoaderId('page') } },
      ];
      configureWithRoutes(routes, 'en');
      const service = TestBed.inject(ClientPreLoaderDataService);

      service.prefetchForUrl('/about');

      expect(loaderDataPrefetchSpy).toHaveBeenCalledWith(
        {
          loaderId: 'page',
          url: '/about',
          routeParams: { locale: 'en' },
          query: {},
        },
        undefined
      );
    });

    it('no-ops when the URL matches no route', () => {
      const routes: Routes = [
        { path: 'about', component: TestComponent, resolve: { page: makeResolverWithLoaderId('page') } },
      ];
      configureWithRoutes(routes);
      const service = TestBed.inject(ClientPreLoaderDataService);

      service.prefetchForUrl('/does-not-exist');

      expect(loaderDataPrefetchSpy).not.toHaveBeenCalled();
    });

    it('does not throw and no-ops when Router.parseUrl throws (e.g. malformed percent-encoding)', () => {
      const routes: Routes = [
        { path: 'about', component: TestComponent, resolve: { page: makeResolverWithLoaderId('page') } },
      ];
      configureWithRoutes(routes);
      const service = TestBed.inject(ClientPreLoaderDataService);
      const router = TestBed.inject(Router);
      vi.spyOn(router, 'parseUrl').mockImplementation(() => {
        throw new URIError('URI malformed');
      });

      expect(() => service.prefetchForUrl('/about?bad=%')).not.toThrow();
      expect(loaderDataPrefetchSpy).not.toHaveBeenCalled();
    });

    it('no-ops when the matched route has no loaders', () => {
      const routes: Routes = [{ path: 'about', component: TestComponent }];
      configureWithRoutes(routes);
      const service = TestBed.inject(ClientPreLoaderDataService);

      service.prefetchForUrl('/about');

      expect(loaderDataPrefetchSpy).not.toHaveBeenCalled();
    });

    it('no-ops on server', () => {
      const routes: Routes = [
        { path: 'about', component: TestComponent, resolve: { page: makeResolverWithLoaderId('page') } },
      ];
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ClientPreLoaderDataService,
          provideRouter(routes),
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: ClientLoaderDataService, useValue: { prefetch: loaderDataPrefetchSpy } },
        ],
      });
      const service = TestBed.inject(ClientPreLoaderDataService);

      service.prefetchForUrl('/about');

      expect(loaderDataPrefetchSpy).not.toHaveBeenCalled();
    });
  });
});
