/* eslint-disable jsdoc/require-jsdoc */
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { enableProdMode, PLATFORM_ID, REQUEST_CONTEXT } from '@angular/core';
import type { EventData, IdentityData, PageViewData } from '@sitecore-content-sdk/events';
import type { AngularSitecoreConfig } from '../../config/define-config';
import { SITECORE_CONFIG_TOKEN } from '../tokens';
import {
  SITECORE_ANALYTICS,
  normalizeCookieDomain,
  type SitecoreAnalyticsWrapper,
} from './sitecore-analytics';

const mocks = vi.hoisted(() => ({
  initContentSdk: vi.fn(),
  pageView: vi.fn(),
  event: vi.fn(),
  identity: vi.fn(),
  form: vi.fn(),
  eventsPlugin: vi.fn(() => ({ name: 'events' })),
  analyticsPlugin: vi.fn(() => ({ name: 'analytics' })),
  analyticsBrowserAdapter: vi.fn(() => ({ name: 'browser-adapter' })),
  analyticsServerAdapter: vi.fn(() => ({ name: 'server-adapter' })),
}));

vi.mock('@sitecore-content-sdk/core', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  initContentSdk: mocks.initContentSdk,
}));
vi.mock('@sitecore-content-sdk/events', () => ({
  pageView: mocks.pageView,
  event: mocks.event,
  identity: mocks.identity,
  form: mocks.form,
  eventsPlugin: mocks.eventsPlugin,
}));
vi.mock('@sitecore-content-sdk/analytics-core', () => ({
  analyticsPlugin: mocks.analyticsPlugin,
  analyticsBrowserAdapter: mocks.analyticsBrowserAdapter,
  analyticsServerAdapter: mocks.analyticsServerAdapter,
}));

type ProvideSitecoreAngular = typeof import('../providers').provideSitecoreAngular;
type SitecoreAnalyticsBrowserCtor = typeof import('./sitecore-analytics.browser').SitecoreAnalyticsBrowser;
type SitecoreAnalyticsServerCtor = typeof import('./sitecore-analytics.server').SitecoreAnalyticsServer;

let provideSitecoreAngular: ProvideSitecoreAngular;
let SitecoreAnalyticsBrowser: SitecoreAnalyticsBrowserCtor;
let SitecoreAnalyticsServer: SitecoreAnalyticsServerCtor;

beforeAll(async () => {
  enableProdMode();
  ({ provideSitecoreAngular } = await import('../providers'));
  ({ SitecoreAnalyticsBrowser } = await import('./sitecore-analytics.browser'));
  ({ SitecoreAnalyticsServer } = await import('./sitecore-analytics.server'));
});

const browserConfig = {
  defaultSite: 'site-a',
  api: { edge: { clientContextId: 'client-ctx', edgeUrl: 'https://edge.example.com' } },
} as unknown as AngularSitecoreConfig;

const serverConfig = {
  defaultSite: 'site-a',
  api: { edge: { contextId: 'server-ctx', edgeUrl: 'https://edge.example.com' } },
} as unknown as AngularSitecoreConfig;

const pageViewData: PageViewData = { page: 'Home', language: 'en', pageVariantId: 'v1' };
const eventData: EventData = { type: 'myretailsite:CLICKED_PROMO' };
const identityData: IdentityData = { identifiers: [{ id: 'guest-1', provider: 'crm' }] };

beforeEach(() => {
  vi.clearAllMocks();
  // clearAllMocks keeps implementations; restore async resolutions + dev-mode default explicitly.
  mocks.initContentSdk.mockResolvedValue(undefined);
  mocks.pageView.mockResolvedValue(undefined);
  mocks.event.mockResolvedValue(undefined);
  mocks.identity.mockResolvedValue(undefined);
  mocks.form.mockResolvedValue(undefined);
  TestBed.resetTestingModule();
});

describe('normalizeCookieDomain', () => {
  it('strips the port', () => {
    expect(normalizeCookieDomain('example.com:3000')).toBe('example.com');
  });

  it('strips a leading www. (case-insensitive)', () => {
    expect(normalizeCookieDomain('www.example.com')).toBe('example.com');
    expect(normalizeCookieDomain('WWW.Example.com')).toBe('Example.com');
  });

  it('strips both port and leading www.', () => {
    expect(normalizeCookieDomain('www.example.com:8080')).toBe('example.com');
  });

  it('leaves a bare domain unchanged', () => {
    expect(normalizeCookieDomain('example.com')).toBe('example.com');
    expect(normalizeCookieDomain('localhost')).toBe('localhost');
  });

  it('only strips a leading www., not www in the middle', () => {
    expect(normalizeCookieDomain('app.www.example.com')).toBe('app.www.example.com');
  });
});

describe('SITECORE_ANALYTICS injection (provideSitecoreAngular)', () => {
  function injectAnalytics(platform: 'browser' | 'server'): SitecoreAnalyticsWrapper {
    TestBed.configureTestingModule({
      providers: [provideSitecoreAngular({}), { provide: PLATFORM_ID, useValue: platform }],
    });
    return TestBed.inject(SITECORE_ANALYTICS);
  }

  it('provides the browser implementation on the browser platform', () => {
    expect(injectAnalytics('browser')).toBeInstanceOf(SitecoreAnalyticsBrowser);
  });

  it('provides the server implementation on the server platform', () => {
    expect(injectAnalytics('server')).toBeInstanceOf(SitecoreAnalyticsServer);
  });
});

describe('SitecoreAnalyticsBrowser', () => {
  function create(config: AngularSitecoreConfig | null = browserConfig) {
    TestBed.configureTestingModule({
      providers: [
        SitecoreAnalyticsBrowser,
        { provide: SITECORE_CONFIG_TOKEN, useValue: config },
      ],
    });
    return TestBed.inject(SitecoreAnalyticsBrowser);
  }

  describe('dispatch when enabled (prod + clientContextId present)', () => {
    it('initializes the SDK once and forwards pageView', async () => {
      const svc = create();
      await svc.pageView(pageViewData);

      expect(mocks.initContentSdk).toHaveBeenCalledTimes(1);
      expect(mocks.initContentSdk).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.objectContaining({ contextId: 'client-ctx', siteName: 'site-a' }),
        })
      );
      expect(mocks.analyticsBrowserAdapter).toHaveBeenCalledTimes(1);
      expect(mocks.pageView).toHaveBeenCalledWith(pageViewData);
    });

    it('forwards event with its data', async () => {
      await create().event(eventData);
      expect(mocks.event).toHaveBeenCalledWith(eventData);
    });

    it('forwards identity with its data', async () => {
      await create().identity(identityData);
      expect(mocks.identity).toHaveBeenCalledWith(identityData);
    });

    it('forwards form with its arguments', async () => {
      await create().form('form-1', 'SUBMITTED', 'cmp-9');
      expect(mocks.form).toHaveBeenCalledWith('form-1', 'SUBMITTED', 'cmp-9');
    });

    it('initializes only once across multiple dispatches (memoized)', async () => {
      const svc = create();
      await svc.event(eventData);
      await svc.identity(identityData);
      await svc.form('f', 'VIEWED', 'c');
      expect(mocks.initContentSdk).toHaveBeenCalledTimes(1);
    });

    it('passes a normalized cookie domain derived from the hostname', async () => {
      await create().event(eventData);
      const expected = normalizeCookieDomain(window.location.hostname);
      expect(mocks.analyticsPlugin).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({ enableCookie: true, cookieDomain: expected }),
        })
      );
    });
  });

  describe('pageView dedup', () => {
    it('drops an identical page view within the dedup window', async () => {
      const svc = create();
      await svc.pageView(pageViewData);
      await svc.pageView({ ...pageViewData });
      expect(mocks.pageView).toHaveBeenCalledTimes(1);
    });

    it('dispatches again for a different fingerprint', async () => {
      const svc = create();
      await svc.pageView(pageViewData);
      await svc.pageView({ ...pageViewData, pageVariantId: 'v2' });
      expect(mocks.pageView).toHaveBeenCalledTimes(2);
    });

    it('dispatches again once the dedup window has elapsed', async () => {
      let now = 10_000;
      const nowSpy = vi.spyOn(Date, 'now').mockImplementation(() => now);
      try {
        const svc = create();
        await svc.pageView(pageViewData);
        now += 1_001;
        await svc.pageView({ ...pageViewData });
        expect(mocks.pageView).toHaveBeenCalledTimes(2);
      } finally {
        nowSpy.mockRestore();
      }
    });
  });

  describe('guards (disabled paths)', () => {
    it('does not dispatch when browser initialization is disabled', async () => {
      const doInitSpy = vi
        .spyOn(
          SitecoreAnalyticsBrowser.prototype as unknown as {
            doInit: () => Promise<boolean>;
          },
          'doInit'
        )
        .mockResolvedValue(false);
      try {
        await create().pageView(pageViewData);
        expect(mocks.initContentSdk).not.toHaveBeenCalled();
        expect(mocks.pageView).not.toHaveBeenCalled();
      } finally {
        doInitSpy.mockRestore();
      }
    });

    it('does not initialize or dispatch when clientContextId is missing', async () => {
      const noEdge = { defaultSite: 'site-a', api: { edge: {} } } as unknown as AngularSitecoreConfig;
      await create(noEdge).pageView(pageViewData);
      expect(mocks.initContentSdk).not.toHaveBeenCalled();
      expect(mocks.pageView).not.toHaveBeenCalled();
    });

    it('does not throw when config is absent', async () => {
      await expect(create(null).event(eventData)).resolves.toBeUndefined();
      expect(mocks.initContentSdk).not.toHaveBeenCalled();
    });
  });

  describe('error swallowing', () => {
    it('resolves (does not reject) when the events call throws', async () => {
      mocks.event.mockRejectedValueOnce(new Error('events boom'));
      await expect(create().event(eventData)).resolves.toBeUndefined();
    });

    it('resolves (does not reject) when init throws', async () => {
      mocks.initContentSdk.mockRejectedValueOnce(new Error('init boom'));
      await expect(create().pageView(pageViewData)).resolves.toBeUndefined();
      expect(mocks.pageView).not.toHaveBeenCalled();
    });
  });
});

describe('SitecoreAnalyticsServer', () => {
  const ssrContext = (
    headers: Record<string, string | string[] | undefined> = { host: 'www.example.com:3000' },
    withRes = true
  ) => ({ req: { headers }, ...(withRes ? { res: {} } : {}) });

  const ABSENT = Symbol('absent');

  function create(
    config: AngularSitecoreConfig | null = serverConfig,
    ssr: unknown = ssrContext()
  ) {
    TestBed.configureTestingModule({
      providers: [
        SitecoreAnalyticsServer,
        { provide: SITECORE_CONFIG_TOKEN, useValue: config },
        // Omit the provider entirely to model an absent REQUEST_CONTEXT (optional inject → null).
        ...(ssr === ABSENT ? [] : [{ provide: REQUEST_CONTEXT, useValue: ssr }]),
      ],
    });
    return TestBed.inject(SitecoreAnalyticsServer);
  }

  describe('dispatch when enabled (contextId + req/res present)', () => {
    it('initializes with the server adapter once and forwards pageView', async () => {
      const svc = create();
      await svc.pageView(pageViewData);

      expect(mocks.initContentSdk).toHaveBeenCalledTimes(1);
      expect(mocks.initContentSdk).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.objectContaining({ contextId: 'server-ctx', siteName: 'site-a' }),
        })
      );
      expect(mocks.analyticsServerAdapter).toHaveBeenCalledTimes(1);
      expect(mocks.pageView).toHaveBeenCalledWith(pageViewData);
    });

    it('forwards event, identity and form', async () => {
      const svc = create();
      await svc.event(eventData);
      await svc.identity(identityData);
      await svc.form('f1', 'VIEWED', 'c1');
      expect(mocks.event).toHaveBeenCalledWith(eventData);
      expect(mocks.identity).toHaveBeenCalledWith(identityData);
      expect(mocks.form).toHaveBeenCalledWith('f1', 'VIEWED', 'c1');
      expect(mocks.initContentSdk).toHaveBeenCalledTimes(1);
    });

    it('does not dedup repeated page views (server has no dedup window)', async () => {
      const svc = create();
      await svc.pageView(pageViewData);
      await svc.pageView({ ...pageViewData });
      expect(mocks.pageView).toHaveBeenCalledTimes(2);
    });

    it('derives the cookie domain from x-forwarded-host (port + www stripped)', async () => {
      const svc = create(serverConfig, ssrContext({ 'x-forwarded-host': 'www.forwarded.com:8443' }));
      await svc.event(eventData);
      expect(mocks.analyticsPlugin).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({ cookieDomain: 'forwarded.com' }),
        })
      );
    });

    it('prefers x-forwarded-host over host and reads the first array entry', async () => {
      const svc = create(
        serverConfig,
        ssrContext({ 'x-forwarded-host': ['proxy.example.com'], host: 'origin.example.com' })
      );
      await svc.event(eventData);
      expect(mocks.analyticsPlugin).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({ cookieDomain: 'proxy.example.com' }),
        })
      );
    });

    it('passes the Node req/res to the server adapter', async () => {
      const ssr = ssrContext({ host: 'example.com' });
      await create(serverConfig, ssr).event(eventData);
      expect(mocks.analyticsServerAdapter).toHaveBeenCalledWith(ssr.req, ssr.res);
    });
  });

  describe('guards (disabled paths)', () => {
    it('does not initialize when contextId is missing', async () => {
      const noEdge = { defaultSite: 'site-a', api: { edge: {} } } as unknown as AngularSitecoreConfig;
      await create(noEdge).pageView(pageViewData);
      expect(mocks.initContentSdk).not.toHaveBeenCalled();
      expect(mocks.pageView).not.toHaveBeenCalled();
    });

    it('does not initialize when REQUEST_CONTEXT is absent', async () => {
      await create(serverConfig, ABSENT).pageView(pageViewData);
      expect(mocks.initContentSdk).not.toHaveBeenCalled();
    });

    it('does not initialize when res is missing from the context', async () => {
      await create(serverConfig, ssrContext({ host: 'example.com' }, false)).pageView(pageViewData);
      expect(mocks.initContentSdk).not.toHaveBeenCalled();
    });
  });

  describe('error swallowing', () => {
    it('resolves when the events call throws', async () => {
      mocks.identity.mockRejectedValueOnce(new Error('boom'));
      await expect(create().identity(identityData)).resolves.toBeUndefined();
    });
  });
});
