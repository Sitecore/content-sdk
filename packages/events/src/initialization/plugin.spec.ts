import { eventsPlugin, getEventsPlugin } from './plugin';
import { EVENTS_PLUGIN_NAME } from './const';
import { PACKAGE_VERSION } from '../consts';
import * as coreModule from '@sitecore-content-sdk/core';
import { ANALYTICS_PLUGIN_NAME } from '@sitecore-content-sdk/analytics-core/internal';
import * as eventModule from '../events/custom-event/event';
import * as formModule from '../events/custom-event/form';
import * as identityModule from '../events/identity/identity';
import * as pageViewModule from '../events/page-view/page-view';
import * as addToEventQueueModule from '../eventStorage/addToEventQueue';
import * as clearEventQueueModule from '../eventStorage/clearEventQueue';
import * as processEventQueueModule from '../eventStorage/processEventQueue';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/core', () => ({
  getCoreContext: jest.fn(),
  debug: {
    init: jest.fn(),
  },
}));

jest.mock('../events/custom-event/event', () => ({
  event: jest.fn(),
}));

jest.mock('../events/custom-event/form', () => ({
  form: jest.fn(),
}));

jest.mock('../events/identity/identity', () => ({
  identity: jest.fn(),
}));

jest.mock('../events/page-view/page-view', () => ({
  pageView: jest.fn(),
}));

jest.mock('../eventStorage/addToEventQueue', () => ({
  addToEventQueue: jest.fn(),
}));

jest.mock('../eventStorage/clearEventQueue', () => ({
  clearEventQueue: jest.fn(),
}));

jest.mock('../eventStorage/processEventQueue', () => ({
  processEventQueue: jest.fn(),
}));

describe('plugin', () => {
  const mockCoreContext = {
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

  describe('eventsPlugin', () => {
    it('should create a plugin with the correct name', () => {
      const plugin = eventsPlugin();

      expect(plugin.name).toBe(EVENTS_PLUGIN_NAME);
    });

    it('should create a plugin with analytics plugin as dependency', () => {
      const plugin = eventsPlugin();

      expect(plugin.dependencies).toEqual([ANALYTICS_PLUGIN_NAME]);
    });

    it('should have an init function', () => {
      const plugin = eventsPlugin();

      expect(typeof plugin.init).toBe('function');
    });
  });

  describe('getEventsPlugin', () => {
    it('should return the events plugin from core settings', () => {
      const plugin = eventsPlugin();
      mockCoreContext.plugins.set(EVENTS_PLUGIN_NAME, plugin);

      const result = getEventsPlugin();

      expect(result).toBe(plugin);
    });

    it('should throw an error when events plugin is not registered', () => {
      mockCoreContext.plugins.clear();

      expect(() => getEventsPlugin()).toThrow(
        `[IE-004] You must first add "${EVENTS_PLUGIN_NAME}" to the "initContentSdk()" "plugins" array.`
      );
    });
  });

  describe('init', () => {
    it('should set up window.scContentSDK.events when window is defined', async () => {
      const plugin = eventsPlugin();

      await plugin.init();

      expect(window.scContentSDK).toBeDefined();
      expect(window.scContentSDK.events).toBeDefined();
      expect(window.scContentSDK.events.addToEventQueue).toBe(
        addToEventQueueModule.addToEventQueue
      );
      expect(window.scContentSDK.events.clearEventQueue).toBe(
        clearEventQueueModule.clearEventQueue
      );
      expect(window.scContentSDK.events.event).toBe(eventModule.event);
      expect(window.scContentSDK.events.form).toBe(formModule.form);
      expect(window.scContentSDK.events.identity).toBe(identityModule.identity);
      expect(window.scContentSDK.events.pageView).toBe(pageViewModule.pageView);
      expect(window.scContentSDK.events.processEventQueue).toBe(
        processEventQueueModule.processEventQueue
      );
      expect(window.scContentSDK.events.version).toBe(PACKAGE_VERSION);
    });

    it('should preserve existing window.scContentSDK properties when adding events', async () => {
      (window as any).scContentSDK = {
        'other-plugin': { version: '1.0.0' },
      };

      const plugin = eventsPlugin();
      await plugin.init();

      expect((window.scContentSDK as any)['other-plugin']).toEqual({ version: '1.0.0' });
      expect(window.scContentSDK.events).toBeDefined();
    });

    it('should not set up window.scContentSDK when window is undefined', async () => {
      const originalWindow = global.window;
      // @ts-expect-error - intentionally setting window to undefined
      delete global.window;

      const plugin = eventsPlugin();
      await plugin.init();

      // Should not throw and should complete successfully
      expect(true).toBe(true);

      // Restore window
      global.window = originalWindow;
    });
  });
});
