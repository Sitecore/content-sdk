import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import {
  RedirectInfo,
  RedirectsService,
  REDIRECT_TYPE_301,
  REDIRECT_TYPE_302,
  REDIRECT_TYPE_SERVER_TRANSFER,
  type SiteInfo,
} from '@sitecore-content-sdk/content/site';
import { EDITING_PARAMS_HEADER } from '../../editing/constants';
import { LOADER_DATA_ENDPOINT } from '../constants';
import { createRedirectsMiddleware, type RedirectsMiddlewareOptions } from './redirects-middleware';
import type { CsdkExpressRequest, ExpressResponse } from './models';

const SITES: SiteInfo[] = [{ hostName: '*', language: 'en', name: 'site-a' }];

function createService(redirects: RedirectInfo[]): RedirectsService {
  return {
    fetchRedirects: vi.fn().mockResolvedValue(redirects),
  } as unknown as RedirectsService;
}

function createOptions(
  overrides: Partial<RedirectsMiddlewareOptions> = {}
): RedirectsMiddlewareOptions {
  return {
    enabled: true,
    locales: ['en'],
    defaultLanguage: 'en',
    defaultSite: 'site-a',
    sites: SITES,
    redirectsService: createService([]),
    ...overrides,
  } as RedirectsMiddlewareOptions;
}

function createReq(overrides: Partial<CsdkExpressRequest> = {}): CsdkExpressRequest {
  return {
    method: 'GET',
    path: '/',
    url: '/',
    body: undefined,
    query: {},
    cookies: {},
    headers: { host: 'a.example.com' },
    scParams: { siteName: 'site-a' },
    ...overrides,
  };
}

function createRes() {
  return {
    redirect: vi.fn(),
    setHeader: vi.fn(),
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as ExpressResponse & { redirect: Mock; setHeader: Mock };
}

const redirect = (overrides: Partial<RedirectInfo>): RedirectInfo => ({
  pattern: '',
  target: '',
  redirectType: REDIRECT_TYPE_301,
  isQueryStringPreserved: false,
  locale: '',
  ...overrides,
});

describe('createRedirectsMiddleware', () => {
  const next = vi.fn();
  beforeEach(() => vi.clearAllMocks());

  it('returns a middleware', () => {
    expect(createRedirectsMiddleware(createOptions())).toBeTypeOf('function');
  });

  it('matches a locale-versioned redirect item and issues a 301', async () => {
    const req = createReq({ path: '/en/old', url: '/en/old' });
    const res = createRes();
    const options = createOptions({
      redirectsService: createService([
        redirect({ locale: 'en', pattern: '/old', target: '/new' }),
      ]),
    });
    await createRedirectsMiddleware(options)(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith(301, '/new');
    expect(next).not.toHaveBeenCalled();
  });

  it('preserves the request locale on relative targets when isLanguagePreserved', async () => {
    const req = createReq({ path: '/en/old', url: '/en/old' });
    const res = createRes();
    const options = createOptions({
      redirectsService: createService([
        redirect({ locale: 'en', pattern: '/old', target: '/new', isLanguagePreserved: true }),
      ]),
    });
    await createRedirectsMiddleware(options)(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith(301, '/en/new');
  });

  it('keeps a locale-less URL locale-less when the target resolves to the same locale', async () => {
    const req = createReq({ path: '/old', url: '/old' });
    const res = createRes();
    const options = createOptions({
      redirectsService: createService([
        redirect({ pattern: '/old', target: '/new', isLanguagePreserved: true }),
      ]),
    });
    await createRedirectsMiddleware(options)(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith(301, '/new');
  });

  it('adds the target locale when it differs from a locale-less origin', async () => {
    const req = createReq({ path: '/old', url: '/old' });
    const res = createRes();
    const options = createOptions({
      locales: ['en', 'fr'],
      redirectsService: createService([redirect({ pattern: '/old', target: '/fr/new' })]),
    });
    await createRedirectsMiddleware(options)(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith(301, '/fr/new');
  });

  it('matches a static redirect-map rule and issues a 302', async () => {
    const req = createReq({ path: '/about-us', url: '/about-us' });
    const res = createRes();
    const options = createOptions({
      redirectsService: createService([
        redirect({ pattern: '/about-us', target: '/about', redirectType: REDIRECT_TYPE_302 }),
      ]),
    });
    await createRedirectsMiddleware(options)(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith(302, '/about');
  });

  it('matches a regex rule and applies capture-group substitution', async () => {
    const req = createReq({ path: '/products/shoes', url: '/products/shoes' });
    const res = createRes();
    const options = createOptions({
      redirectsService: createService([
        redirect({ pattern: '/products/(.*)', target: '/shop/$1' }),
      ]),
    });
    await createRedirectsMiddleware(options)(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith(301, '/shop/shoes');
  });

  it('substitutes the $siteLang token from the resolved site language', async () => {
    // Locale-prefixed origin so the injected locale is preserved on the target.
    const req = createReq({ path: '/en/home', url: '/en/home' });
    const res = createRes();
    const options = createOptions({
      redirectsService: createService([
        redirect({ pattern: '/home', target: '/$siteLang/welcome' }),
      ]),
    });
    await createRedirectsMiddleware(options)(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith(301, '/en/welcome');
  });

  it('preserves the query string on relative targets when isQueryStringPreserved', async () => {
    const req = createReq({ path: '/search', url: '/search?q=shoes', query: { q: 'shoes' } });
    const res = createRes();
    const options = createOptions({
      redirectsService: createService([
        redirect({
          pattern: '/search',
          target: '/results',
          redirectType: REDIRECT_TYPE_302,
          isQueryStringPreserved: true,
        }),
      ]),
    });
    await createRedirectsMiddleware(options)(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith(302, '/results?q=shoes');
  });

  it('redirects to an absolute external target without locale stripping', async () => {
    const req = createReq({ path: '/ext', url: '/ext' });
    const res = createRes();
    const options = createOptions({
      redirectsService: createService([
        redirect({ pattern: '/ext', target: 'https://example.org/page' }),
      ]),
    });
    await createRedirectsMiddleware(options)(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith(301, 'https://example.org/page');
  });

  it('merges the query string into an absolute target when isQueryStringPreserved', async () => {
    const req = createReq({ path: '/ext', url: '/ext?a=1', query: { a: '1' } });
    const res = createRes();
    const options = createOptions({
      redirectsService: createService([
        redirect({
          pattern: '/ext',
          target: 'https://example.org/page',
          isQueryStringPreserved: true,
        }),
      ]),
    });
    await createRedirectsMiddleware(options)(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith(301, 'https://example.org/page?a=1');
  });

  it('performs an internal rewrite (no browser redirect) for SERVER_TRANSFER', async () => {
    const req = createReq({ path: '/legacy', url: '/legacy' });
    const res = createRes();
    const options = createOptions({
      redirectsService: createService([
        redirect({
          pattern: '/legacy',
          target: '/modern',
          redirectType: REDIRECT_TYPE_SERVER_TRANSFER,
        }),
      ]),
    });
    await createRedirectsMiddleware(options)(req, res, next);
    expect(res.redirect).not.toHaveBeenCalled();
    expect(req.url).toBe('/modern');
    expect(req.path).toBe('/modern');
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('falls back to a 302 for SERVER_TRANSFER to an external target', async () => {
    const req = createReq({ path: '/legacy', url: '/legacy' });
    const res = createRes();
    const options = createOptions({
      redirectsService: createService([
        redirect({
          pattern: '/legacy',
          target: 'https://example.org/page',
          redirectType: REDIRECT_TYPE_SERVER_TRANSFER,
        }),
      ]),
    });
    await createRedirectsMiddleware(options)(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith(302, 'https://example.org/page');
    expect(next).not.toHaveBeenCalled();
  });

  it('answers /_data navigations with a redirect envelope instead of an HTTP redirect', async () => {
    const service = createService([redirect({ pattern: '/about-us', target: '/about' })]);
    const req = createReq({
      method: 'POST',
      path: LOADER_DATA_ENDPOINT,
      url: LOADER_DATA_ENDPOINT,
      body: { loaderId: 'home', url: '/about-us', routeParams: {}, query: {} },
    });
    const res = createRes();
    await createRedirectsMiddleware(createOptions({ redirectsService: service }))(req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      kind: 'redirect',
      redirect: { loaderRedirectTarget: '/about', status: 301 },
    });
    expect(res.redirect).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('returns the external url in the redirect envelope for /_data navigations', async () => {
    const service = createService([
      redirect({ pattern: '/ext', target: 'https://example.org/page' }),
    ]);
    const req = createReq({
      method: 'POST',
      path: LOADER_DATA_ENDPOINT,
      url: LOADER_DATA_ENDPOINT,
      body: { loaderId: 'home', url: '/ext', routeParams: {}, query: {} },
    });
    const res = createRes();
    await createRedirectsMiddleware(createOptions({ redirectsService: service }))(req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      kind: 'redirect',
      redirect: { loaderRedirectTarget: 'https://example.org/page', status: 301 },
    });
  });

  it('rewrites the loader payload url for a SERVER_TRANSFER /_data navigation', async () => {
    const service = createService([
      redirect({
        pattern: '/legacy',
        target: '/modern',
        redirectType: REDIRECT_TYPE_SERVER_TRANSFER,
      }),
    ]);
    const body = { loaderId: 'home', url: '/legacy', routeParams: {}, query: {} };
    const req = createReq({
      method: 'POST',
      path: LOADER_DATA_ENDPOINT,
      url: LOADER_DATA_ENDPOINT,
      body,
    });
    const res = createRes();
    await createRedirectsMiddleware(createOptions({ redirectsService: service }))(req, res, next);
    expect(body.url).toBe('/modern');
    expect(res.json).not.toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('skips when disabled', async () => {
    const service = createService([redirect({ pattern: '/about-us', target: '/about' })]);
    const req = createReq({ path: '/about-us', url: '/about-us' });
    const res = createRes();
    await createRedirectsMiddleware(createOptions({ enabled: false, redirectsService: service }))(
      req,
      res,
      next
    );
    expect(res.redirect).not.toHaveBeenCalled();
    expect(service.fetchRedirects).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('warns and no-ops when neither Edge nor local API config is provided', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const req = createReq({ path: '/about-us', url: '/about-us' });
    const res = createRes();
    await createRedirectsMiddleware(createOptions({ redirectsService: undefined }))(req, res, next);
    expect(warn).toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('skips editing/preview requests', async () => {
    const service = createService([redirect({ pattern: '/about-us', target: '/about' })]);
    const req = createReq({
      path: '/about-us',
      url: '/about-us',
      headers: {
        host: 'a.example.com',
        [EDITING_PARAMS_HEADER]: JSON.stringify({ site: 'site-a' }),
      },
    });
    await createRedirectsMiddleware(createOptions({ redirectsService: service }))(
      req,
      createRes(),
      next
    );
    expect(service.fetchRedirects).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('skips api, sitecore and static-file routes', async () => {
    const service = createService([redirect({ pattern: '/x', target: '/y' })]);
    for (const path of ['/api/data', '/sitecore/render', '/assets/logo.png']) {
      const req = createReq({ path, url: path });
      await createRedirectsMiddleware(createOptions({ redirectsService: service }))(
        req,
        createRes(),
        next
      );
    }
    expect(service.fetchRedirects).not.toHaveBeenCalled();
  });

  it('skips when the custom skip predicate returns true', async () => {
    const service = createService([redirect({ pattern: '/about-us', target: '/about' })]);
    const req = createReq({ path: '/about-us', url: '/about-us' });
    await createRedirectsMiddleware(createOptions({ redirectsService: service, skip: () => true }))(
      req,
      createRes(),
      next
    );
    expect(service.fetchRedirects).not.toHaveBeenCalled();
  });

  it('skips prefetch requests and disables caching', async () => {
    const service = createService([redirect({ pattern: '/about-us', target: '/about' })]);
    const req = createReq({
      path: '/about-us',
      url: '/about-us',
      headers: { host: 'a.example.com', purpose: 'prefetch' },
    });
    const res = createRes();
    await createRedirectsMiddleware(createOptions({ redirectsService: service }))(req, res, next);
    expect(res.setHeader).toHaveBeenCalledWith('x-proxy-cache', 'no-cache');
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store, must-revalidate');
    expect(service.fetchRedirects).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('skips when the site cannot be resolved', async () => {
    const service = createService([redirect({ pattern: '/about-us', target: '/about' })]);
    const req = createReq({ path: '/about-us', url: '/about-us', scParams: undefined });
    await createRedirectsMiddleware(
      createOptions({ redirectsService: service, defaultSite: undefined })
    )(req, createRes(), next);
    expect(service.fetchRedirects).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('passes through when no redirect matches', async () => {
    const req = createReq({ path: '/about-us', url: '/about-us' });
    const res = createRes();
    await createRedirectsMiddleware(createOptions())(req, res, next);
    expect(res.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('logs and calls next when fetching redirects throws (fail-open)', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const service = {
      fetchRedirects: vi.fn().mockRejectedValue(new Error('boom')),
    } as unknown as RedirectsService;
    const req = createReq({ path: '/about-us', url: '/about-us' });
    const res = createRes();
    await createRedirectsMiddleware(createOptions({ redirectsService: service }))(req, res, next);
    expect(log).toHaveBeenCalledWith('Redirects middleware failed:');
    expect(res.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    log.mockRestore();
  });
});
