import { describe, it, expect } from 'vitest';
import { LOADER_DATA_ENDPOINT } from '../constants';
import { SC_PARAMS_HEADER } from '../../loaders/constants';
import { SITE_KEY } from '@sitecore-content-sdk/content/site';
import type { ExpressRequest } from './models';
import {
  getMiddlewareRequest,
  isDataLoaderRequest,
  parseLoaderRequest,
  shouldProcessPath,
} from './utils';

function createReq(overrides: Partial<ExpressRequest> = {}): ExpressRequest {
  return {
    method: 'GET',
    path: '/about',
    url: '/about',
    body: undefined,
    query: {},
    cookies: {},
    headers: { host: 'example.com' },
    ...overrides,
  };
}

describe('isDataLoaderRequest', () => {
  it('returns true for the default /_data endpoint', () => {
    expect(isDataLoaderRequest(createReq({ path: '/_data' }))).toBe(true);
  });

  it('returns false for regular page routes', () => {
    expect(isDataLoaderRequest(createReq({ path: '/about' }))).toBe(false);
  });

  it('supports a custom data endpoint', () => {
    expect(isDataLoaderRequest(createReq({ path: '/custom-data' }), '/custom-data')).toBe(true);
  });
});

describe('parseLoaderRequest', () => {
  it('parses a POST body into LoaderRunnerInit with server-derived csdkRequestData', () => {
    const req = createReq({
      method: 'POST',
      path: LOADER_DATA_ENDPOINT,
      body: {
        loaderId: 'home',
        url: '/products?color=red',
        routeParams: { id: '1' },
        query: { color: 'red' },
      },
      headers: { host: 'shop.example.com' },
      cookies: { [SITE_KEY]: 'website' },
    });

    const parsed = parseLoaderRequest(req);
    expect(parsed).toMatchObject({
      loaderId: 'home',
      url: '/products?color=red',
      query: { color: 'red' },
    });
    expect('csdkRequestData' in parsed && parsed.csdkRequestData?.hostname).toBe(
      'shop.example.com'
    );
    expect('csdkRequestData' in parsed && parsed.csdkRequestData?.cookies?.[SITE_KEY]).toBe(
      'website'
    );
  });

  it('returns 400 when POST body is missing loaderId', () => {
    expect(parseLoaderRequest(createReq({ method: 'POST', path: '/_data', body: {} }))).toEqual({
      status: 400,
      message: 'Missing loaderId',
    });
  });

  it('parses GET query params into LoaderRunnerInit', () => {
    const parsed = parseLoaderRequest(
      createReq({
        method: 'GET',
        path: '/_data',
        query: { loaderId: 'page', url: '/contact', utm_source: 'email' },
      })
    );

    expect(parsed).toMatchObject({
      loaderId: 'page',
      url: '/contact',
      query: { utm_source: 'email' },
      routeParams: {},
    });
  });

  it('returns 400 when GET query is missing loaderId', () => {
    expect(parseLoaderRequest(createReq({ method: 'GET', path: '/_data', query: {} }))).toEqual({
      status: 400,
      message: 'Missing loaderId',
    });
  });

  it('returns 405 for unsupported methods', () => {
    expect(parseLoaderRequest(createReq({ method: 'PUT', path: '/_data' }))).toEqual({
      status: 405,
      message: 'Method not allowed',
    });
  });
});

describe('getMiddlewareRequest', () => {
  it('returns path and query from a regular page request', () => {
    const req = createReq({
      path: '/about',
      query: { [SITE_KEY]: 'site-b' },
      headers: { host: 'a.example.com' },
    });

    const result = getMiddlewareRequest(req);
    expect(result.path).toBe('/about');
    expect(result.query).toEqual({ [SITE_KEY]: 'site-b' });
    expect(result.data.hostname).toBe('a.example.com');
  });

  it('uses loader payload path and query for /_data POST requests', () => {
    const req = createReq({
      method: 'POST',
      path: '/_data',
      body: {
        loaderId: 'home',
        url: '/products/shoes',
        routeParams: {},
        query: { [SITE_KEY]: 'site-b', page: '2' },
      },
      headers: { host: 'a.example.com', referer: 'https://referrer.example' },
    });

    const result = getMiddlewareRequest(req);
    expect(result.path).toBe('/products/shoes');
    expect(result.query).toEqual({ [SITE_KEY]: 'site-b', page: '2' });
    expect(result.referrer).toBe('https://referrer.example');
    expect(result.data.hostname).toBe('a.example.com');
  });

  it('falls back to req.path when /_data payload cannot be parsed', () => {
    const req = createReq({ method: 'POST', path: '/_data', body: {} });
    const result = getMiddlewareRequest(req);
    expect(result.path).toBe('/_data');
  });

  it('reads scParams from the SC_PARAMS_HEADER when present', () => {
    const req = createReq({
      headers: {
        host: 'example.com',
        [SC_PARAMS_HEADER]: JSON.stringify({ siteName: 'from-header', variantId: '_default' }),
      },
    });

    expect(getMiddlewareRequest(req).data.scParams?.siteName).toBe('from-header');
  });
});

describe('shouldProcessPath', () => {
  describe('default exclusions', () => {
    it('processes a normal layout route', () => {
      expect(shouldProcessPath('/about')).toBe(true);
      expect(shouldProcessPath('/products/shoes')).toBe(true);
      expect(shouldProcessPath('/')).toBe(true);
    });

    it('skips API routes', () => {
      expect(shouldProcessPath('/api')).toBe(false);
      expect(shouldProcessPath('/api/data')).toBe(false);
    });

    it('skips Sitecore routes', () => {
      expect(shouldProcessPath('/sitecore/render')).toBe(false);
    });

    it('skips static files (final segment has an extension)', () => {
      // Regression guard: the personalize middleware must not run on asset requests.
      expect(shouldProcessPath('/assets/logo.png')).toBe(false);
      expect(shouldProcessPath('/styles.css')).toBe(false);
      expect(shouldProcessPath('/favicon.ico')).toBe(false);
    });

    it('does not over-match: /api-docs is a real route, not an API path', () => {
      expect(shouldProcessPath('/api-docs')).toBe(true);
    });
  });

  describe('custom excludePaths', () => {
    it('skips an exact string match', () => {
      expect(shouldProcessPath('/health', { excludePaths: ['/health'] })).toBe(false);
      expect(shouldProcessPath('/about', { excludePaths: ['/health'] })).toBe(true);
    });

    it('skips a regex match', () => {
      expect(shouldProcessPath('/legal/terms', { excludePaths: [/^\/legal\//] })).toBe(false);
    });
  });

  describe('custom includePaths', () => {
    it('processes only paths that match an include pattern', () => {
      expect(shouldProcessPath('/about', { includePaths: ['/about'] })).toBe(true);
      expect(shouldProcessPath('/contact', { includePaths: ['/about'] })).toBe(false);
    });

    it('supports regex include patterns', () => {
      const matcher = { includePaths: [/^\/products\//] };
      expect(shouldProcessPath('/products/shoes', matcher)).toBe(true);
      expect(shouldProcessPath('/about', matcher)).toBe(false);
    });
  });

  describe('precedence', () => {
    it('excludePaths wins over includePaths', () => {
      expect(
        shouldProcessPath('/about', { includePaths: ['/about'], excludePaths: ['/about'] })
      ).toBe(false);
    });

    it('default exclusions win over includePaths', () => {
      // A consumer cannot re-include a default-excluded path; documented limitation.
      expect(shouldProcessPath('/api/preview', { includePaths: [/^\/api\//] })).toBe(false);
    });
  });
});
