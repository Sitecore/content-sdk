import { analyticsPlugin, getAnalyticsPlugin } from './plugin';
import { ANALYTICS_PLUGIN_NAME } from './const';
import {
  CLIENT_ID_COOKIE_NAME,
  COOKIE_NAME_PREFIX,
  DEFAULT_COOKIE_EXPIRY_DAYS,
  LIBRARY_VERSION,
} from '../consts';
import * as coreModule from '@sitecore-content-sdk/core';
import * as getClientIdModule from '../client-id/get-client-id';
import { AnalyticsAdapter } from './types';
import { expect, jest } from '@jest/globals';

jest.mock('@sitecore-content-sdk/core', () => {
  const originalModule = jest.requireActual<typeof coreModule>('@sitecore-content-sdk/core');

  return {
    ...originalModule,
    getCoreContext: jest.fn(),
    debug: {
      init: jest.fn(),
    },
  };
});

describe('plugin', () => {
  const mockGetClientId = jest.fn<AnalyticsAdapter['getClientId']>();
  const mockSetClientId = jest.fn<AnalyticsAdapter['setClientId']>();
  const mockGetSearchParams = jest.fn<AnalyticsAdapter['location']['getSearchParams']>();

  const createMockAdapter = (type: 'browser' | 'server' = 'browser'): AnalyticsAdapter => ({
    type,
    getClientId: mockGetClientId,
    setClientId: mockSetClientId,
    location: {
      getSearchParams: mockGetSearchParams,
    },
  });

  const mockCoreContext = {
    config: {
      siteName: 'test-site',
      contextId: 'test-context-id',
      edgeUrl: 'https://edge.test.com',
    },
    plugins: new Map(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (coreModule.getCoreContext as jest.Mock).mockReturnValue(mockCoreContext);
    mockCoreContext.plugins.clear();
    // Reset window.scContentSDK
    if (typeof window !== 'undefined') {
      delete (window as any).scContentSDK;
    }
  });

  describe('analyticsPlugin', () => {
    it('should create a plugin with the correct name', () => {
      const adapter = createMockAdapter();
      const plugin = analyticsPlugin({ adapter });

      expect(plugin.name).toBe(ANALYTICS_PLUGIN_NAME);
    });

    it('should create a plugin with the correct adapter', () => {
      const adapter = createMockAdapter();
      const plugin = analyticsPlugin({ adapter });

      expect(plugin.adapter).toBe(adapter);
    });

    it('should have an init function', () => {
      const adapter = createMockAdapter();
      const plugin = analyticsPlugin({ adapter });

      expect(typeof plugin.init).toBe('function');
    });

    describe('options construction', () => {
      it('should return default cookie settings when no settings provided', () => {
        const adapter = createMockAdapter();
        const plugin = analyticsPlugin({ adapter });

        expect(plugin.options.cookies).toEqual({
          domain: undefined,
          enabled: false,
          expiryDays: DEFAULT_COOKIE_EXPIRY_DAYS,
          name: `${COOKIE_NAME_PREFIX}${CLIENT_ID_COOKIE_NAME}`,
          path: '/',
        });
      });

      it('should return default cookie settings when empty options provided', () => {
        const adapter = createMockAdapter();
        const plugin = analyticsPlugin({ options: {}, adapter });

        expect(plugin.options.cookies).toEqual({
          domain: undefined,
          enabled: false,
          expiryDays: DEFAULT_COOKIE_EXPIRY_DAYS,
          name: `${COOKIE_NAME_PREFIX}${CLIENT_ID_COOKIE_NAME}`,
          path: '/',
        });
      });

      it('should set custom cookie domain', () => {
        const adapter = createMockAdapter();
        const plugin = analyticsPlugin({ options: { cookieDomain: '.example.com' }, adapter });

        expect(plugin.options.cookies.domain).toBe('.example.com');
      });

      it('should set custom cookie expiry days', () => {
        const adapter = createMockAdapter();
        const plugin = analyticsPlugin({ options: { cookieExpiryDays: 365 }, adapter });

        expect(plugin.options.cookies.expiryDays).toBe(365);
      });

      it('should use default expiry days when cookieExpiryDays is 0', () => {
        const adapter = createMockAdapter();
        const plugin = analyticsPlugin({ options: { cookieExpiryDays: 0 }, adapter });

        expect(plugin.options.cookies.expiryDays).toBe(DEFAULT_COOKIE_EXPIRY_DAYS);
      });

      it('should set custom cookie path', () => {
        const adapter = createMockAdapter();
        const plugin = analyticsPlugin({ options: { cookiePath: '/custom' }, adapter });

        expect(plugin.options.cookies.path).toBe('/custom');
      });

      it('should use default cookie path when empty path provided', () => {
        const adapter = createMockAdapter();
        const plugin = analyticsPlugin({ options: { cookiePath: '' }, adapter });

        expect(plugin.options.cookies.path).toBe('/');
      });

      it('should set cookie enabled to true', () => {
        const adapter = createMockAdapter();
        const plugin = analyticsPlugin({ options: { enableCookie: true }, adapter });

        expect(plugin.options.cookies.enabled).toBe(true);
      });

      it('should set cookie enabled to false', () => {
        const adapter = createMockAdapter();
        const plugin = analyticsPlugin({ options: { enableCookie: false }, adapter });

        expect(plugin.options.cookies.enabled).toBe(false);
      });

      it('should set custom timeout', () => {
        const adapter = createMockAdapter();
        const plugin = analyticsPlugin({ options: { timeout: 5000 }, adapter });

        expect(plugin.options.timeout).toBe(5000);
      });

      it('should return undefined timeout when not provided', () => {
        const adapter = createMockAdapter();
        const plugin = analyticsPlugin({ options: {}, adapter });

        expect(plugin.options.timeout).toBeUndefined();
      });

      it('should construct all custom settings correctly', () => {
        const adapter = createMockAdapter();
        const plugin = analyticsPlugin({
          options: {
            cookieDomain: '.custom.com',
            cookieExpiryDays: 100,
            cookiePath: '/app',
            enableCookie: true,
            timeout: 3000,
          },
          adapter,
        });

        expect(plugin.options).toEqual({
          cookies: {
            domain: '.custom.com',
            enabled: true,
            expiryDays: 100,
            name: `${COOKIE_NAME_PREFIX}${CLIENT_ID_COOKIE_NAME}`,
            path: '/app',
          },
          timeout: 3000,
        });
      });
    });
  });

  describe('getAnalyticsPlugin', () => {
    it('should return the analytics plugin from core settings', () => {
      const adapter = createMockAdapter();
      const plugin = analyticsPlugin({ options: { enableCookie: true }, adapter });
      mockCoreContext.plugins.set(ANALYTICS_PLUGIN_NAME, plugin);

      const result = getAnalyticsPlugin();

      expect(result).toBe(plugin);
    });

    it('should throw an error when analytics plugin is not registered', () => {
      mockCoreContext.plugins.clear();

      expect(() => getAnalyticsPlugin()).toThrow(
        `[IE-004] - You must first add "${ANALYTICS_PLUGIN_NAME}" to the "initContentSdk()" "plugins" array.`
      );
    });
  });

  describe('init', () => {
    it('should not call setClientId when enableCookie is false', async () => {
      const adapter = createMockAdapter();
      const plugin = analyticsPlugin({ options: { enableCookie: false }, adapter });
      mockCoreContext.plugins.set(ANALYTICS_PLUGIN_NAME, plugin);

      await plugin.init();

      expect(mockSetClientId).not.toHaveBeenCalled();
    });

    it('should call setClientId when enableCookie is true and client ID does not exist', async () => {
      const adapter = createMockAdapter();
      mockGetClientId.mockReturnValue(null);
      mockSetClientId.mockResolvedValue(undefined);

      const plugin = analyticsPlugin({ options: { enableCookie: true }, adapter });
      mockCoreContext.plugins.set(ANALYTICS_PLUGIN_NAME, plugin);

      await plugin.init();

      expect(mockSetClientId).toHaveBeenCalledTimes(1);
    });

    it('should call setClientId when enableCookie is true and getClientId returns empty string', async () => {
      const adapter = createMockAdapter();
      mockGetClientId.mockReturnValue('');
      mockSetClientId.mockResolvedValue(undefined);

      const plugin = analyticsPlugin({ options: { enableCookie: true }, adapter });
      mockCoreContext.plugins.set(ANALYTICS_PLUGIN_NAME, plugin);

      await plugin.init();

      expect(mockSetClientId).toHaveBeenCalledTimes(1);
    });

    it('should not call setClientId when client ID exists and adapter type is browser', async () => {
      const adapter = createMockAdapter('browser');
      mockGetClientId.mockReturnValue('existing-client-id');
      mockSetClientId.mockResolvedValue(undefined);

      const plugin = analyticsPlugin({ options: { enableCookie: true }, adapter });
      mockCoreContext.plugins.set(ANALYTICS_PLUGIN_NAME, plugin);

      await plugin.init();

      expect(mockSetClientId).not.toHaveBeenCalled();
    });

    it('should call setClientId when client ID exists but adapter type is not browser', async () => {
      const adapter = createMockAdapter('server');
      mockGetClientId.mockReturnValue('existing-client-id');
      mockSetClientId.mockResolvedValue(undefined);

      const plugin = analyticsPlugin({ options: { enableCookie: true }, adapter });
      mockCoreContext.plugins.set(ANALYTICS_PLUGIN_NAME, plugin);

      await plugin.init();

      expect(mockSetClientId).toHaveBeenCalledTimes(1);
    });

    it('should set up window.scContentSDK when adapter type is browser', async () => {
      const adapter = createMockAdapter('browser');
      mockGetClientId.mockReturnValue('existing-client-id');
      mockSetClientId.mockResolvedValue(undefined);

      const plugin = analyticsPlugin({ options: { enableCookie: true }, adapter });
      mockCoreContext.plugins.set(ANALYTICS_PLUGIN_NAME, plugin);

      await plugin.init();

      expect(window.scContentSDK).toBeDefined();
      expect(window.scContentSDK.analytics_core).toBeDefined();
      expect(window.scContentSDK.analytics_core.getClientId).toBe(getClientIdModule.getClientId);
      expect(window.scContentSDK.analytics_core.options).toEqual({
        siteName: 'test-site',
        contextId: 'test-context-id',
        edgeUrl: 'https://edge.test.com',
      });
      expect(window.scContentSDK.analytics_core.version).toBe(LIBRARY_VERSION);
    });

    it('should not set up window.scContentSDK when adapter type is server', async () => {
      const adapter = createMockAdapter('server');
      mockGetClientId.mockReturnValue(null);
      mockSetClientId.mockResolvedValue(undefined);

      const plugin = analyticsPlugin({ options: { enableCookie: true }, adapter });
      mockCoreContext.plugins.set(ANALYTICS_PLUGIN_NAME, plugin);

      await plugin.init();

      expect(window.scContentSDK).toBeUndefined();
    });

    it('should preserve existing window.scContentSDK properties when adding analytics-core', async () => {
      (window as any).scContentSDK = {
        'other-plugin': { version: '1.0.0' },
      };

      const adapter = createMockAdapter('browser');
      mockGetClientId.mockReturnValue('existing-client-id');
      mockSetClientId.mockResolvedValue(undefined);

      const plugin = analyticsPlugin({ options: { enableCookie: true }, adapter });
      mockCoreContext.plugins.set(ANALYTICS_PLUGIN_NAME, plugin);

      await plugin.init();

      expect((window.scContentSDK as any)['other-plugin']).toEqual({ version: '1.0.0' });
      expect(window.scContentSDK.analytics_core).toBeDefined();
    });
  });
});
