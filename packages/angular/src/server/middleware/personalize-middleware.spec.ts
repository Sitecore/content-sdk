/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import {
  CdpHelper,
  DEFAULT_VARIANT,
  PersonalizeService,
} from '@sitecore-content-sdk/content/personalize';
import { SITE_KEY } from '@sitecore-content-sdk/content/site';
import { PREVIEW_KEY } from '@sitecore-content-sdk/content/editing';
import { LOADER_DATA_ENDPOINT } from '../constants';
import { SC_PARAMS_HEADER } from '../../loaders/constants';
import type { CsdkExpressRequest, ExpressMiddleware, ExpressResponse } from './models';
import type { PersonalizeMiddlewareOptions } from './personalize-middleware';
const {
  initContentSdkMock,
  personalizeMock,
  personalizeServerPluginMock,
  personalizeServerAdapterMock,
  analyticsPluginMock,
  analyticsServerAdapterMock,
} = vi.hoisted(() => ({
  initContentSdkMock: vi.fn().mockResolvedValue(undefined),
  personalizeMock: vi.fn(),
  personalizeServerPluginMock: vi.fn(),
  personalizeServerAdapterMock: vi.fn(),
  analyticsPluginMock: vi.fn(),
  analyticsServerAdapterMock: vi.fn(),
}));

vi.mock('@sitecore-content-sdk/core', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  initContentSdk: initContentSdkMock,
}));
vi.mock('@sitecore-content-sdk/personalize', () => ({
  personalize: personalizeMock,
  personalizeServerPlugin: personalizeServerPluginMock,
  personalizeServerAdapter: personalizeServerAdapterMock,
}));
vi.mock('@sitecore-content-sdk/analytics-core', () => ({
  analyticsPlugin: analyticsPluginMock,
  analyticsServerAdapter: analyticsServerAdapterMock,
}));

type CreatePersonalizeMiddleware = (options: PersonalizeMiddlewareOptions) => ExpressMiddleware;

let createPersonalizeMiddleware: CreatePersonalizeMiddleware;

const getPersonalizeInfo = vi.fn();
const personalizeService = {
  getPersonalizeInfo,
} as unknown as PersonalizeService;

function createOptions(
  overrides: Partial<PersonalizeMiddlewareOptions> = {}
): PersonalizeMiddlewareOptions {
  return {
    enabled: true,
    contextId: 'context-id',
    defaultSite: 'website',
    locales: ['en', 'da'],
    personalizeService,
    ...overrides,
  };
}

function createReq(overrides: Partial<CsdkExpressRequest> = {}): CsdkExpressRequest {
  return {
    method: 'GET',
    path: '/about',
    url: '/about',
    body: undefined,
    query: {},
    cookies: {},
    headers: { host: 'example.com' },
    scParams: { siteName: 'website', variantId: DEFAULT_VARIANT },
    ...overrides,
  };
}

function createRes() {
  return { setHeader: vi.fn() } as unknown as ExpressResponse & {
    setHeader: ReturnType<typeof vi.fn>;
  };
}

describe('createPersonalizeMiddleware', () => {
  const next = vi.fn();

  beforeAll(async () => {
    ({ createPersonalizeMiddleware } = await import('./personalize-middleware'));
  });

  beforeEach(() => {
    vi.clearAllMocks();
    initContentSdkMock.mockResolvedValue(undefined);
  });

  it('should populate req.scParams with identified page-level variant', async () => {
    getPersonalizeInfo.mockResolvedValue({ pageId: 'page-1', variantIds: ['variant-a'] });
    personalizeMock.mockResolvedValue({ variantId: 'variant-a' });
    const req = createReq();

    await createPersonalizeMiddleware(createOptions())(req, createRes(), next);

    expect(getPersonalizeInfo).toHaveBeenCalledWith('/about', 'en', 'website');
    expect(initContentSdkMock).toHaveBeenCalled();
    expect(personalizeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        channel: 'WEB',
        currency: 'USD',
        friendlyId: CdpHelper.getPageFriendlyId('page-1', 'en'),
        language: 'en',
        pageVariantIds: ['variant-a'],
      }),
      { timeout: undefined }
    );
    expect(req.scParams).toEqual({
      siteName: 'website',
      variantId: 'variant-a',
      componentVariantIds: [],
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should populate req.scParams.componentVariantIds with identified component-level variants', async () => {
    getPersonalizeInfo.mockResolvedValue({ pageId: 'page-1', variantIds: ['comp1_var1'] });
    personalizeMock.mockResolvedValue({ variantId: 'comp1_var1' });
    const req = createReq();

    await createPersonalizeMiddleware(createOptions())(req, createRes(), next);

    expect(personalizeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        friendlyId: CdpHelper.getComponentFriendlyId('page-1', 'comp1', 'en'),
        pageVariantIds: [`comp1${DEFAULT_VARIANT}`, 'comp1_var1'],
      }),
      { timeout: undefined }
    );
    expect(req.scParams).toEqual({
      siteName: 'website',
      variantId: DEFAULT_VARIANT,
      componentVariantIds: ['comp1_var1'],
    });
  });

  it('should extract language and content path from locale-prefixed url', async () => {
    getPersonalizeInfo.mockResolvedValue(undefined);
    const req = createReq({ path: '/da/products/shoes', url: '/da/products/shoes' });

    await createPersonalizeMiddleware(createOptions())(req, createRes(), next);

    expect(getPersonalizeInfo).toHaveBeenCalledWith('/products/shoes', 'da', 'website');
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should use defaultLanguage when path has no locale prefix', async () => {
    getPersonalizeInfo.mockResolvedValue(undefined);
    const req = createReq();

    await createPersonalizeMiddleware(createOptions({ defaultLanguage: 'fr' }))(
      req,
      createRes(),
      next
    );

    expect(getPersonalizeInfo).toHaveBeenCalledWith('/about', 'fr', 'website');
  });

  it('should resolve site from cookie and fall back to defaultSite when req.scParams is not set', async () => {
    getPersonalizeInfo.mockResolvedValue(undefined);
    const middleware = createPersonalizeMiddleware(createOptions());

    await middleware(
      createReq({ scParams: undefined, cookies: { [SITE_KEY]: 'other-site' } }),
      createRes(),
      next
    );
    expect(getPersonalizeInfo).toHaveBeenCalledWith('/about', 'en', 'other-site');

    await middleware(createReq({ scParams: undefined }), createRes(), next);
    expect(getPersonalizeInfo).toHaveBeenCalledWith('/about', 'en', 'website');
  });

  it('should skip when disabled', async () => {
    const req = createReq();

    await createPersonalizeMiddleware(createOptions({ enabled: false }))(req, createRes(), next);

    expect(getPersonalizeInfo).not.toHaveBeenCalled();
    expect(req.scParams?.variantId).toBe(DEFAULT_VARIANT);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should skip and warn when edge configuration is missing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const middleware = createPersonalizeMiddleware(
      createOptions({ contextId: undefined, personalizeService: undefined })
    );

    await middleware(createReq(), createRes(), next);

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('requires Edge configuration'));
    expect(next).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('should skip when custom skip callback returns true', async () => {
    await createPersonalizeMiddleware(createOptions({ skip: () => true }))(
      createReq(),
      createRes(),
      next
    );

    expect(getPersonalizeInfo).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should skip api, sitecore and file routes', async () => {
    const middleware = createPersonalizeMiddleware(createOptions());

    for (const path of ['/api/data', '/sitecore/render', '/assets/logo.png']) {
      await middleware(createReq({ path, url: path }), createRes(), next);
    }

    expect(getPersonalizeInfo).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(3);
  });

  it('should skip in preview mode', async () => {
    await createPersonalizeMiddleware(createOptions())(
      createReq({ cookies: { [PREVIEW_KEY]: 'true' } }),
      createRes(),
      next
    );

    expect(getPersonalizeInfo).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should skip when personalize info is not found or has no variants', async () => {
    const middleware = createPersonalizeMiddleware(createOptions());
    const req = createReq();

    getPersonalizeInfo.mockResolvedValueOnce(undefined);
    await middleware(req, createRes(), next);

    getPersonalizeInfo.mockResolvedValueOnce({ pageId: 'page-1', variantIds: [] });
    await middleware(req, createRes(), next);

    expect(personalizeMock).not.toHaveBeenCalled();
    expect(req.scParams?.variantId).toBe(DEFAULT_VARIANT);
    expect(next).toHaveBeenCalledTimes(2);
  });

  it('should skip prefetch requests and disable caching', async () => {
    getPersonalizeInfo.mockResolvedValue({ pageId: 'page-1', variantIds: ['variant-a'] });
    const req = createReq({ headers: { host: 'example.com', purpose: 'prefetch' } });
    const res = createRes();

    await createPersonalizeMiddleware(createOptions())(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store, must-revalidate');
    expect(personalizeMock).not.toHaveBeenCalled();
    expect(req.scParams?.variantId).toBe(DEFAULT_VARIANT);
  });

  it('should ignore variants not configured for the route', async () => {
    getPersonalizeInfo.mockResolvedValue({ pageId: 'page-1', variantIds: ['variant-a'] });
    personalizeMock.mockResolvedValue({ variantId: 'unknown-variant' });
    const req = createReq();

    await createPersonalizeMiddleware(createOptions())(req, createRes(), next);

    expect(req.scParams?.variantId).toBe(DEFAULT_VARIANT);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should pass utm params, referrer and geo data to personalize', async () => {
    getPersonalizeInfo.mockResolvedValue({ pageId: 'page-1', variantIds: ['variant-a'] });
    personalizeMock.mockResolvedValue({ variantId: 'variant-a' });
    const req = createReq({
      query: { utm_campaign: 'sale', utm_source: 'newsletter' },
      headers: { host: 'example.com', referer: 'https://referrer.example' },
    });

    await createPersonalizeMiddleware(
      createOptions({ extractGeoDataCb: () => ({ city: 'Oslo' }) })
    )(req, createRes(), next);

    expect(personalizeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        params: {
          referrer: 'https://referrer.example',
          utm: {
            campaign: 'sale',
            content: undefined,
            medium: undefined,
            source: 'newsletter',
          },
        },
        geo: { city: 'Oslo' },
      }),
      { timeout: undefined }
    );
  });

  it('should call next and not fail the request when personalization throws', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    getPersonalizeInfo.mockRejectedValue(new Error('edge unavailable'));
    const req = createReq();

    await createPersonalizeMiddleware(createOptions())(req, createRes(), next);

    expect(req.scParams?.variantId).toBe(DEFAULT_VARIANT);
    expect(next).toHaveBeenCalledTimes(1);
    log.mockRestore();
  });

  it('is enabled by default when enabled is omitted', async () => {
    getPersonalizeInfo.mockResolvedValue(undefined);
    const { enabled, ...optionsWithoutEnabled } = createOptions();
    void enabled;

    await createPersonalizeMiddleware(optionsWithoutEnabled)(createReq(), createRes(), next);

    expect(getPersonalizeInfo).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('skips paths excluded by a custom matcher', async () => {
    await createPersonalizeMiddleware(createOptions({ matcher: { excludePaths: ['/health'] } }))(
      createReq({ path: '/health', url: '/health' }),
      createRes(),
      next
    );

    expect(getPersonalizeInfo).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('resolves path and site from /_data loader payload', async () => {
    getPersonalizeInfo.mockResolvedValue(undefined);
    const req = createReq({
      method: 'POST',
      path: LOADER_DATA_ENDPOINT,
      url: LOADER_DATA_ENDPOINT,
      scParams: undefined,
      body: {
        loaderId: 'home',
        url: '/da/products',
        routeParams: {},
        query: {},
      },
      cookies: { [SITE_KEY]: 'loader-site' },
    });

    await createPersonalizeMiddleware(createOptions())(req, createRes(), next);

    expect(getPersonalizeInfo).toHaveBeenCalledWith('/products', 'da', 'loader-site');
  });

  it('writes SC_PARAMS_HEADER when variants are identified', async () => {
    getPersonalizeInfo.mockResolvedValue({ pageId: 'page-1', variantIds: ['variant-a'] });
    personalizeMock.mockResolvedValue({ variantId: 'variant-a' });
    const req = createReq();

    await createPersonalizeMiddleware(createOptions())(req, createRes(), next);

    expect(req.headers?.[SC_PARAMS_HEADER]).toBe(
      JSON.stringify({
        siteName: 'website',
        variantId: 'variant-a',
        componentVariantIds: [],
      })
    );
  });

  it('skips when site name cannot be resolved', async () => {
    await createPersonalizeMiddleware(createOptions({ defaultSite: undefined }))(
      createReq({ scParams: undefined, cookies: {} }),
      createRes(),
      next
    );

    expect(getPersonalizeInfo).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('merges getExtraUtmParams into experience params', async () => {
    getPersonalizeInfo.mockResolvedValue({ pageId: 'page-1', variantIds: ['variant-a'] });
    personalizeMock.mockResolvedValue({ variantId: 'variant-a' });

    await createPersonalizeMiddleware(
      createOptions({ getExtraUtmParams: () => ({ medium: 'email', campaign: 'override' }) })
    )(createReq({ query: { utm_campaign: 'original' } }), createRes(), next);

    expect(personalizeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({
          utm: expect.objectContaining({ medium: 'email', campaign: 'override' }),
        }),
      }),
      { timeout: undefined }
    );
  });

  it('treats sec-purpose prefetch headers like purpose prefetch', async () => {
    getPersonalizeInfo.mockResolvedValue({ pageId: 'page-1', variantIds: ['variant-a'] });
    const res = createRes();

    await createPersonalizeMiddleware(createOptions())(
      createReq({ headers: { host: 'example.com', 'sec-purpose': 'prefetch' } }),
      res,
      next
    );

    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store, must-revalidate');
    expect(personalizeMock).not.toHaveBeenCalled();
  });

  it('calls next when personalize execution throws after info is loaded', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    getPersonalizeInfo.mockResolvedValue({ pageId: 'page-1', variantIds: ['variant-a'] });
    personalizeMock.mockRejectedValue(new Error('cdp unavailable'));
    const req = createReq();

    await createPersonalizeMiddleware(createOptions())(req, createRes(), next);

    expect(req.scParams?.variantId).toBe(DEFAULT_VARIANT);
    expect(next).toHaveBeenCalledTimes(1);
    log.mockRestore();
  });
});
