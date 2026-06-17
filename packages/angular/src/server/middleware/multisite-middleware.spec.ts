import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SITE_KEY, type SiteInfo } from '@sitecore-content-sdk/content/site';
import { PREVIEW_KEY } from '@sitecore-content-sdk/content/editing';
import { LOADER_DATA_ENDPOINT } from '../constants';
import { SC_PARAMS_HEADER } from '../../loaders/constants';
import { createMultisiteMiddleware, getHostname, type MultisiteMiddlewareOptions } from './multisite-middleware';
import type { CsdkExpressRequest, ExpressResponse } from './models';

const SITES: SiteInfo[] = [
  { hostName: 'a.example.com', language: '', name: 'site-a' },
  { hostName: 'b.example.com', language: '', name: 'site-b' },
];

function createOptions(
  overrides: Partial<MultisiteMiddlewareOptions> = {}
): MultisiteMiddlewareOptions {
  return {
    enabled: true,
    sites: SITES,
    defaultSite: 'site-a',
    ...overrides,
  } as MultisiteMiddlewareOptions;
}

function createReq(overrides: Partial<CsdkExpressRequest> = {}): CsdkExpressRequest {
  return {
    method: 'GET',
    path: '/about',
    url: '/about',
    body: undefined,
    query: {},
    cookies: {},
    headers: { host: 'a.example.com' },
    ...overrides,
  };
}

function createRes() {
  return { cookie: vi.fn(), setHeader: vi.fn() } as unknown as ExpressResponse & {
    cookie: ReturnType<typeof vi.fn>;
  };
}

describe('createMultisiteMiddleware', () => {
  const next = vi.fn();

  beforeEach(() => vi.clearAllMocks());

  it('returns a middleware', () => {
    expect(createMultisiteMiddleware(createOptions({ enabled: false }))).toBeTypeOf('function');
  });

  it('resolves the site from the sc_site query parameter', () => {
    const req = createReq({ query: { [SITE_KEY]: 'site-b' } });
    createMultisiteMiddleware(createOptions())(req, createRes(), next);
    expect(req.scParams?.siteName).toBe('site-b');
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('resolves the site from the cookie when useCookieResolution allows it', () => {
    const req = createReq({ cookies: { [SITE_KEY]: 'site-b' } });
    createMultisiteMiddleware(createOptions({ useCookieResolution: () => true }))(
      req,
      createRes(),
      next
    );
    expect(req.scParams?.siteName).toBe('site-b');
  });

  it('resolves the site from the hostname when no query or cookie is present', () => {
    const req = createReq({ headers: { host: 'b.example.com' } });
    createMultisiteMiddleware(createOptions())(req, createRes(), next);
    expect(req.scParams?.siteName).toBe('site-b');
  });

  it('writes the resolved site to the site cookie', () => {
    const req = createReq({ query: { [SITE_KEY]: 'site-b' } });
    const res = createRes();
    createMultisiteMiddleware(createOptions())(req, res, next);
    expect(res.cookie).toHaveBeenCalledWith(SITE_KEY, 'site-b', expect.any(Object));
  });

  it('skips when disabled', () => {
    const req = createReq({ query: { [SITE_KEY]: 'site-b' } });
    createMultisiteMiddleware(createOptions({ enabled: false }))(req, createRes(), next);
    expect(req.scParams).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('is enabled by default when `enabled` is omitted', () => {
    const req = createReq({ query: { [SITE_KEY]: 'site-b' } });
    const { enabled, ...optionsWithoutEnabled } = createOptions();
    void enabled;
    createMultisiteMiddleware(optionsWithoutEnabled as MultisiteMiddlewareOptions)(
      req,
      createRes(),
      next
    );
    expect(req.scParams?.siteName).toBe('site-b');
  });

  it('skips editing/preview requests', () => {
    const req = createReq({
      query: { [SITE_KEY]: 'site-b' },
      cookies: { [PREVIEW_KEY]: 'true' },
    });
    createMultisiteMiddleware(createOptions())(req, createRes(), next);
    expect(req.scParams).toBeUndefined();
  });

  it('skips api, sitecore and static-file routes', () => {
    for (const path of ['/api/data', '/sitecore/render', '/assets/logo.png']) {
      const req = createReq({ path, url: path, query: { [SITE_KEY]: 'site-b' } });
      createMultisiteMiddleware(createOptions())(req, createRes(), next);
      expect(req.scParams).toBeUndefined();
    }
  });

  it('skips when the custom skip predicate returns true', () => {
    const req = createReq({ query: { [SITE_KEY]: 'site-b' } });
    createMultisiteMiddleware(createOptions({ skip: () => true }))(req, createRes(), next);
    expect(req.scParams).toBeUndefined();
  });

  it('resolves the site from the site query parameter alias', () => {
    const req = createReq({ query: { site: 'site-b' } });
    createMultisiteMiddleware(createOptions())(req, createRes(), next);
    expect(req.scParams?.siteName).toBe('site-b');
  });

  it('falls back to defaultSite when hostname resolves to an empty site name', () => {
    const req = createReq({ headers: { host: 'anything.example.com' } });
    createMultisiteMiddleware(
      createOptions({ sites: [{ hostName: '*', language: '', name: '' }] })
    )(req, createRes(), next);
    expect(req.scParams?.siteName).toBe('site-a');
  });

  it('still calls next when hostname does not match any configured site', () => {
    const req = createReq({ headers: { host: 'unknown.example.com' } });
    createMultisiteMiddleware(createOptions())(req, createRes(), next);
    expect(req.scParams).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('ignores the site cookie when useCookieResolution returns false', () => {
    const req = createReq({ cookies: { [SITE_KEY]: 'site-b' } });
    createMultisiteMiddleware(createOptions({ useCookieResolution: () => false }))(
      req,
      createRes(),
      next
    );
    expect(req.scParams?.siteName).toBe('site-a');
  });

  it('writes resolved scParams to SC_PARAMS_HEADER for SSR handoff', () => {
    const req = createReq({ query: { [SITE_KEY]: 'site-b' } });
    createMultisiteMiddleware(createOptions())(req, createRes(), next);
    expect(req.headers?.[SC_PARAMS_HEADER]).toBe(
      JSON.stringify({ siteName: 'site-b' })
    );
  });

  it('resolves site from /_data loader payload query instead of req.path', () => {
    const req = createReq({
      method: 'POST',
      path: LOADER_DATA_ENDPOINT,
      url: LOADER_DATA_ENDPOINT,
      body: {
        loaderId: 'home',
        url: '/about',
        routeParams: {},
        query: { [SITE_KEY]: 'site-b' },
      },
    });
    createMultisiteMiddleware(createOptions())(req, createRes(), next);
    expect(req.scParams?.siteName).toBe('site-b');
  });

  it('skips paths excluded by a custom matcher', () => {
    const req = createReq({ path: '/health', url: '/health', query: { [SITE_KEY]: 'site-b' } });
    createMultisiteMiddleware(createOptions({ matcher: { excludePaths: ['/health'] } }))(
      req,
      createRes(),
      next
    );
    expect(req.scParams).toBeUndefined();
  });

  it('still resolves the site when response does not support cookies', () => {
    const req = createReq({ query: { [SITE_KEY]: 'site-b' } });
    const res = { setHeader: vi.fn() } as unknown as ExpressResponse;
    createMultisiteMiddleware(createOptions())(req, res, next);
    expect(req.scParams?.siteName).toBe('site-b');
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('logs and calls next when site resolution throws', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const req = createReq({ headers: { host: 'unknown.example.com' } });
    createMultisiteMiddleware(createOptions())(req, createRes(), next);
    expect(req.scParams).toBeUndefined();
    expect(log).toHaveBeenCalledWith('Multisite middleware failed:');
    log.mockRestore();
  });
});

describe('getHostname', () => {
  it('prefers x-forwarded-host over host', () => {
    const req = createReq({
      headers: { 'x-forwarded-host': 'proxy.example.com', host: 'origin.example.com' },
    });
    expect(getHostname(req)).toBe('proxy.example.com');
  });

  it('strips the port from host headers', () => {
    const req = createReq({ headers: { host: 'example.com:8443' } });
    expect(getHostname(req)).toBe('example.com');
  });
});
