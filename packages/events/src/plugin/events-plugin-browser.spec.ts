/**
 * @jest-environment jsdom
 */
import { eventsPluginBrowser, getBrowserId } from './events-plugin-browser';
import { PluginContext } from '@sitecore-content-sdk/core';
import { PACKAGE_NAME } from '../consts';

// Mock the core module
jest.mock('@sitecore-content-sdk/core', () => ({
  createPlugin: jest.fn((options) => options),
  trackingGroup: { name: 'tracking' },
}));

// Mock the event functions
jest.mock('../events/custom-event/event', () => ({ event: jest.fn() }));
jest.mock('../events/custom-event/form', () => ({ form: jest.fn() }));
jest.mock('../events/identity/identity', () => ({ identity: jest.fn() }));
jest.mock('../events/page-view/page-view', () => ({ pageView: jest.fn() }));
jest.mock('../eventStorage/addToEventQueue', () => ({ addToEventQueue: jest.fn() }));
jest.mock('../eventStorage/clearEventQueue', () => ({ clearEventQueue: jest.fn() }));
jest.mock('../eventStorage/processEventQueue', () => ({ processEventQueue: jest.fn() }));

describe('eventsPluginBrowser', () => {
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
      const plugin = eventsPluginBrowser();

      expect(plugin.name).toBe(PACKAGE_NAME);
    });

    it('should use default settings when none provided', () => {
      const plugin = eventsPluginBrowser();

      expect(plugin.settings?.debug).toBe(false);
    });

    it('should merge custom settings with defaults', () => {
      const plugin = eventsPluginBrowser({
        debug: true,
      });

      expect(plugin.settings?.debug).toBe(true);
    });

    it('should include tracking group', () => {
      const plugin = eventsPluginBrowser();

      expect(plugin.groups).toBeDefined();
      expect(plugin.groups?.length).toBe(1);
      expect(plugin.groups?.[0].name).toBe('tracking');
    });
  });

  describe('validate', () => {
    it('should pass validation with Edge context ID', () => {
      const plugin = eventsPluginBrowser();
      const ctx = createMockContext();

      expect(() => plugin.validate?.(ctx)).not.toThrow();
    });

    it('should throw if no context ID is provided', () => {
      const plugin = eventsPluginBrowser();
      const ctx = createMockContext({
        config: {
          sitecoreContextId: '',
        } as PluginContext['config'],
      });

      expect(() => plugin.validate?.(ctx)).toThrow(/Events plugin requires a Sitecore context ID/);
    });
  });

  describe('deferredInit', () => {
    it('should expose events API on window.scCloudSDK.events', () => {
      const plugin = eventsPluginBrowser();

      plugin.deferredInit?.({} as PluginContext);

      expect(window.scCloudSDK).toBeDefined();
      expect(window.scCloudSDK?.events).toBeDefined();
      expect(window.scCloudSDK?.events?.version).toBeDefined();
      expect(window.scCloudSDK?.events?.pageView).toBeDefined();
      expect(window.scCloudSDK?.events?.identity).toBeDefined();
      expect(window.scCloudSDK?.events?.event).toBeDefined();
      expect(window.scCloudSDK?.events?.form).toBeDefined();
      expect(window.scCloudSDK?.events?.addToEventQueue).toBeDefined();
      expect(window.scCloudSDK?.events?.clearEventQueue).toBeDefined();
      expect(window.scCloudSDK?.events?.processEventQueue).toBeDefined();
    });

    it('should preserve existing window.scCloudSDK properties', () => {
      (window as any).scCloudSDK = { existingProperty: 'value' };

      const plugin = eventsPluginBrowser();

      plugin.deferredInit?.({} as PluginContext);

      expect((window.scCloudSDK as any)?.existingProperty).toBe('value');
      expect(window.scCloudSDK?.events).toBeDefined();
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

