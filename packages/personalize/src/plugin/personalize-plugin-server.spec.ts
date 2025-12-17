import {
  personalizePluginServer,
  getGuestId,
  PersonalizePluginSettings,
} from './personalize-plugin-server';
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

describe('personalizePluginServer', () => {
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

  describe('plugin creation', () => {
    it('should create a plugin with the correct name', () => {
      const plugin = personalizePluginServer();

      expect(plugin.name).toBe(PACKAGE_NAME);
    });

    it('should use default settings when none provided', () => {
      const plugin = personalizePluginServer();
      const settings = plugin.settings as PersonalizePluginSettings;

      expect(settings?.debug).toBe(false);
      expect(settings?.enablePersonalizeCookie).toBe(false);
    });

    it('should merge custom settings with defaults', () => {
      const plugin = personalizePluginServer({
        debug: true,
        guestIdCookieName: 'custom_gid',
      });
      const settings = plugin.settings as PersonalizePluginSettings;

      expect(settings?.debug).toBe(true);
      expect(settings?.guestIdCookieName).toBe('custom_gid');
    });

    it('should include tracking group', () => {
      const plugin = personalizePluginServer();

      expect(plugin.groups).toBeDefined();
      expect(plugin.groups?.length).toBe(1);
      expect(plugin.groups?.[0].name).toBe('tracking');
    });
  });

  describe('validate', () => {
    it('should pass validation with Edge context ID', () => {
      const plugin = personalizePluginServer();
      const ctx = createMockContext();

      expect(() => plugin.validate?.(ctx)).not.toThrow();
    });

    it('should throw if no context ID is provided', () => {
      const plugin = personalizePluginServer();
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

