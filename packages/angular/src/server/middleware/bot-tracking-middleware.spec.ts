/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import type { CsdkExpressRequest, ExpressMiddleware, ExpressResponse } from './models';
import type { BotTrackingMiddlewareOptions } from './bot-tracking-middleware';

const BOT_COOKIE = 'sc_bot';

const {
  initContentSdkMock,
  analyticsPluginMock,
  analyticsServerAdapterMock,
  eventsPluginMock,
  botPageViewMock,
  isBotMock,
} = vi.hoisted(() => ({
  initContentSdkMock: vi.fn().mockResolvedValue(undefined),
  analyticsPluginMock: vi.fn(),
  analyticsServerAdapterMock: vi.fn(),
  eventsPluginMock: vi.fn(),
  botPageViewMock: vi.fn().mockResolvedValue(undefined),
  isBotMock: vi.fn(),
}));

vi.mock('@sitecore-content-sdk/core', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  initContentSdk: initContentSdkMock,
}));
vi.mock('@sitecore-content-sdk/analytics-core', () => ({
  analyticsPlugin: analyticsPluginMock,
  analyticsServerAdapter: analyticsServerAdapterMock,
}));
vi.mock('@sitecore-content-sdk/analytics-core/internal', () => ({
  BOT_DETECTION_COOKIE: BOT_COOKIE,
  isBot: isBotMock,
}));
vi.mock('@sitecore-content-sdk/events', () => ({
  botPageView: botPageViewMock,
  eventsPlugin: eventsPluginMock,
}));

type CreateBotTrackingMiddleware = (options: BotTrackingMiddlewareOptions) => ExpressMiddleware;

let createBotTrackingMiddleware: CreateBotTrackingMiddleware;

function createOptions(
  overrides: Partial<BotTrackingMiddlewareOptions> = {}
): BotTrackingMiddlewareOptions {
  return {
    enabled: true,
    contextId: 'context-id',
    edgeUrl: 'https://edge.test',
    defaultSite: 'website',
    defaultLanguage: 'en',
    locales: ['en', 'da'],
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
    headers: { host: 'example.com', 'user-agent': 'Googlebot/2.1' },
    scParams: { siteName: 'website' },
    ...overrides,
  };
}

function createRes() {
  return { cookie: vi.fn(), setHeader: vi.fn() } as unknown as ExpressResponse & {
    cookie: ReturnType<typeof vi.fn>;
    setHeader: ReturnType<typeof vi.fn>;
  };
}

describe('createBotTrackingMiddleware', () => {
  const next = vi.fn();
  let prevEnableBot: string | undefined;

  beforeAll(async () => {
    ({ createBotTrackingMiddleware } = await import('./bot-tracking-middleware'));
  });

  beforeEach(() => {
    vi.clearAllMocks();
    initContentSdkMock.mockResolvedValue(undefined);
    botPageViewMock.mockResolvedValue(undefined);
    isBotMock.mockReturnValue(true);
    // Force bot tracking on so the local-environment guard doesn't skip non-local tests.
    prevEnableBot = process.env.SITECORE_ENABLE_BOT_TRACKING;
    process.env.SITECORE_ENABLE_BOT_TRACKING = 'true';
  });

  afterEach(() => {
    process.env.SITECORE_ENABLE_BOT_TRACKING = prevEnableBot;
  });

  it('should mark the request and dispatch a bot page view for a bot', async () => {
    const req = createReq();
    const res = createRes();

    await createBotTrackingMiddleware(createOptions())(req, res, next);

    expect(res.cookie).toHaveBeenCalledWith(BOT_COOKIE, '1', {
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    expect(req.cookies?.[BOT_COOKIE]).toBe('1');
    expect(initContentSdkMock).toHaveBeenCalled();
    expect(botPageViewMock).toHaveBeenCalledWith({
      page: '/about',
      language: 'en',
      userAgent: 'Googlebot/2.1',
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should skip when the request is not a bot', async () => {
    isBotMock.mockReturnValue(false);
    const req = createReq();
    const res = createRes();

    await createBotTrackingMiddleware(createOptions())(req, res, next);

    expect(res.cookie).not.toHaveBeenCalled();
    expect(botPageViewMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should skip when there is no user-agent', async () => {
    const req = createReq({ headers: { host: 'example.com' } });
    const res = createRes();

    await createBotTrackingMiddleware(createOptions())(req, res, next);

    expect(isBotMock).not.toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();
    expect(botPageViewMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should skip prefetch requests (after marking nothing)', async () => {
    const req = createReq({
      headers: { host: 'example.com', 'user-agent': 'Googlebot/2.1', purpose: 'prefetch' },
    });
    const res = createRes();

    await createBotTrackingMiddleware(createOptions())(req, res, next);

    expect(res.cookie).not.toHaveBeenCalled();
    expect(botPageViewMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should skip when disabled', async () => {
    const req = createReq();
    const res = createRes();

    await createBotTrackingMiddleware(createOptions({ enabled: false }))(req, res, next);

    expect(isBotMock).not.toHaveBeenCalled();
    expect(botPageViewMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should skip when the skip predicate returns true', async () => {
    const req = createReq();
    const res = createRes();

    await createBotTrackingMiddleware(createOptions({ skip: () => true }))(req, res, next);

    expect(isBotMock).not.toHaveBeenCalled();
    expect(botPageViewMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should skip excluded paths (default API exclusion)', async () => {
    const req = createReq({ path: '/api/data', url: '/api/data' });
    const res = createRes();

    await createBotTrackingMiddleware(createOptions())(req, res, next);

    expect(isBotMock).not.toHaveBeenCalled();
    expect(botPageViewMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should skip on localhost when bot tracking is not explicitly enabled', async () => {
    process.env.SITECORE_ENABLE_BOT_TRACKING = '';
    const req = createReq({ headers: { host: 'localhost:4200', 'user-agent': 'Googlebot/2.1' } });
    const res = createRes();

    await createBotTrackingMiddleware(createOptions())(req, res, next);

    expect(isBotMock).not.toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();
    expect(botPageViewMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should mark the bot cookie but not dispatch when Edge contextId is missing', async () => {
    const req = createReq();
    const res = createRes();

    await createBotTrackingMiddleware(createOptions({ contextId: undefined }))(req, res, next);

    expect(res.cookie).toHaveBeenCalledWith(BOT_COOKIE, '1', {
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    expect(req.cookies?.[BOT_COOKIE]).toBe('1');
    expect(initContentSdkMock).not.toHaveBeenCalled();
    expect(botPageViewMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should not throw when the dispatch fails', async () => {
    botPageViewMock.mockRejectedValue(new Error('edge down'));
    const req = createReq();
    const res = createRes();

    await createBotTrackingMiddleware(createOptions())(req, res, next);

    // cookie still set; error swallowed; next still called
    expect(res.cookie).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
});
