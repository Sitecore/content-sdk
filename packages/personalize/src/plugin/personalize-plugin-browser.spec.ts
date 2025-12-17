/**
 * @jest-environment jsdom
 */
import {
  personalizePluginBrowser,
  getGuestId,
  PersonalizePluginSettings,
} from './personalize-plugin-browser';
import { PluginContext } from '@sitecore-content-sdk/core';
import { PACKAGE_NAME } from '../consts';

// Mock the core module
jest.mock('@sitecore-content-sdk/core', () => ({
  createPlugin: jest.fn((options) => ({
    ...options,
    settings: options.settings,
  })),
  trackingGroup: { name: 'tracking' },
}));

// Mock the personalize function
jest.mock('../personalization/personalize', () => ({ personalize: jest.fn() }));

describe('personalizePluginBrowser', () => {
  const mockConfig = {
    sitecoreContextId: 'test-context-id-12345',
    sitecoreEdgeUrl: 'https://edge.example.com',
  };

  const createMockContext = (overrides?: Partial<PluginContext>): PluginContext => ({
    config: mockConfig as PluginContext['config'],
    environment: {
      getCookie: jest.fn(),
      setCookie: jest.fn(),
    },
    getPlugin: jest.fn(),
    isReady: () => true,
    ready: async () => {},
    ...overrides,
  });

  beforeEach(() => {
    // Reset window.scCloudSDK before each test
    delete (window as any).scCloudSDK;
  });

  describe('plugin creation', () => {
    it('should create a plugin with the correct name', () => {
      const plugin = personalizePluginBrowser();

      expect(plugin.name).toBe(PACKAGE_NAME);
    });

    it('should use default settings when none provided', () => {
      const plugin = personalizePluginBrowser();
      const settings = plugin.settings as PersonalizePluginSettings;

      expect(settings?.debug).toBe(false);
      expect(settings?.webPersonalization).toBe(false);
      expect(settings?.enablePersonalizeCookie).toBe(false);
    });

    it('should merge custom settings with defaults', () => {
      const plugin = personalizePluginBrowser({
        debug: true,
        enablePersonalizeCookie: true,
      });
      const settings = plugin.settings as PersonalizePluginSettings;

      expect(settings?.debug).toBe(true);
      expect(settings?.enablePersonalizeCookie).toBe(true);
    });

    it('should include tracking group', () => {
      const plugin = personalizePluginBrowser();

      expect(plugin.groups).toBeDefined();
      expect(plugin.groups?.length).toBe(1);
      expect(plugin.groups?.[0].name).toBe('tracking');
    });

    it('should normalize webPersonalization boolean to object', () => {
      const plugin = personalizePluginBrowser({
        webPersonalization: true,
      });
      const settings = plugin.settings as PersonalizePluginSettings;

      expect(settings?.webPersonalization).toEqual({
        async: true,
        defer: false,
      });
    });

    it('should normalize webPersonalization object with defaults', () => {
      const plugin = personalizePluginBrowser({
        webPersonalization: { language: 'en' },
      });
      const settings = plugin.settings as PersonalizePluginSettings;

      expect(settings?.webPersonalization).toEqual({
        async: true,
        defer: false,
        language: 'en',
      });
    });
  });

  describe('validate', () => {
    it('should pass validation with Edge context ID', () => {
      const plugin = personalizePluginBrowser();
      const ctx = createMockContext();

      expect(() => plugin.validate?.(ctx)).not.toThrow();
    });

    it('should throw if no context ID is provided', () => {
      const plugin = personalizePluginBrowser();
      const ctx = createMockContext({
        config: {
          sitecoreContextId: '',
        } as PluginContext['config'],
      });

      expect(() => plugin.validate?.(ctx)).toThrow(
        /Personalize plugin requires a Sitecore context ID/
      );
    });
  });

  describe('deferredInit', () => {
    it('should expose personalize API on window.scCloudSDK.personalize', () => {
      const plugin = personalizePluginBrowser();

      plugin.deferredInit?.({} as PluginContext);

      expect(window.scCloudSDK).toBeDefined();
      expect(window.scCloudSDK?.personalize).toBeDefined();
      expect(window.scCloudSDK?.personalize?.version).toBeDefined();
      expect(window.scCloudSDK?.personalize?.personalize).toBeDefined();
    });

    it('should preserve existing window.scCloudSDK properties', () => {
      (window as any).scCloudSDK = { existingProperty: 'value' };

      const plugin = personalizePluginBrowser();

      plugin.deferredInit?.({} as PluginContext);

      expect((window.scCloudSDK as any)?.existingProperty).toBe('value');
      expect(window.scCloudSDK?.personalize).toBeDefined();
    });

    it('should add webPersonalization settings when enabled', () => {
      const plugin = personalizePluginBrowser({
        webPersonalization: true,
      });

      plugin.deferredInit?.({} as PluginContext);

      expect(window.scCloudSDK?.personalize?.settings).toEqual({
        async: true,
        defer: false,
      });
    });
  });

  describe('getGuestId', () => {
    it('should return guest ID from cookie', () => {
      const getCookieMock = jest.fn().mockReturnValue('my-guest-id');
      const ctx = createMockContext({
        environment: {
          getCookie: getCookieMock,
        },
      });

      const result = getGuestId(ctx, { guestIdCookieName: 'gid_test' });

      expect(getCookieMock).toHaveBeenCalledWith('gid_test');
      expect(result).toBe('my-guest-id');
    });

    it('should return undefined if cookie name not set', () => {
      const ctx = createMockContext();

      const result = getGuestId(ctx, {});

      expect(result).toBeUndefined();
    });
  });
});

