/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  CdpHelper,
  DEFAULT_VARIANT,
  PersonalizeService,
} from '@sitecore-content-sdk/content/personalize';
import { SITE_KEY } from '@sitecore-content-sdk/content/site';
import { PREVIEW_KEY } from '@sitecore-content-sdk/content/editing';
import { BOT_DETECTION_COOKIE } from '@sitecore-content-sdk/analytics-core/internal';
import { initContentSdk } from '@sitecore-content-sdk/core';
import { personalize } from '@sitecore-content-sdk/personalize';
import {
  createPersonalizeMiddleware,
  PersonalizeMiddlewareOptions,
} from './personalize-middleware';
import type { CsdkExpressRequest, ExpressResponse } from '../models';

vi.mock('@sitecore-content-sdk/core', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  initContentSdk: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@sitecore-content-sdk/personalize', () => ({
  personalize: vi.fn(),
  personalizeServerPlugin: vi.fn(),
  personalizeServerAdapter: vi.fn(),
}));
vi.mock('@sitecore-content-sdk/analytics-core', () => ({
  analyticsPlugin: vi.fn(),
  analyticsServerAdapter: vi.fn(),
}));

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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should populate req.scParams with identified page-level variant', async () => {
    getPersonalizeInfo.mockResolvedValue({ pageId: 'page-1', variantIds: ['variant-a'] });
    vi.mocked(personalize).mockResolvedValue({ variantId: 'variant-a' });
    const req = createReq();

    await createPersonalizeMiddleware(createOptions())(req, createRes(), next);

    expect(getPersonalizeInfo).toHaveBeenCalledWith('/about', 'en', 'website');
    expect(initContentSdk).toHaveBeenCalled();
    expect(personalize).toHaveBeenCalledWith(
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
    vi.mocked(personalize).mockResolvedValue({ variantId: 'comp1_var1' });
    const req = createReq();

    await createPersonalizeMiddleware(createOptions())(req, createRes(), next);

    expect(personalize).toHaveBeenCalledWith(
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
    const req = createReq({ path: '/da/products/shoes' });

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
      await middleware(createReq({ path }), createRes(), next);
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

  it('should skip bot requests unless skipForBot is disabled', async () => {
    getPersonalizeInfo.mockResolvedValue(undefined);
    const botReq = createReq({ cookies: { [BOT_DETECTION_COOKIE]: '1' } });

    await createPersonalizeMiddleware(createOptions())(botReq, createRes(), next);
    expect(getPersonalizeInfo).not.toHaveBeenCalled();

    await createPersonalizeMiddleware(createOptions({ skipForBot: false }))(
      botReq,
      createRes(),
      next
    );
    expect(getPersonalizeInfo).toHaveBeenCalledTimes(1);
  });

  it('should skip when personalize info is not found or has no variants', async () => {
    const middleware = createPersonalizeMiddleware(createOptions());
    const req = createReq();

    getPersonalizeInfo.mockResolvedValueOnce(undefined);
    await middleware(req, createRes(), next);

    getPersonalizeInfo.mockResolvedValueOnce({ pageId: 'page-1', variantIds: [] });
    await middleware(req, createRes(), next);

    expect(personalize).not.toHaveBeenCalled();
    expect(req.scParams?.variantId).toBe(DEFAULT_VARIANT);
    expect(next).toHaveBeenCalledTimes(2);
  });

  it('should skip prefetch requests and disable caching', async () => {
    getPersonalizeInfo.mockResolvedValue({ pageId: 'page-1', variantIds: ['variant-a'] });
    const req = createReq({ headers: { host: 'example.com', purpose: 'prefetch' } });
    const res = createRes();

    await createPersonalizeMiddleware(createOptions())(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store, must-revalidate');
    expect(personalize).not.toHaveBeenCalled();
    expect(req.scParams?.variantId).toBe(DEFAULT_VARIANT);
  });

  it('should ignore variants not configured for the route', async () => {
    getPersonalizeInfo.mockResolvedValue({ pageId: 'page-1', variantIds: ['variant-a'] });
    vi.mocked(personalize).mockResolvedValue({ variantId: 'unknown-variant' });
    const req = createReq();

    await createPersonalizeMiddleware(createOptions())(req, createRes(), next);

    expect(req.scParams?.variantId).toBe(DEFAULT_VARIANT);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should pass utm params, referrer and geo data to personalize', async () => {
    getPersonalizeInfo.mockResolvedValue({ pageId: 'page-1', variantIds: ['variant-a'] });
    vi.mocked(personalize).mockResolvedValue({ variantId: 'variant-a' });
    const req = createReq({
      query: { utm_campaign: 'sale', utm_source: 'newsletter' },
      headers: { host: 'example.com', referer: 'https://referrer.example' },
    });

    await createPersonalizeMiddleware(
      createOptions({ extractGeoDataCb: () => ({ city: 'Oslo' }) })
    )(req, createRes(), next);

    expect(personalize).toHaveBeenCalledWith(
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
});
