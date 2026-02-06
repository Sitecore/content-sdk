import { personalizeBrowserAdapter } from './browser-adapter';
import * as sharedModule from './shared';
import * as coreModule from '@sitecore-content-sdk/core';
import * as analyticsPluginModule from '@sitecore-content-sdk/analytics-core/internal';
import * as internalModule from '@sitecore-content-sdk/analytics-core/internal';
import * as utilsModule from '@sitecore-content-sdk/analytics-core/utils';
import * as fetchProfileIdModule from '../profile-id/fetch-profile-id-from-edge-proxy';
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
  getAnalyticsPlugin: jest.fn(),
  getDefaultCookieAttributes: jest.fn(),
}));

jest.mock('@sitecore-content-sdk/analytics-core/utils', () => ({
  createCookieString: jest.fn(),
  getCookieValueClientSide: jest.fn(),
}));

jest.mock('../profile-id/fetch-profile-id-from-edge-proxy', () => ({
  fetchProfileIdFromEdgeProxy: jest.fn(),
}));

describe('personalizeBrowserAdapter', () => {
  const mockPersonalizePlugin = {
    options: {
      cookies: {
        name: 'sc_cid_personalize',
      },
    },
  };

  const mockAnalyticsPlugin = {
    options: {
      cookies: {
        expiryDays: 730,
        domain: '.example.com',
        name: 'sc_cid',
      },
      resolvedVisitorIds: undefined as any,
    },
  };

  const mockCoreContext = {
    config: {
      contextId: 'test-context-id',
      edgeUrl: 'https://edge.test.com',
    },
  };

  const mockCookieAttributes = {
    domain: '.example.com',
    maxAge: 63072000,
    path: '/',
    sameSite: 'None',
    secure: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAnalyticsPlugin.options.resolvedVisitorIds = undefined;
    (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(mockPersonalizePlugin);
    (analyticsPluginModule.getAnalyticsPlugin as jest.Mock).mockReturnValue(mockAnalyticsPlugin);
    (coreModule.getCoreContext as jest.Mock).mockReturnValue(mockCoreContext);
    (internalModule.getDefaultCookieAttributes as jest.Mock).mockReturnValue(mockCookieAttributes);
    // Reset document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  });

  it('should return an adapter with type "browser"', () => {
    const adapter = personalizeBrowserAdapter();

    expect(adapter.type).toBe('browser');
  });

  describe('getProfileId', () => {
    it('should return the profile ID from cookie', () => {
      (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue('profile-id-123');

      const adapter = personalizeBrowserAdapter();
      const result = adapter.getProfileId();

      expect(result).toBe('profile-id-123');
      expect(utilsModule.getCookieValueClientSide).toHaveBeenCalledWith('sc_cid_personalize');
    });

    it('should return empty string when cookie does not exist', () => {
      (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue('');

      const adapter = personalizeBrowserAdapter();
      const result = adapter.getProfileId();

      expect(result).toBe('');
    });
  });

  describe('setProfileId', () => {
    describe('legacy cookie migration', () => {
      it('should migrate legacy cookie and delete old cookie when legacy cookie exists', async () => {
        (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue('legacy-profile-id');
        (utilsModule.createCookieString as jest.Mock)
          .mockReturnValueOnce('sc_cid_personalize=legacy-profile-id')
          .mockReturnValueOnce('sc_test-context-id_personalize=; Max-Age=0');

        const adapter = personalizeBrowserAdapter();
        await adapter.setProfileId();

        expect(utilsModule.getCookieValueClientSide).toHaveBeenCalledWith(
          'sc_test-context-id_personalize'
        );
        expect(utilsModule.createCookieString).toHaveBeenCalledTimes(2);
        expect(utilsModule.createCookieString).toHaveBeenNthCalledWith(
          1,
          'sc_cid_personalize',
          'legacy-profile-id',
          mockCookieAttributes
        );
        expect(utilsModule.createCookieString).toHaveBeenNthCalledWith(
          2,
          'sc_test-context-id_personalize',
          '',
          { ...mockCookieAttributes, maxAge: 0 }
        );
        expect(fetchProfileIdModule.fetchProfileIdFromEdgeProxy).not.toHaveBeenCalled();
      });
    });

    describe('existing profile ID', () => {
      it('should return early when profile ID cookie already exists', async () => {
        (utilsModule.getCookieValueClientSide as jest.Mock)
          .mockReturnValueOnce('') // legacy cookie check
          .mockReturnValueOnce('existing-profile-id') // profile id check
          .mockReturnValueOnce('client-id'); // client id check

        const adapter = personalizeBrowserAdapter();
        await adapter.setProfileId();

        expect(fetchProfileIdModule.fetchProfileIdFromEdgeProxy).not.toHaveBeenCalled();
        expect(utilsModule.createCookieString).not.toHaveBeenCalled();
      });
    });

    describe('profile ID from proxy values', () => {
      it('should use profile ID from proxy values when available', async () => {
        mockAnalyticsPlugin.options.resolvedVisitorIds = { profileId: 'proxy-profile-id' };
        (utilsModule.getCookieValueClientSide as jest.Mock)
          .mockReturnValueOnce('') // legacy cookie
          .mockReturnValueOnce('') // profile id cookie
          .mockReturnValueOnce('client-id'); // client id
        (utilsModule.createCookieString as jest.Mock).mockReturnValue(
          'sc_cid_personalize=proxy-profile-id'
        );

        const adapter = personalizeBrowserAdapter();
        await adapter.setProfileId();

        expect(fetchProfileIdModule.fetchProfileIdFromEdgeProxy).not.toHaveBeenCalled();
        expect(utilsModule.createCookieString).toHaveBeenCalledWith(
          'sc_cid_personalize',
          'proxy-profile-id',
          mockCookieAttributes
        );
      });
    });

    describe('fetch from edge proxy', () => {
      it('should fetch profile ID from edge proxy when client ID exists and no proxy values', async () => {
        (utilsModule.getCookieValueClientSide as jest.Mock)
          .mockReturnValueOnce('') // legacy cookie
          .mockReturnValueOnce('') // profile id cookie
          .mockReturnValueOnce('client-id-123'); // client id
        jest
          .spyOn(fetchProfileIdModule, 'fetchProfileIdFromEdgeProxy')
          .mockResolvedValue('new-profile-id');

        (utilsModule.createCookieString as jest.Mock).mockReturnValue(
          'sc_cid_personalize=new-profile-id'
        );

        const adapter = personalizeBrowserAdapter();
        await adapter.setProfileId();

        expect(fetchProfileIdModule.fetchProfileIdFromEdgeProxy).toHaveBeenCalledWith(
          'client-id-123',
          'test-context-id',
          'https://edge.test.com'
        );
        expect(utilsModule.createCookieString).toHaveBeenCalledWith(
          'sc_cid_personalize',
          'new-profile-id',
          mockCookieAttributes
        );
      });

      it('should not fetch when client ID is empty', async () => {
        (utilsModule.getCookieValueClientSide as jest.Mock)
          .mockReturnValueOnce('') // legacy cookie
          .mockReturnValueOnce('') // profile id cookie
          .mockReturnValueOnce(''); // client id - empty
        const adapter = personalizeBrowserAdapter();
        await adapter.setProfileId();

        expect(fetchProfileIdModule.fetchProfileIdFromEdgeProxy).not.toHaveBeenCalled();
        expect(utilsModule.createCookieString).not.toHaveBeenCalled();
      });
    });

    it('should use correct cookie attributes from settings', async () => {
      (utilsModule.getCookieValueClientSide as jest.Mock)
        .mockReturnValueOnce('') // legacy cookie
        .mockReturnValueOnce('') // profile id cookie
        .mockReturnValueOnce('client-id'); // client id
      jest
        .spyOn(fetchProfileIdModule, 'fetchProfileIdFromEdgeProxy')
        .mockResolvedValue('profile-id');
      (utilsModule.createCookieString as jest.Mock).mockReturnValue('cookie-string');

      const adapter = personalizeBrowserAdapter();
      await adapter.setProfileId();

      expect(internalModule.getDefaultCookieAttributes).toHaveBeenCalledWith(730, '.example.com');
    });
  });
});
