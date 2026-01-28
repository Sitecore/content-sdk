import * as pluginModule from './plugin';
import * as coreModule from '@sitecore-content-sdk/core';
import * as internalModule from '../internal';
import * as utilsModule from '../utils';
import * as deleteCookieModule from '../utils/cookies/delete-cookie';
import { COOKIE_NAME_PREFIX } from '../consts';
import { jest, expect } from '@jest/globals';
import { analyticsBrowserEnvironment } from './environment-browser';

jest.mock('@sitecore-content-sdk/core', () => ({
  getCoreSettings: jest.fn(),
}));

jest.mock('./plugin', () => ({
  getAnalyticsPlugin: jest.fn(),
}));

jest.mock('../internal', () => ({
  COOKIE_NAME_PREFIX: 'sc_',
  fetchBrowserIdFromEdgeProxy: jest.fn(),
  getDefaultCookieAttributes: jest.fn(),
}));

jest.mock('../utils', () => ({
  createCookieString: jest.fn(),
  getCookieValueClientSide: jest.fn(),
}));

jest.mock('../utils/cookies/delete-cookie', () => ({
  deleteCookie: jest.fn(),
}));

describe('analyticsBrowserEnvironment', () => {
  const mockAnalyticsSettings = {
    cookieSettings: {
      name: { browserId: 'sc_cid' },
      expiryDays: 730,
      domain: '.example.com',
    },
    proxyValues: undefined as any,
  };

  const mockCoreSettings = {
    settings: {
      siteName: 'test-site',
      contextId: 'test-context-id',
      sitecoreEdgeUrl: 'https://edge.test.com',
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
      settings: mockAnalyticsSettings,
    });
    (coreModule.getCoreSettings as jest.Mock).mockReturnValue(mockCoreSettings);
    (internalModule.getDefaultCookieAttributes as jest.Mock).mockReturnValue(mockCookieAttributes);
    // Reset document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  });

  it('should return an environment with type "browser"', () => {
    const environment = analyticsBrowserEnvironment();

    expect(environment.type).toBe('browser');
  });

  describe('getBrowserId', () => {
    it('should return the browser ID from cookie', () => {
      (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue('browser-id-123');

      const environment = analyticsBrowserEnvironment();
      const result = environment.getBrowserId();

      expect(result).toBe('browser-id-123');
      expect(utilsModule.getCookieValueClientSide).toHaveBeenCalledWith('sc_cid');
    });

    it('should return empty string when cookie does not exist', () => {
      (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue('');

      const environment = analyticsBrowserEnvironment();
      const result = environment.getBrowserId();

      expect(result).toBe('');
    });

    it('should return null when getCookieValueClientSide returns null', () => {
      (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue(null);

      const environment = analyticsBrowserEnvironment();
      const result = environment.getBrowserId();

      expect(result).toBeNull();
    });
  });

  describe('setBrowserId', () => {
    it('should migrate legacy cookie and delete old cookie when legacy cookie exists', async () => {
      (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue('legacy-browser-id');
      (utilsModule.createCookieString as jest.Mock).mockReturnValue(
        'sc_cid=legacy-browser-id; Max-Age=63072000'
      );

      const environment = analyticsBrowserEnvironment();
      await environment.setBrowserId();

      expect(utilsModule.getCookieValueClientSide).toHaveBeenCalledWith(
        `${COOKIE_NAME_PREFIX}test-context-id`
      );
      expect(utilsModule.createCookieString).toHaveBeenCalledTimes(1);
      expect(utilsModule.createCookieString).toHaveBeenCalledWith(
        'sc_cid',
        'legacy-browser-id',
        mockCookieAttributes
      );
      expect(deleteCookieModule.deleteCookie).toHaveBeenCalledWith(
        `${COOKIE_NAME_PREFIX}test-context-id`
      );
      expect(internalModule.fetchBrowserIdFromEdgeProxy).not.toHaveBeenCalled();
    });

    it('should fetch browser ID from edge proxy when no legacy cookie exists', async () => {
      (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue('');
      (
        internalModule.fetchBrowserIdFromEdgeProxy as jest.Mock<
          typeof internalModule.fetchBrowserIdFromEdgeProxy
        >
      ).mockResolvedValue({
        browserId: 'new-browser-id',
        guestId: 'client-key-123',
      });
      (utilsModule.createCookieString as jest.Mock).mockReturnValue(
        'sc_cid=new-browser-id; Max-Age=63072000'
      );

      const environment = analyticsBrowserEnvironment();
      await environment.setBrowserId();

      expect(internalModule.fetchBrowserIdFromEdgeProxy).toHaveBeenCalledWith(
        'https://edge.test.com',
        'test-context-id'
      );
      expect(utilsModule.createCookieString).toHaveBeenCalledWith(
        'sc_cid',
        'new-browser-id',
        mockCookieAttributes
      );
    });

    it('should store proxy values in plugin settings after fetching from edge proxy', async () => {
      const proxyValues = {
        browserId: 'new-browser-id',
        guestId: 'client-key-123',
      };
      (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue('');
      (
        internalModule.fetchBrowserIdFromEdgeProxy as jest.Mock<
          typeof internalModule.fetchBrowserIdFromEdgeProxy
        >
      ).mockResolvedValue(proxyValues);
      (utilsModule.createCookieString as jest.Mock).mockReturnValue('cookie-string');

      const environment = analyticsBrowserEnvironment();
      await environment.setBrowserId();

      expect(mockAnalyticsSettings.proxyValues).toEqual(proxyValues);
    });

    it('should use correct cookie attributes from settings', async () => {
      (utilsModule.getCookieValueClientSide as jest.Mock).mockReturnValue('');
      (
        internalModule.fetchBrowserIdFromEdgeProxy as jest.Mock<
          typeof internalModule.fetchBrowserIdFromEdgeProxy
        >
      ).mockResolvedValue({
        browserId: 'browser-id',
        guestId: 'client-key-123',
      });
      (utilsModule.createCookieString as jest.Mock).mockReturnValue('cookie-string');

      const environment = analyticsBrowserEnvironment();
      await environment.setBrowserId();

      expect(internalModule.getDefaultCookieAttributes).toHaveBeenCalledWith(730, '.example.com');
    });
  });

  describe('location.getSearchParams', () => {
    it('should return window.location.search', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '?param1=value1&param2=value2' },
        writable: true,
      });

      const environment = analyticsBrowserEnvironment();
      const result = environment.location.getSearchParams();

      expect(result).toBe('?param1=value1&param2=value2');
    });

    it('should return empty string when no search params', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '' },
        writable: true,
      });

      const environment = analyticsBrowserEnvironment();
      const result = environment.location.getSearchParams();

      expect(result).toBe('');
    });
  });
});

