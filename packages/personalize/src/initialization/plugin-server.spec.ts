import { personalizeServerPlugin } from './plugin-server';
import { PERSONALIZE_PLUGIN_NAME } from './const';
import * as sharedModule from './shared';
import * as analyticsPluginModule from '@sitecore-content-sdk/analytics-core/internal';
import { PersonalizeAdapter } from './types';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/core', () => ({
  getCoreContext: jest.fn(),
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

describe('personalizeServerPlugin', () => {
  const mockGetGuestId = jest.fn() as jest.Mock<PersonalizeAdapter['getGuestId']>;
  const mockSetGuestId = jest.fn() as jest.Mock<PersonalizeAdapter['setGuestId']>;

  const createMockAdapter = (): PersonalizeAdapter => ({
    type: 'server',
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

  beforeEach(() => {
    jest.clearAllMocks();
    (analyticsPluginModule.getAnalyticsPlugin as jest.Mock).mockReturnValue(mockAnalyticsPlugin);
  });

  describe('plugin creation', () => {
    it('should create a plugin with the correct name', () => {
      const adapter = createMockAdapter();
      const plugin = personalizeServerPlugin({ adapter });

      expect(plugin.name).toBe(PERSONALIZE_PLUGIN_NAME);
    });

    it('should create a plugin with analytics plugin as dependency', () => {
      const adapter = createMockAdapter();
      const plugin = personalizeServerPlugin({ adapter });

      expect(plugin.dependencies).toEqual(['AnalyticsPlugin']);
    });

    it('should create a plugin with the correct adapter', () => {
      const adapter = createMockAdapter();
      const plugin = personalizeServerPlugin({ adapter });

      expect(plugin.adapter).toBe(adapter);
    });

    it('should create a plugin with default settings when no settings provided', () => {
      const adapter = createMockAdapter();
      const plugin = personalizeServerPlugin({ adapter });

      expect(plugin.settings).toEqual({
        enablePersonalizeCookie: false,
        cookieSettings: {
          name: {
            guestId: 'sc_cid_personalize',
          },
        },
      });
    });

    it('should create a plugin with enablePersonalizeCookie true', () => {
      const adapter = createMockAdapter();
      const plugin = personalizeServerPlugin({
        adapter,
        settings: { enablePersonalizeCookie: true },
      });

      expect(plugin.settings.enablePersonalizeCookie).toBe(true);
    });

    it('should create a plugin with enablePersonalizeCookie false', () => {
      const adapter = createMockAdapter();
      const plugin = personalizeServerPlugin({
        adapter,
        settings: { enablePersonalizeCookie: false },
      });

      expect(plugin.settings.enablePersonalizeCookie).toBe(false);
    });

    it('should have an init function', () => {
      const adapter = createMockAdapter();
      const plugin = personalizeServerPlugin({ adapter });

      expect(typeof plugin.init).toBe('function');
    });
  });

  describe('init', () => {
    it('should call setGuestId when both enableCookie and enablePersonalizeCookie are true', async () => {
      const adapter = createMockAdapter();
      mockSetGuestId.mockResolvedValue(undefined);

      const plugin = personalizeServerPlugin({
        adapter,
        settings: { enablePersonalizeCookie: true },
      });

      (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(plugin);

      await plugin.init();

      expect(mockSetGuestId).toHaveBeenCalledTimes(1);
    });

    it('should not call setGuestId when enableCookie is false', async () => {
      const adapter = createMockAdapter();

      const plugin = personalizeServerPlugin({
        adapter,
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
      const adapter = createMockAdapter();

      const plugin = personalizeServerPlugin({
        adapter,
        settings: { enablePersonalizeCookie: false },
      });

      (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(plugin);

      await plugin.init();

      expect(mockSetGuestId).not.toHaveBeenCalled();
    });
  });
});
