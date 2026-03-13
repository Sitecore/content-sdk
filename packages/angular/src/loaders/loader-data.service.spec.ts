import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LoaderDataService } from './loader-data.service';
import { FETCH_DATA_ENDPOINT } from './loader-registry.token';
import { LOADER_DATA_ENDPOINT } from '../server/constants';
import * as sdkCore from '@sitecore-content-sdk/core';

describe('LoaderDataService', () => {
  let service: LoaderDataService;
  let httpController: HttpTestingController;
  let debugCommonSpy: ReturnType<typeof vi.spyOn>;

  function setupTestBed(
    overrides: {
      platformId?: object | string;
      fetchDataEndpoint?: string | null;
    } = {}
  ) {
    const platformId = overrides.platformId ?? 'browser';
    TestBed.configureTestingModule({
      providers: [
        LoaderDataService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: platformId },
        ...(overrides.fetchDataEndpoint !== undefined
          ? [{ provide: FETCH_DATA_ENDPOINT, useValue: overrides.fetchDataEndpoint }]
          : []),
      ],
    });
    service = TestBed.inject(LoaderDataService);
    httpController = TestBed.inject(HttpTestingController);
  }

  beforeEach(() => {
    debugCommonSpy = vi.spyOn(sdkCore.debug, 'common').mockImplementation(() => {});
  });

  afterEach(() => {
    debugCommonSpy?.mockRestore();
    httpController?.verify();
  });

  describe('getData', () => {
    it('should make new data request when no pending requests and data not in cache', async () => {
      setupTestBed();
      const request = { url: '/test', loaderId: 'page' };
      const resultPromise = service.getData(request);

      const req = httpController.expectOne(LOADER_DATA_ENDPOINT);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        loaderId: 'page',
        url: '/test',
        params: {},
        query: {},
      });
      req.flush({ kind: 'data', data: { title: 'Hello' } });

      const result = await resultPromise;
      expect(result).toEqual({ kind: 'data', data: { title: 'Hello' } });
    });

    it('should return pending request if request for data is already pending', async () => {
      setupTestBed();
      const request = { url: '/pending', loaderId: 'page' };
      const promise1 = service.getData(request);
      const promise2 = service.getData(request);

      const req = httpController.expectOne(LOADER_DATA_ENDPOINT);
      req.flush({ kind: 'data', data: { shared: true } });

      const [r1, r2] = await Promise.all([promise1, promise2]);
      expect(r1).toEqual({ kind: 'data', data: { shared: true } });
      expect(r2).toEqual({ kind: 'data', data: { shared: true } });
    });

    it('should return error when requested in server context (not browser)', async () => {
      setupTestBed({ platformId: 'server' });
      const result = await service.getData({ url: '/any', loaderId: 'page' });
      expect(result).toEqual({
        kind: 'error',
        status: 500,
        message: 'LoaderDataService only works in browser',
      });
      httpController.expectNone(LOADER_DATA_ENDPOINT);
    });
  });

  describe('prefetch', () => {
    it('should populate cache without consuming so getData can read it without a new request', async () => {
      setupTestBed();
      const request = { url: '/prefetched', loaderId: 'page' };
      service.prefetch(request);
      const req = httpController.expectOne(LOADER_DATA_ENDPOINT);
      req.flush({ kind: 'data', data: { prefetched: true } });
      await new Promise((r) => setTimeout(r, 0));

      const result = await service.getData(request);
      expect(result).toEqual({ kind: 'data', data: { prefetched: true } });
      httpController.expectNone(LOADER_DATA_ENDPOINT);
    });

    it('should no-op on server', () => {
      setupTestBed({ platformId: 'server' });
      service.prefetch({ url: '/any', loaderId: 'page' });
      httpController.expectNone(LOADER_DATA_ENDPOINT);
    });

    it('should not make a new request when cache is already populated', async () => {
      setupTestBed();
      const request = { url: '/cached', loaderId: 'page' };
      service.prefetch(request);
      const req = httpController.expectOne(LOADER_DATA_ENDPOINT);
      req.flush({ kind: 'data', data: { cached: true } });
      await new Promise((r) => setTimeout(r, 0));

      service.prefetch(request);
      httpController.expectNone(LOADER_DATA_ENDPOINT);
    });

    it('should not start a second request when one is already pending', () => {
      setupTestBed();
      const request = { url: '/pending', loaderId: 'page' };
      service.prefetch(request);
      service.prefetch(request);

      const req = httpController.expectOne(LOADER_DATA_ENDPOINT);
      req.flush({ kind: 'data', data: { pending: true } });
    });
  });

  describe('fetchData (via getData)', () => {
    it('should use custom data endpoint when provided in DI', async () => {
      const customEndpoint = '/api/loader-data';
      setupTestBed({ fetchDataEndpoint: customEndpoint });
      const resultPromise = service.getData({ url: '/test', loaderId: 'page' });

      const req = httpController.expectOne(customEndpoint);
      expect(req.request.method).toBe('POST');
      req.flush({ kind: 'data', data: {} });

      await resultPromise;
    });

    it('should use default data endpoint when fetchDataEndpoint not provided in DI', async () => {
      setupTestBed();
      const resultPromise = service.getData({ url: '/test', loaderId: 'page' });

      const req = httpController.expectOne(LOADER_DATA_ENDPOINT);
      req.flush({ kind: 'data', data: {} });
      await resultPromise;
    });

    it('should use default data endpoint when fetchDataEndpoint is null in DI', async () => {
      setupTestBed({ fetchDataEndpoint: null });
      const resultPromise = service.getData({ url: '/test', loaderId: 'page' });

      const req = httpController.expectOne(LOADER_DATA_ENDPOINT);
      req.flush({ kind: 'data', data: {} });
      await resultPromise;
    });

    it('should return error when fetch promise fails', async () => {
      setupTestBed();
      const resultPromise = service.getData({ url: '/fail', loaderId: 'page' });

      const req = httpController.expectOne(LOADER_DATA_ENDPOINT);
      req.error(new ProgressEvent('error'));

      const result = await resultPromise;
      expect(result.kind).toBe('error');
      expect((result as { message: string }).message).toBe('Fetch failed');
    });

    it('should add pending request', async () => {
      setupTestBed();
      const promise1 = service.getData({ url: '/same', loaderId: 'page' });
      const promise2 = service.getData({ url: '/same', loaderId: 'page' });

      const req = httpController.expectOne(LOADER_DATA_ENDPOINT);
      req.flush({ kind: 'data', data: { one: 1 } });

      const [a, b] = await Promise.all([promise1, promise2]);
      expect(a).toEqual(b);
      expect((a as { kind: string; data?: unknown }).data).toEqual({ one: 1 });
    });
  });

  describe('fetchData error response (no response body)', () => {
    it('should return error with endpoint in message when response is falsy', async () => {
      setupTestBed();
      const resultPromise = service.getData({ url: '/empty', loaderId: 'page' });

      const req = httpController.expectOne(LOADER_DATA_ENDPOINT);
      req.flush(null);

      const result = await resultPromise;
      expect(result.kind).toBe('error');
      expect((result as { message: string }).message).toBe(
        `No response from ${LOADER_DATA_ENDPOINT}`
      );
    });

    it('should return error with custom endpoint in message when custom endpoint and falsy response', async () => {
      const customEndpoint = '/custom/data';
      setupTestBed({ fetchDataEndpoint: customEndpoint });
      const resultPromise = service.getData({ url: '/empty', loaderId: 'page' });

      const req = httpController.expectOne(customEndpoint);
      req.flush(null);

      const result = await resultPromise;
      expect(result.kind).toBe('error');
      expect((result as { message: string }).message).toBe(`No response from ${customEndpoint}`);
    });
  });
});
