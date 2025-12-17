import * as coreInit from '@sitecore-content-sdk/core';
import { updateEventsSettings, isEventsEnabled } from './events-plugin-base';
import { PACKAGE_NAME } from '../consts';

// Mock the core init system
jest.mock('@sitecore-content-sdk/core', () => ({
  createPlugin: jest.fn((options) => options),
  updatePluginSettings: jest.fn(),
  isPluginEnabled: jest.fn(),
}));

describe('Events Settings Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateEventsSettings', () => {
    it('should call updatePluginSettings with the events package name', () => {
      const newSettings = { enabled: true, debug: true };

      updateEventsSettings(newSettings);

      expect(coreInit.updatePluginSettings).toHaveBeenCalledWith(PACKAGE_NAME, newSettings);
    });

    it('should pass partial settings correctly', () => {
      updateEventsSettings({ enabled: false });

      expect(coreInit.updatePluginSettings).toHaveBeenCalledWith(PACKAGE_NAME, { enabled: false });
    });

    it('should pass debug setting correctly', () => {
      updateEventsSettings({ debug: true });

      expect(coreInit.updatePluginSettings).toHaveBeenCalledWith(PACKAGE_NAME, { debug: true });
    });

    it('should pass browserIdCookieName setting correctly', () => {
      updateEventsSettings({ browserIdCookieName: 'custom_bid' });

      expect(coreInit.updatePluginSettings).toHaveBeenCalledWith(PACKAGE_NAME, {
        browserIdCookieName: 'custom_bid',
      });
    });

    it('should pass multiple settings at once', () => {
      updateEventsSettings({
        enabled: true,
        debug: false,
        browserIdCookieMaxAge: 86400,
      });

      expect(coreInit.updatePluginSettings).toHaveBeenCalledWith(PACKAGE_NAME, {
        enabled: true,
        debug: false,
        browserIdCookieMaxAge: 86400,
      });
    });
  });

  describe('isEventsEnabled', () => {
    it('should call isPluginEnabled with the events package name', () => {
      (coreInit.isPluginEnabled as jest.Mock).mockReturnValue(true);

      const result = isEventsEnabled();

      expect(coreInit.isPluginEnabled).toHaveBeenCalledWith(PACKAGE_NAME);
      expect(result).toBe(true);
    });

    it('should return false when plugin is disabled', () => {
      (coreInit.isPluginEnabled as jest.Mock).mockReturnValue(false);

      const result = isEventsEnabled();

      expect(result).toBe(false);
    });

    it('should return true when plugin is enabled', () => {
      (coreInit.isPluginEnabled as jest.Mock).mockReturnValue(true);

      const result = isEventsEnabled();

      expect(result).toBe(true);
    });
  });
});

