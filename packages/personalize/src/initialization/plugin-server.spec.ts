import { personalizeServerPlugin } from './plugin-server';
import { PERSONALIZE_PLUGIN_NAME } from './const';
import * as sharedModule from './shared';
import * as analyticsPluginModule from '@sitecore-content-sdk/analytics-core/internal';
import { PersonalizeAdapter } from './types';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/core', () => ({
  getCoreContext: jest.fn(),
  debugModule: jest.fn(() => jest.fn()),
  debugNamespace: 'content-sdk',
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
  const mockGetProfileId = jest.fn() as jest.Mock<PersonalizeAdapter['getProfileId']>;
  const mockSetProfileId = jest.fn() as jest.Mock<PersonalizeAdapter['setProfileId']>;

  const createMockAdapter = (): PersonalizeAdapter => ({
    type: 'server',
    getProfileId: mockGetProfileId,
    setProfileId: mockSetProfileId,
  });

  const mockAnalyticsPlugin = {
    options: {
      cookies: {
        enabled: true,
        expiryDays: 730,
        domain: '.example.com',
        name: 'sc_cid',
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

      expect(plugin.options).toEqual({
        cookies: {
          enabled: false,
          name: 'sc_cid_personalize',
        },
      });
    });

    it('should create a plugin with enablePersonalizeCookie true', () => {
      const adapter = createMockAdapter();
      const plugin = personalizeServerPlugin({
        adapter,
        options: { enablePersonalizeCookie: true },
      });

      expect(plugin.options.cookies.enabled).toBe(true);
    });

    it('should create a plugin with enablePersonalizeCookie false', () => {
      const adapter = createMockAdapter();
      const plugin = personalizeServerPlugin({
        adapter,
        options: { enablePersonalizeCookie: false },
      });

      expect(plugin.options.cookies.enabled).toBe(false);
    });

    it('should have an init function', () => {
      const adapter = createMockAdapter();
      const plugin = personalizeServerPlugin({ adapter });

      expect(typeof plugin.init).toBe('function');
    });
  });

  describe('init', () => {
    it('should call setProfileId when both enableCookie and enablePersonalizeCookie are true', async () => {
      const adapter = createMockAdapter();
      mockSetProfileId.mockResolvedValue(undefined);

      const plugin = personalizeServerPlugin({
        adapter,
        options: { enablePersonalizeCookie: true },
      });

      (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(plugin);

      await plugin.init();

      expect(mockSetProfileId).toHaveBeenCalledTimes(1);
    });

    it('should not call setProfileId when enableCookie is false', async () => {
      const adapter = createMockAdapter();

      const plugin = personalizeServerPlugin({
        adapter,
        options: { enablePersonalizeCookie: true },
      });

      (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(plugin);
      (analyticsPluginModule.getAnalyticsPlugin as jest.Mock).mockReturnValue({
        options: {
          cookies: {
            enableCookie: false,
          },
        },
      });

      await plugin.init();

      expect(mockSetProfileId).not.toHaveBeenCalled();
    });

    it('should not call setProfileId when enablePersonalizeCookie is false', async () => {
      const adapter = createMockAdapter();

      const plugin = personalizeServerPlugin({
        adapter,
        options: { enablePersonalizeCookie: false },
      });

      (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(plugin);

      await plugin.init();

      expect(mockSetProfileId).not.toHaveBeenCalled();
    });
  });
});
