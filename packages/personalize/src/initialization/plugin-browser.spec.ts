import { personalizeBrowserPlugin } from './plugin-browser';
import { PERSONALIZE_PLUGIN_NAME } from './const';
import { PACKAGE_VERSION } from '../consts';
import * as sharedModule from './shared';
import * as coreModule from '@sitecore-content-sdk/core';
import * as analyticsPluginModule from '@sitecore-content-sdk/analytics-core/internal';
import * as analyticsUtilsModule from '@sitecore-content-sdk/analytics-core/utils';
import * as getCdnUrlModule from '../web-personalization/get-cdn-url';
import * as getGuestIdModule from './get-guest-id';
import { PersonalizeEnvironment } from './types';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/core', () => ({
  getCoreSettings: jest.fn(),
}));

jest.mock('./shared', () => ({
  getPersonalizePlugin: jest.fn(),
}));

jest.mock('@sitecore-content-sdk/analytics-core/internal', () => ({
  ANALYTICS_PLUGIN_NAME: 'AnalyticsPlugin',
  COOKIE_NAME_PREFIX: 'sc_',
  CLIENT_ID_COOKIE_NAME: 'cid',
  getAnalyticsPlugin: jest.fn(),
}));

jest.mock('@sitecore-content-sdk/events/internal', () => ({
  EVENTS_PLUGIN_NAME: 'EventsPlugin',
}));

jest.mock('@sitecore-content-sdk/analytics-core/utils', () => ({
  appendScriptWithAttributes: jest.fn(),
}));

jest.mock('../web-personalization/get-cdn-url', () => ({
  getCdnUrl: jest.fn(),
}));

describe('personalizeBrowserPlugin', () => {
  const mockGetGuestId = jest.fn() as jest.Mock<PersonalizeEnvironment['getGuestId']>;
  const mockSetGuestId = jest.fn() as jest.Mock<PersonalizeEnvironment['setGuestId']>;

  const createMockEnvironment = (
    type: 'browser' | 'server' = 'browser'
  ): PersonalizeEnvironment => ({
    type,
    getGuestId: mockGetGuestId,
    setGuestId: mockSetGuestId,
  });

  const mockAnalyticsPlugin = {
    settings: {
      cookieSettings: {
        enableCookie: true,
        expiryDays: 730,
        domain: '.example.com',
        name: { clientId: 'sc_cid' },
      },
    },
  };

  const mockCoreSettings = {
    settings: {
      contextId: 'test-context-id',
      sitecoreEdgeUrl: 'https://edge.test.com',
      siteName: 'test-site',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (analyticsPluginModule.getAnalyticsPlugin as jest.Mock).mockReturnValue(mockAnalyticsPlugin);
    (coreModule.getCoreSettings as jest.Mock).mockReturnValue(mockCoreSettings);
    // Reset window.scCloudSDK
    if (typeof window !== 'undefined') {
      delete (window as any).scCloudSDK;
    }
  });

  describe('plugin creation', () => {
    it('should create a plugin with the correct name', () => {
      const environment = createMockEnvironment();
      const plugin = personalizeBrowserPlugin({ environment });

      expect(plugin.name).toBe(PERSONALIZE_PLUGIN_NAME);
    });

    it('should create a plugin with analytics plugin as dependency', () => {
      const environment = createMockEnvironment();
      const plugin = personalizeBrowserPlugin({ environment });

      expect(plugin.dependencies).toEqual(['AnalyticsPlugin']);
    });

    it('should create a plugin with analytics and events plugins as dependencies when webPersonalization is enabled', () => {
      const environment = createMockEnvironment();
      const plugin = personalizeBrowserPlugin({
        environment,
        settings: { webPersonalization: { async: true } },
      });

      expect(plugin.dependencies).toEqual(['AnalyticsPlugin', 'EventsPlugin']);
    });

    it('should create a plugin with the correct environment', () => {
      const environment = createMockEnvironment();
      const plugin = personalizeBrowserPlugin({ environment });

      expect(plugin.environment).toBe(environment);
    });

    it('should create a plugin with default settings when no settings provided', () => {
      const environment = createMockEnvironment();
      const plugin = personalizeBrowserPlugin({ environment });

      expect(plugin.settings).toEqual({
        enablePersonalizeCookie: false,
        webPersonalization: false,
        cookieSettings: {
          name: {
            guestId: 'sc_cid_personalize',
          },
        },
      });
    });

    it('should create a plugin with enablePersonalizeCookie true', () => {
      const environment = createMockEnvironment();
      const plugin = personalizeBrowserPlugin({
        environment,
        settings: { enablePersonalizeCookie: true },
      });

      expect(plugin.settings.enablePersonalizeCookie).toBe(true);
    });

    it('should create a plugin with enablePersonalizeCookie false', () => {
      const environment = createMockEnvironment();
      const plugin = personalizeBrowserPlugin({
        environment,
        settings: { enablePersonalizeCookie: false },
      });

      expect(plugin.settings.enablePersonalizeCookie).toBe(false);
    });

    it('should create a plugin with webPersonalization settings with defaults', () => {
      const environment = createMockEnvironment();
      const plugin = personalizeBrowserPlugin({
        environment,
        settings: { webPersonalization: {} },
      });

      expect(plugin.settings.webPersonalization).toEqual({
        async: true,
        defer: false,
        language: undefined,
      });
    });

    it('should create a plugin with custom webPersonalization settings', () => {
      const environment = createMockEnvironment();
      const plugin = personalizeBrowserPlugin({
        environment,
        settings: {
          webPersonalization: {
            async: false,
            defer: true,
            language: 'en',
          },
        },
      });

      expect(plugin.settings.webPersonalization).toEqual({
        async: false,
        defer: true,
        language: 'en',
      });
    });

    it('should have an init function', () => {
      const environment = createMockEnvironment();
      const plugin = personalizeBrowserPlugin({ environment });

      expect(typeof plugin.init).toBe('function');
    });
  });

  describe('init', () => {
    describe('setGuestId', () => {
      it('should call setGuestId when both enableCookie and enablePersonalizeCookie are true and guest ID does not exist', async () => {
        const environment = createMockEnvironment();
        mockGetGuestId.mockReturnValue('');
        mockSetGuestId.mockResolvedValue(undefined);

        const plugin = personalizeBrowserPlugin({
          environment,
          settings: { enablePersonalizeCookie: true },
        });

        (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(plugin);

        await plugin.init();

        expect(mockSetGuestId).toHaveBeenCalledTimes(1);
      });

      it('should call setGuestId when environment type is not browser even if guest ID exists', async () => {
        const environment = createMockEnvironment('server');
        mockGetGuestId.mockReturnValue('existing-guest-id');
        mockSetGuestId.mockResolvedValue(undefined);

        const plugin = personalizeBrowserPlugin({
          environment,
          settings: { enablePersonalizeCookie: true },
        });

        (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(plugin);

        await plugin.init();

        expect(mockSetGuestId).toHaveBeenCalledTimes(1);
      });

      it('should not call setGuestId when guest ID exists and environment type is browser', async () => {
        const environment = createMockEnvironment('browser');
        mockGetGuestId.mockReturnValue('existing-guest-id');

        const plugin = personalizeBrowserPlugin({
          environment,
          settings: { enablePersonalizeCookie: true },
        });

        (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(plugin);

        await plugin.init();

        expect(mockSetGuestId).not.toHaveBeenCalled();
      });

      it('should not call setGuestId when enableCookie is false', async () => {
        const environment = createMockEnvironment();

        const plugin = personalizeBrowserPlugin({
          environment,
          settings: { enablePersonalizeCookie: true },
        });

        (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(plugin);
        (analyticsPluginModule.getAnalyticsPlugin as jest.Mock).mockReturnValue({
          settings: {
            cookieSettings: {
              enableCookie: false,
            },
          },
        });

        await plugin.init();

        expect(mockSetGuestId).not.toHaveBeenCalled();
      });

      it('should not call setGuestId when enablePersonalizeCookie is false', async () => {
        const environment = createMockEnvironment();

        const plugin = personalizeBrowserPlugin({
          environment,
          settings: { enablePersonalizeCookie: false },
        });

        (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(plugin);

        await plugin.init();

        expect(mockSetGuestId).not.toHaveBeenCalled();
      });
    });

    describe('server-side rendering', () => {
      it('should return early when window is undefined', async () => {
        const originalWindow = global.window;
        // @ts-expect-error - simulating SSR environment
        delete global.window;

        const environment = createMockEnvironment();

        const plugin = personalizeBrowserPlugin({ environment });

        (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(plugin);

        await plugin.init();

        // Should not throw and should not try to set window.scCloudSDK
        expect(getCdnUrlModule.getCdnUrl).not.toHaveBeenCalled();

        global.window = originalWindow;
      });
    });

    describe('window.scCloudSDK setup', () => {
      it('should set up window.scCloudSDK with personalize properties', async () => {
        const environment = createMockEnvironment();

        const plugin = personalizeBrowserPlugin({ environment });

        (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(plugin);

        await plugin.init();

        expect(window.scCloudSDK).toBeDefined();
        expect(window.scCloudSDK.personalize).toBeDefined();
        expect(window.scCloudSDK.personalize.version).toBe(PACKAGE_VERSION);
        expect(window.scCloudSDK.personalize.settings).toEqual({});
      });

      it('should add getGuestId to window.scCloudSDK.analytics-core', async () => {
        const environment = createMockEnvironment();

        const plugin = personalizeBrowserPlugin({ environment });

        (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(plugin);

        await plugin.init();

        expect(window.scCloudSDK['analytics-core']).toBeDefined();
        expect(window.scCloudSDK['analytics-core'].getGuestId).toBe(getGuestIdModule.getGuestId);
      });

      it('should preserve existing window.scCloudSDK properties', async () => {
        (window as any).scCloudSDK = {
          'analytics-core': {
            getClientId: jest.fn(),
            version: '1.0.0',
          },
        };

        const environment = createMockEnvironment();

        const plugin = personalizeBrowserPlugin({ environment });

        (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(plugin);

        await plugin.init();

        expect((window.scCloudSDK as any)['analytics-core'].getClientId).toBeDefined();
        expect((window.scCloudSDK as any)['analytics-core'].version).toBe('1.0.0');
        expect(window.scCloudSDK['analytics-core'].getGuestId).toBe(getGuestIdModule.getGuestId);
      });
    });

    describe('webPersonalization', () => {
      it('should not load CDN script when webPersonalization is false', async () => {
        const environment = createMockEnvironment();

        const plugin = personalizeBrowserPlugin({
          environment,
          settings: { webPersonalization: false },
        });

        (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(plugin);

        await plugin.init();

        expect(getCdnUrlModule.getCdnUrl).not.toHaveBeenCalled();
        expect(analyticsUtilsModule.appendScriptWithAttributes).not.toHaveBeenCalled();
      });

      it('should load CDN script when webPersonalization is enabled and CDN URL is available', async () => {
        const environment = createMockEnvironment();
        (
          getCdnUrlModule.getCdnUrl as jest.Mock<typeof getCdnUrlModule.getCdnUrl>
        ).mockResolvedValue('https://cdn.test.com/script.js');

        const plugin = personalizeBrowserPlugin({
          environment,
          settings: { webPersonalization: { async: true } },
        });

        (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(plugin);

        await plugin.init();

        expect(getCdnUrlModule.getCdnUrl).toHaveBeenCalledWith(
          'test-context-id',
          'https://edge.test.com'
        );
        expect(analyticsUtilsModule.appendScriptWithAttributes).toHaveBeenCalledWith({
          async: true,
          src: 'https://cdn.test.com/script.js',
        });
      });

      it('should not load CDN script when CDN URL is not available', async () => {
        const environment = createMockEnvironment();
        (
          getCdnUrlModule.getCdnUrl as jest.Mock<typeof getCdnUrlModule.getCdnUrl>
        ).mockResolvedValue(null);

        const plugin = personalizeBrowserPlugin({
          environment,
          settings: { webPersonalization: { async: true } },
        });

        (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(plugin);

        await plugin.init();

        expect(getCdnUrlModule.getCdnUrl).toHaveBeenCalled();
        expect(analyticsUtilsModule.appendScriptWithAttributes).not.toHaveBeenCalled();
      });

      it('should set webPersonalization settings on window.scCloudSDK.personalize', async () => {
        const environment = createMockEnvironment();
        (
          getCdnUrlModule.getCdnUrl as jest.Mock<typeof getCdnUrlModule.getCdnUrl>
        ).mockResolvedValue('https://cdn.test.com/script.js');

        const plugin = personalizeBrowserPlugin({
          environment,
          settings: {
            webPersonalization: {
              async: false,
              defer: true,
            },
          },
        });

        (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(plugin);

        await plugin.init();

        expect(window.scCloudSDK.personalize.settings).toEqual({
          async: false,
          defer: true,
          language: undefined,
        });
      });
    });
  });
});
