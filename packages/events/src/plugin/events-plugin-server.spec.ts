import { eventsPluginServer, getBrowserId } from './events-plugin-server';
import { PluginContext } from '@sitecore-content-sdk/core';
import { PACKAGE_NAME } from '../consts';

// Mock the core module
jest.mock('@sitecore-content-sdk/core', () => ({
  createPlugin: jest.fn((options) => options),
  trackingGroup: { name: 'tracking' },
}));

describe('eventsPluginServer', () => {
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
      const plugin = eventsPluginServer();

      expect(plugin.name).toBe(PACKAGE_NAME);
    });

    it('should use default settings when none provided', () => {
      const plugin = eventsPluginServer();

      expect(plugin.settings?.debug).toBe(false);
    });

    it('should merge custom settings with defaults', () => {
      const plugin = eventsPluginServer({
        debug: true,
      });

      expect(plugin.settings?.debug).toBe(true);
    });

    it('should include tracking group', () => {
      const plugin = eventsPluginServer();

      expect(plugin.groups).toBeDefined();
      expect(plugin.groups?.length).toBe(1);
      expect(plugin.groups?.[0].name).toBe('tracking');
    });
  });

  describe('validate', () => {
    it('should pass validation with Edge context ID', () => {
      const plugin = eventsPluginServer();
      const ctx = createMockContext();

      expect(() => plugin.validate?.(ctx)).not.toThrow();
    });

    it('should throw if no context ID is provided', () => {
      const plugin = eventsPluginServer();
      const ctx = createMockContext({
        config: {
          sitecoreContextId: '',
        } as PluginContext['config'],
      });

      expect(() => plugin.validate?.(ctx)).toThrow(/Events plugin requires a Sitecore context ID/);
    });
  });

  describe('getBrowserId', () => {
    it('should return browser ID from cookie', () => {
      const getCookieMock = jest.fn().mockReturnValue('my-browser-id');
      const ctx = createMockContext({
        environment: {
          getCookie: getCookieMock,
        },
      });

      const result = getBrowserId(ctx, { browserIdCookieName: 'bid_test' });

      expect(getCookieMock).toHaveBeenCalledWith('bid_test');
      expect(result).toBe('my-browser-id');
    });

    it('should return undefined if cookie name not set', () => {
      const ctx = createMockContext();

      const result = getBrowserId(ctx, {});

      expect(result).toBeUndefined();
    });
  });
});

