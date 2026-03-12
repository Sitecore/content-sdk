import { TestBed } from '@angular/core/testing';
import { provideRouter, RedirectCommand, Router } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { handleNavigationError } from './router-error-handling';
import { NotFoundNavigationError, LoaderHttpError } from './models';
import { ERROR_ROUTE_TOKEN, NOT_FOUND_ROUTE_TOKEN } from '../lib/tokens';
import * as sdkCore from '@sitecore-content-sdk/core';

/** Minimal shape of Angular's NavigationError used by the handler */
interface MockNavigationError {
  error?: unknown;
  url?: string;
}

describe('handleNavigationError', () => {
  let router: Router;
  let parseUrlSpy: ReturnType<typeof vi.spyOn>;
  let debugCommonSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    debugCommonSpy = vi.spyOn(sdkCore.debug, 'common').mockImplementation(() => {});
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    router = TestBed.inject(Router);
    parseUrlSpy = vi.spyOn(router, 'parseUrl');
  });

  afterEach(() => {
    debugCommonSpy?.mockRestore();
    parseUrlSpy?.mockRestore();
  });

  function runHandler(navError: MockNavigationError): RedirectCommand | void {
    const handler = handleNavigationError();
    return TestBed.runInInjectionContext(() =>
      handler(navError as import('@angular/router').NavigationError)
    );
  }

  it('should redirect to not found route when processing the not found error', () => {
    const e: MockNavigationError = { error: new NotFoundNavigationError(), url: '/some/page' };
    const result = runHandler(e);

    expect(result).toBeInstanceOf(RedirectCommand);
    expect(parseUrlSpy).toHaveBeenCalledWith('/404');
  });

  it('should redirect to internalServerErrorRoute when processing other exceptions', () => {
    const e: MockNavigationError = { error: new LoaderHttpError(500, 'Server error'), url: '/page' };
    const result = runHandler(e);

    expect(result).toBeInstanceOf(RedirectCommand);
    expect(parseUrlSpy).toHaveBeenCalledWith('/500');
  });

  it('should use custom notFoundRoute when provided', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: NOT_FOUND_ROUTE_TOKEN, useValue: '/custom-404' },
      ],
    });
    router = TestBed.inject(Router);
    parseUrlSpy = vi.spyOn(router, 'parseUrl');
    const e: MockNavigationError = { error: new NotFoundNavigationError() };
    const result = runHandler(e);

    expect(result).toBeInstanceOf(RedirectCommand);
    expect(parseUrlSpy).toHaveBeenCalledWith('/custom-404');
  });

  it('should use custom internalServerErrorRoute when provided', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ERROR_ROUTE_TOKEN, useValue: '/custom-500' },
      ],
    });
    router = TestBed.inject(Router);
    parseUrlSpy = vi.spyOn(router, 'parseUrl');
    const e: MockNavigationError = { error: new Error('Any error') };
    const result = runHandler(e);

    expect(result).toBeInstanceOf(RedirectCommand);
    expect(parseUrlSpy).toHaveBeenCalledWith('/custom-500');
  });

  it('should debug log and return when error route throws error', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ERROR_ROUTE_TOKEN, useValue: '/500' },
      ],
    });
    router = TestBed.inject(Router);
    parseUrlSpy = vi.spyOn(router, 'parseUrl');
    const e: MockNavigationError = { error: new Error('500 loader threw'), url: '/500' };
    const result = runHandler(e);

    expect(result).toBeUndefined();
  });

  it('should debug log and return when error route throws (path without leading slash)', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ERROR_ROUTE_TOKEN, useValue: '/500' },
      ],
    });
    router = TestBed.inject(Router);
    parseUrlSpy = vi.spyOn(router, 'parseUrl');
    const e: MockNavigationError = { error: new Error('Oops'), url: '500' };
    const result = runHandler(e);

    expect(result).toBeUndefined();
  });
});
