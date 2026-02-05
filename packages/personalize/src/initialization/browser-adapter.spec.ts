import { personalizeBrowserAdapter } from './browser-adapter';
import * as sharedModule from './shared';
import * as coreModule from '@sitecore-content-sdk/core';
import * as analyticsPluginModule from '@sitecore-content-sdk/analytics-core/internal';
import * as internalModule from '@sitecore-content-sdk/analytics-core/internal';
import * as utilsModule from '@sitecore-content-sdk/analytics-core/utils';
import * as fetchGuestIdModule from '../guest-id/fetch-guest-id-from-edge-proxy';
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
  getAnalyticsPlugin: jest.fn(),
  getDefaultCookieAttributes: jest.fn(),
}));

jest.mock('@sitecore-content-sdk/analytics-core/utils', () => ({
  createCookieString: jest.fn(),
  getCookieValueClientSide: jest.fn(),
}));

jest.mock('../guest-id/fetch-guest-id-from-edge-proxy', () => ({
  fetchGuestIdFromEdgeProxy: jest.fn(),
}));

describe('personalizeBrowserAdapter', () => {
  const mockPersonalizePlugin = {
    settings: {
      cookieSettings: {
        name: { guestId: 'sc_cid_personalize' },
      },
    },
  };

  const mockAnalyticsPlugin = {
    settings: {
      cookieSettings: {
        expiryDays: 730,
        domain: '.example.com',
        name: { clientId: 'sc_cid' },
      },
      proxyValues: undefined as any,
    },
  };

  const mockCoreContext = {
    settings: {
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
    mockAnalyticsPlugin.settings.proxyValues = undefined;
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

  describe('getGuestId', () => {
    it('should return the guest ID from cookie', () => {
      (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue('guest-id-123');

      const adapter = personalizeBrowserAdapter();
      const result = adapter.getGuestId();

      expect(result).toBe('guest-id-123');
      expect(utilsModule.getCookieValueClientSide).toHaveBeenCalledWith('sc_cid_personalize');
    });

    it('should return empty string when cookie does not exist', () => {
      (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue('');

      const adapter = personalizeBrowserAdapter();
      const result = adapter.getGuestId();

      expect(result).toBe('');
    });
  });

  describe('setGuestId', () => {
    describe('legacy cookie migration', () => {
      it('should migrate legacy cookie and delete old cookie when legacy cookie exists', async () => {
        (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue('legacy-guest-id');
        (utilsModule.createCookieString as jest.Mock)
          .mockReturnValueOnce('sc_cid_personalize=legacy-guest-id')
          .mockReturnValueOnce('sc_test-context-id_personalize=; Max-Age=0');

        const adapter = personalizeBrowserAdapter();
        await adapter.setGuestId();

        expect(utilsModule.getCookieValueClientSide).toHaveBeenCalledWith(
          'sc_test-context-id_personalize'
        );
        expect(utilsModule.createCookieString).toHaveBeenCalledTimes(2);
        expect(utilsModule.createCookieString).toHaveBeenNthCalledWith(
          1,
          'sc_cid_personalize',
          'legacy-guest-id',
          mockCookieAttributes
        );
        expect(utilsModule.createCookieString).toHaveBeenNthCalledWith(
          2,
          'sc_test-context-id_personalize',
          '',
          { ...mockCookieAttributes, maxAge: 0 }
        );
        expect(fetchGuestIdModule.fetchGuestIdFromEdgeProxy).not.toHaveBeenCalled();
      });
    });

    describe('existing guest ID', () => {
      it('should return early when guest ID cookie already exists', async () => {
        (utilsModule.getCookieValueClientSide as jest.Mock)
          .mockReturnValueOnce('') // legacy cookie check
          .mockReturnValueOnce('existing-guest-id') // guest id check
          .mockReturnValueOnce('client-id'); // client id check

        const adapter = personalizeBrowserAdapter();
        await adapter.setGuestId();

        expect(fetchGuestIdModule.fetchGuestIdFromEdgeProxy).not.toHaveBeenCalled();
        expect(utilsModule.createCookieString).not.toHaveBeenCalled();
      });
    });

    describe('guest ID from proxy values', () => {
      it('should use guest ID from proxy values when available', async () => {
        mockAnalyticsPlugin.settings.proxyValues = { guestId: 'proxy-guest-id' };
        (utilsModule.getCookieValueClientSide as jest.Mock)
          .mockReturnValueOnce('') // legacy cookie
          .mockReturnValueOnce('') // guest id cookie
          .mockReturnValueOnce('client-id'); // client id
        (utilsModule.createCookieString as jest.Mock).mockReturnValue(
          'sc_cid_personalize=proxy-guest-id'
        );

        const adapter = personalizeBrowserAdapter();
        await adapter.setGuestId();

        expect(fetchGuestIdModule.fetchGuestIdFromEdgeProxy).not.toHaveBeenCalled();
        expect(utilsModule.createCookieString).toHaveBeenCalledWith(
          'sc_cid_personalize',
          'proxy-guest-id',
          mockCookieAttributes
        );
      });
    });

    describe('fetch from edge proxy', () => {
      it('should fetch guest ID from edge proxy when client ID exists and no proxy values', async () => {
        (utilsModule.getCookieValueClientSide as jest.Mock)
          .mockReturnValueOnce('') // legacy cookie
          .mockReturnValueOnce('') // guest id cookie
          .mockReturnValueOnce('client-id-123'); // client id
        jest
          .spyOn(fetchGuestIdModule, 'fetchGuestIdFromEdgeProxy')
          .mockResolvedValue('new-guest-id');

        (utilsModule.createCookieString as jest.Mock).mockReturnValue(
          'sc_cid_personalize=new-guest-id'
        );

        const adapter = personalizeBrowserAdapter();
        await adapter.setGuestId();

        expect(fetchGuestIdModule.fetchGuestIdFromEdgeProxy).toHaveBeenCalledWith(
          'client-id-123',
          'test-context-id',
          'https://edge.test.com'
        );
        expect(utilsModule.createCookieString).toHaveBeenCalledWith(
          'sc_cid_personalize',
          'new-guest-id',
          mockCookieAttributes
        );
      });

      it('should not fetch when client ID is empty', async () => {
        (utilsModule.getCookieValueClientSide as jest.Mock)
          .mockReturnValueOnce('') // legacy cookie
          .mockReturnValueOnce('') // guest id cookie
          .mockReturnValueOnce(''); // client id - empty
        const adapter = personalizeBrowserAdapter();
        await adapter.setGuestId();

        expect(fetchGuestIdModule.fetchGuestIdFromEdgeProxy).not.toHaveBeenCalled();
        expect(utilsModule.createCookieString).not.toHaveBeenCalled();
      });
    });

    it('should use correct cookie attributes from settings', async () => {
      (utilsModule.getCookieValueClientSide as jest.Mock)
        .mockReturnValueOnce('') // legacy cookie
        .mockReturnValueOnce('') // guest id cookie
        .mockReturnValueOnce('client-id'); // client id
      jest.spyOn(fetchGuestIdModule, 'fetchGuestIdFromEdgeProxy').mockResolvedValue('guest-id');
      (utilsModule.createCookieString as jest.Mock).mockReturnValue('cookie-string');

      const adapter = personalizeBrowserAdapter();
      await adapter.setGuestId();

      expect(internalModule.getDefaultCookieAttributes).toHaveBeenCalledWith(730, '.example.com');
    });
  });
});
