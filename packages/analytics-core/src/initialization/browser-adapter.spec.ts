import * as pluginModule from './plugin';
import * as coreModule from '@sitecore-content-sdk/core';
import * as internalModule from '../internal';
import * as utilsModule from '../utils';
import * as deleteCookieModule from '../utils/cookies/delete-cookie';
import { COOKIE_NAME_PREFIX } from '../consts';
import { jest, expect } from '@jest/globals';
import { analyticsBrowserAdapter } from './browser-adapter';

jest.mock('@sitecore-content-sdk/core', () => ({
  getCoreContext: jest.fn(),
}));

jest.mock('./plugin', () => ({
  getAnalyticsPlugin: jest.fn(),
}));

jest.mock('../internal', () => ({
  COOKIE_NAME_PREFIX: 'sc_',
  fetchClientIdFromEdgeProxy: jest.fn(),
  getDefaultCookieAttributes: jest.fn(),
}));

jest.mock('../utils', () => ({
  createCookieString: jest.fn(),
  getCookieValueClientSide: jest.fn(),
}));

jest.mock('../utils/cookies/delete-cookie', () => ({
  deleteCookie: jest.fn(),
}));

describe('analyticsBrowserAdapter', () => {
  const mockAnalyticsOptions = {
    cookies: {
      name: 'sc_cid',
      expiryDays: 730,
      domain: '.example.com',
    },
    proxyValues: undefined as any,
  };

  const mockCoreContext = {
    config: {
      siteName: 'test-site',
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
    (pluginModule.getAnalyticsPlugin as jest.Mock).mockReturnValue({
      options: mockAnalyticsOptions,
    });
    (coreModule.getCoreContext as jest.Mock).mockReturnValue(mockCoreContext);
    (internalModule.getDefaultCookieAttributes as jest.Mock).mockReturnValue(mockCookieAttributes);
    // Reset document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  });

  it('should return an adapter with type "browser"', () => {
    const adapter = analyticsBrowserAdapter();

    expect(adapter.type).toBe('browser');
  });

  describe('getClientId', () => {
    it('should return the client ID from cookie', () => {
      (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue('client-id-123');

      const adapter = analyticsBrowserAdapter();
      const result = adapter.getClientId();

      expect(result).toBe('client-id-123');
      expect(utilsModule.getCookieValueClientSide).toHaveBeenCalledWith('sc_cid');
    });

    it('should return empty string when cookie does not exist', () => {
      (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue('');

      const adapter = analyticsBrowserAdapter();
      const result = adapter.getClientId();

      expect(result).toBe('');
    });

    it('should return null when getCookieValueClientSide returns null', () => {
      (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue(null);

      const adapter = analyticsBrowserAdapter();
      const result = adapter.getClientId();

      expect(result).toBeNull();
    });
  });

  describe('setClientId', () => {
    it('should migrate legacy cookie and delete old cookie when legacy cookie exists', async () => {
      (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue('legacy-client-id');
      (utilsModule.createCookieString as jest.Mock).mockReturnValue(
        'sc_cid=legacy-client-id; Max-Age=63072000'
      );

      const adapter = analyticsBrowserAdapter();
      await adapter.setClientId();

      expect(utilsModule.getCookieValueClientSide).toHaveBeenCalledWith(
        `${COOKIE_NAME_PREFIX}test-context-id`
      );
      expect(utilsModule.createCookieString).toHaveBeenCalledTimes(1);
      expect(utilsModule.createCookieString).toHaveBeenCalledWith(
        'sc_cid',
        'legacy-client-id',
        mockCookieAttributes
      );
      expect(deleteCookieModule.deleteCookie).toHaveBeenCalledWith(
        `${COOKIE_NAME_PREFIX}test-context-id`
      );
      expect(internalModule.fetchClientIdFromEdgeProxy).not.toHaveBeenCalled();
    });

    it('should fetch client ID from edge proxy when no legacy cookie exists', async () => {
      (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue('');
      (
        internalModule.fetchClientIdFromEdgeProxy as jest.Mock<
          typeof internalModule.fetchClientIdFromEdgeProxy
        >
      ).mockResolvedValue({
        clientId: 'new-client-id',
        guestId: 'client-key-123',
      });
      (utilsModule.createCookieString as jest.Mock).mockReturnValue(
        'sc_cid=new-client-id; Max-Age=63072000'
      );

      const adapter = analyticsBrowserAdapter();
      await adapter.setClientId();

      expect(internalModule.fetchClientIdFromEdgeProxy).toHaveBeenCalledWith(
        'https://edge.test.com',
        'test-context-id'
      );
      expect(utilsModule.createCookieString).toHaveBeenCalledWith(
        'sc_cid',
        'new-client-id',
        mockCookieAttributes
      );
    });

    it('should store proxy values in plugin settings after fetching from edge proxy', async () => {
      const proxyValues = {
        clientId: 'new-client-id',
        guestId: 'client-key-123',
      };
      (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue('');
      (
        internalModule.fetchClientIdFromEdgeProxy as jest.Mock<
          typeof internalModule.fetchClientIdFromEdgeProxy
        >
      ).mockResolvedValue(proxyValues);
      (utilsModule.createCookieString as jest.Mock).mockReturnValue('cookie-string');

      const adapter = analyticsBrowserAdapter();
      await adapter.setClientId();

      expect(mockAnalyticsOptions.proxyValues).toEqual(proxyValues);
    });

    it('should use correct cookie attributes from settings', async () => {
      (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue('');
      (
        internalModule.fetchClientIdFromEdgeProxy as jest.Mock<
          typeof internalModule.fetchClientIdFromEdgeProxy
        >
      ).mockResolvedValue({
        clientId: 'client-id',
        guestId: 'client-key-123',
      });
      (utilsModule.createCookieString as jest.Mock).mockReturnValue('cookie-string');

      const adapter = analyticsBrowserAdapter();
      await adapter.setClientId();

      expect(internalModule.getDefaultCookieAttributes).toHaveBeenCalledWith(730, '.example.com');
    });
  });

  describe('location.getSearchParams', () => {
    it('should return window.location.search', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '?param1=value1&param2=value2' },
        writable: true,
      });

      const adapter = analyticsBrowserAdapter();
      const result = adapter.location.getSearchParams();

      expect(result).toBe('?param1=value1&param2=value2');
    });

    it('should return empty string when no search params', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '' },
        writable: true,
      });

      const adapter = analyticsBrowserAdapter();
      const result = adapter.location.getSearchParams();

      expect(result).toBe('');
    });
  });
});
