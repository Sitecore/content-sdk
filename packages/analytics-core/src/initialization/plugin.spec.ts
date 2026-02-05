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
import { AnalyticsEnvironment } from './types';
import { expect, jest } from '@jest/globals';

jest.mock('@sitecore-content-sdk/core', () => ({
  getCoreSettings: jest.fn(),
  debug: {
    init: jest.fn(),
  },
}));

describe('plugin', () => {
  const mockGetClientId = jest.fn<AnalyticsEnvironment['getClientId']>();
  const mockSetClientId = jest.fn<AnalyticsEnvironment['setClientId']>();
  const mockGetSearchParams = jest.fn<AnalyticsEnvironment['location']['getSearchParams']>();

  const createMockEnvironment = (type: 'browser' | 'server' = 'browser'): AnalyticsEnvironment => ({
    type,
    getClientId: mockGetClientId,
    setClientId: mockSetClientId,
    location: {
      getSearchParams: mockGetSearchParams,
    },
  });

  const mockCoreSettings = {
    settings: {
      siteName: 'test-site',
      contextId: 'test-context-id',
      edgeUrl: 'https://edge.test.com',
    },
    plugins: new Map(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (coreModule.getCoreSettings as jest.Mock).mockReturnValue(mockCoreSettings);
    mockCoreSettings.plugins.clear();
    // Reset window.scContentSDK
    if (typeof window !== 'undefined') {
      delete (window as any).scContentSDK;
    }
  });

  describe('analyticsPlugin', () => {
    it('should create a plugin with the correct name', () => {
      const environment = createMockEnvironment();
      const plugin = analyticsPlugin({ environment });

      expect(plugin.name).toBe(ANALYTICS_PLUGIN_NAME);
    });

    it('should create a plugin with the correct environment', () => {
      const environment = createMockEnvironment();
      const plugin = analyticsPlugin({ environment });

      expect(plugin.environment).toBe(environment);
    });

    it('should have an init function', () => {
      const environment = createMockEnvironment();
      const plugin = analyticsPlugin({ environment });

      expect(typeof plugin.init).toBe('function');
    });

    describe('settings construction', () => {
      it('should return default cookie settings when no settings provided', () => {
        const environment = createMockEnvironment();
        const plugin = analyticsPlugin({ environment });

        expect(plugin.settings.cookieSettings).toEqual({
          domain: undefined,
          enableCookie: false,
          expiryDays: DEFAULT_COOKIE_EXPIRY_DAYS,
          name: {
            clientId: `${COOKIE_NAME_PREFIX}${CLIENT_ID_COOKIE_NAME}`,
          },
          path: '/',
        });
      });

      it('should return default cookie settings when empty settings provided', () => {
        const environment = createMockEnvironment();
        const plugin = analyticsPlugin({ settings: {}, environment });

        expect(plugin.settings.cookieSettings).toEqual({
          domain: undefined,
          enableCookie: false,
          expiryDays: DEFAULT_COOKIE_EXPIRY_DAYS,
          name: {
            clientId: `${COOKIE_NAME_PREFIX}${CLIENT_ID_COOKIE_NAME}`,
          },
          path: '/',
        });
      });

      it('should set custom cookie domain', () => {
        const environment = createMockEnvironment();
        const plugin = analyticsPlugin({ settings: { cookieDomain: '.example.com' }, environment });

        expect(plugin.settings.cookieSettings.domain).toBe('.example.com');
      });

      it('should set custom cookie expiry days', () => {
        const environment = createMockEnvironment();
        const plugin = analyticsPlugin({ settings: { cookieExpiryDays: 365 }, environment });

        expect(plugin.settings.cookieSettings.expiryDays).toBe(365);
      });

      it('should use default expiry days when cookieExpiryDays is 0', () => {
        const environment = createMockEnvironment();
        const plugin = analyticsPlugin({ settings: { cookieExpiryDays: 0 }, environment });

        expect(plugin.settings.cookieSettings.expiryDays).toBe(DEFAULT_COOKIE_EXPIRY_DAYS);
      });

      it('should set custom cookie path', () => {
        const environment = createMockEnvironment();
        const plugin = analyticsPlugin({ settings: { cookiePath: '/custom' }, environment });

        expect(plugin.settings.cookieSettings.path).toBe('/custom');
      });

      it('should use default cookie path when empty path provided', () => {
        const environment = createMockEnvironment();
        const plugin = analyticsPlugin({ settings: { cookiePath: '' }, environment });

        expect(plugin.settings.cookieSettings.path).toBe('/');
      });

      it('should set enableCookie to true', () => {
        const environment = createMockEnvironment();
        const plugin = analyticsPlugin({ settings: { enableCookie: true }, environment });

        expect(plugin.settings.cookieSettings.enableCookie).toBe(true);
      });

      it('should set enableCookie to false', () => {
        const environment = createMockEnvironment();
        const plugin = analyticsPlugin({ settings: { enableCookie: false }, environment });

        expect(plugin.settings.cookieSettings.enableCookie).toBe(false);
      });

      it('should set custom timeout', () => {
        const environment = createMockEnvironment();
        const plugin = analyticsPlugin({ settings: { timeout: 5000 }, environment });

        expect(plugin.settings.timeout).toBe(5000);
      });

      it('should return undefined timeout when not provided', () => {
        const environment = createMockEnvironment();
        const plugin = analyticsPlugin({ settings: {}, environment });

        expect(plugin.settings.timeout).toBeUndefined();
      });

      it('should construct all custom settings correctly', () => {
        const environment = createMockEnvironment();
        const plugin = analyticsPlugin({
          settings: {
            cookieDomain: '.custom.com',
            cookieExpiryDays: 100,
            cookiePath: '/app',
            enableCookie: true,
            timeout: 3000,
          },
          environment,
        });

        expect(plugin.settings).toEqual({
          cookieSettings: {
            domain: '.custom.com',
            enableCookie: true,
            expiryDays: 100,
            name: {
              clientId: `${COOKIE_NAME_PREFIX}${CLIENT_ID_COOKIE_NAME}`,
            },
            path: '/app',
          },
          timeout: 3000,
        });
      });
    });
  });

  describe('getAnalyticsPlugin', () => {
    it('should return the analytics plugin from core settings', () => {
      const environment = createMockEnvironment();
      const plugin = analyticsPlugin({ settings: { enableCookie: true }, environment });
      mockCoreSettings.plugins.set(ANALYTICS_PLUGIN_NAME, plugin);

      const result = getAnalyticsPlugin();

      expect(result).toBe(plugin);
    });

    it('should throw an error when analytics plugin is not registered', () => {
      mockCoreSettings.plugins.clear();

      expect(() => getAnalyticsPlugin()).toThrow(
        `[IE-004] - You must first add "${ANALYTICS_PLUGIN_NAME}" to the "initContentSDK()" "plugins" array.`
      );
    });
  });

  describe('init', () => {
    it('should not call setClientId when enableCookie is false', async () => {
      const environment = createMockEnvironment();
      const plugin = analyticsPlugin({ settings: { enableCookie: false }, environment });
      mockCoreSettings.plugins.set(ANALYTICS_PLUGIN_NAME, plugin);

      await plugin.init();

      expect(mockSetClientId).not.toHaveBeenCalled();
    });

    it('should call setClientId when enableCookie is true and client ID does not exist', async () => {
      const environment = createMockEnvironment();
      mockGetClientId.mockReturnValue(null);
      mockSetClientId.mockResolvedValue(undefined);

      const plugin = analyticsPlugin({ settings: { enableCookie: true }, environment });
      mockCoreSettings.plugins.set(ANALYTICS_PLUGIN_NAME, plugin);

      await plugin.init();

      expect(mockSetClientId).toHaveBeenCalledTimes(1);
    });

    it('should call setClientId when enableCookie is true and getClientId returns empty string', async () => {
      const environment = createMockEnvironment();
      mockGetClientId.mockReturnValue('');
      mockSetClientId.mockResolvedValue(undefined);

      const plugin = analyticsPlugin({ settings: { enableCookie: true }, environment });
      mockCoreSettings.plugins.set(ANALYTICS_PLUGIN_NAME, plugin);

      await plugin.init();

      expect(mockSetClientId).toHaveBeenCalledTimes(1);
    });

    it('should not call setClientId when client ID exists and environment type is browser', async () => {
      const environment = createMockEnvironment('browser');
      mockGetClientId.mockReturnValue('existing-client-id');
      mockSetClientId.mockResolvedValue(undefined);

      const plugin = analyticsPlugin({ settings: { enableCookie: true }, environment });
      mockCoreSettings.plugins.set(ANALYTICS_PLUGIN_NAME, plugin);

      await plugin.init();

      expect(mockSetClientId).not.toHaveBeenCalled();
    });

    it('should call setClientId when client ID exists but environment type is not browser', async () => {
      const environment = createMockEnvironment('server');
      mockGetClientId.mockReturnValue('existing-client-id');
      mockSetClientId.mockResolvedValue(undefined);

      const plugin = analyticsPlugin({ settings: { enableCookie: true }, environment });
      mockCoreSettings.plugins.set(ANALYTICS_PLUGIN_NAME, plugin);

      await plugin.init();

      expect(mockSetClientId).toHaveBeenCalledTimes(1);
    });

    it('should set up window.scContentSDK when environment type is browser', async () => {
      const environment = createMockEnvironment('browser');
      mockGetClientId.mockReturnValue('existing-client-id');
      mockSetClientId.mockResolvedValue(undefined);

      const plugin = analyticsPlugin({ settings: { enableCookie: true }, environment });
      mockCoreSettings.plugins.set(ANALYTICS_PLUGIN_NAME, plugin);

      await plugin.init();

      expect(window.scContentSDK).toBeDefined();
      expect(window.scContentSDK.analytics_core).toBeDefined();
      expect(window.scContentSDK.analytics_core.getClientId).toBe(getClientIdModule.getClientId);
      expect(window.scContentSDK.analytics_core.settings).toEqual({
        siteName: 'test-site',
        contextId: 'test-context-id',
        edgeUrl: 'https://edge.test.com',
      });
      expect(window.scContentSDK.analytics_core.version).toBe(LIBRARY_VERSION);
    });

    it('should not set up window.scContentSDK when environment type is server', async () => {
      const environment = createMockEnvironment('server');
      mockGetClientId.mockReturnValue(null);
      mockSetClientId.mockResolvedValue(undefined);

      const plugin = analyticsPlugin({ settings: { enableCookie: true }, environment });
      mockCoreSettings.plugins.set(ANALYTICS_PLUGIN_NAME, plugin);

      await plugin.init();

      expect(window.scContentSDK).toBeUndefined();
    });

    it('should preserve existing window.scContentSDK properties when adding analytics-core', async () => {
      (window as any).scContentSDK = {
        'other-plugin': { version: '1.0.0' },
      };

      const environment = createMockEnvironment('browser');
      mockGetClientId.mockReturnValue('existing-client-id');
      mockSetClientId.mockResolvedValue(undefined);

      const plugin = analyticsPlugin({ settings: { enableCookie: true }, environment });
      mockCoreSettings.plugins.set(ANALYTICS_PLUGIN_NAME, plugin);

      await plugin.init();

      expect((window.scContentSDK as any)['other-plugin']).toEqual({ version: '1.0.0' });
      expect(window.scContentSDK.analytics_core).toBeDefined();
    });
  });
});
