import { analyticsServerEnvironment } from './environment-server';
import * as pluginModule from './plugin';
import * as coreModule from '@sitecore-content-sdk/core';
import * as internalModule from '../internal';
import * as utilsModule from '../utils';
import { COOKIE_NAME_PREFIX } from '../consts';
import type { IncomingMessage, OutgoingMessage } from 'http';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/core', () => ({
  getCoreSettings: jest.fn(),
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
  getCookieServerSide: jest.fn(),
}));

describe('analyticsServerEnvironment', () => {
  const mockAnalyticsSettings = {
    cookieSettings: {
      name: { clientId: 'sc_cid' },
      expiryDays: 730,
      domain: '.example.com',
    },
    timeout: 3000,
    proxyValues: undefined as any,
  };

  const mockCoreSettings = {
    settings: {
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

  const createMockRequest = (cookies?: string, url = '/test-page?query=value'): IncomingMessage => {
    return {
      headers: {
        cookie: cookies,
      },
      url,
    } as unknown as IncomingMessage;
  };

  const createMockResponse = (): OutgoingMessage & {
    headers: Record<string, string | string[]>;
  } => {
    const headers: Record<string, string | string[]> = {};
    return {
      headers,
      setHeader: jest.fn((name: string, value: string | string[]) => {
        headers[name] = value;
      }),
      getHeader: jest.fn((name: string) => headers[name]),
    } as unknown as OutgoingMessage & { headers: Record<string, string | string[]> };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAnalyticsSettings.proxyValues = undefined;
    (pluginModule.getAnalyticsPlugin as jest.Mock).mockReturnValue({
      settings: mockAnalyticsSettings,
    });
    (coreModule.getCoreSettings as jest.Mock).mockReturnValue(mockCoreSettings);
    (internalModule.getDefaultCookieAttributes as jest.Mock).mockReturnValue(mockCookieAttributes);
  });

  it('should return an environment with type "server"', () => {
    const request = createMockRequest();
    const response = createMockResponse();

    const environment = analyticsServerEnvironment(request, response);

    expect(environment.type).toBe('server');
  });

  describe('getClientId', () => {
    it('should return the client ID from request cookies', () => {
      (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue({
        name: 'sc_cid',
        value: 'client-id-123',
      });
      const request = createMockRequest('sc_cid=client-id-123');
      const response = createMockResponse();

      const environment = analyticsServerEnvironment(request, response);
      const result = environment.getClientId();

      expect(result).toBe('client-id-123');
      expect(utilsModule.getCookieServerSide).toHaveBeenCalledWith(
        'sc_cid=client-id-123',
        'sc_cid'
      );
    });

    it('should return null when cookie does not exist', () => {
      (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue(undefined);
      const request = createMockRequest();
      const response = createMockResponse();

      const environment = analyticsServerEnvironment(request, response);
      const result = environment.getClientId();

      expect(result).toBeNull();
    });

    it('should return null when cookie value is undefined', () => {
      (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue({ name: 'sc_cid' });
      const request = createMockRequest('sc_cid=');
      const response = createMockResponse();

      const environment = analyticsServerEnvironment(request, response);
      const result = environment.getClientId();

      expect(result).toBeNull();
    });
  });

  describe('setClientId', () => {
    describe('legacy cookie migration', () => {
      it('should migrate legacy cookie and set new cookie in response', async () => {
        const legacyCookieName = `${COOKIE_NAME_PREFIX}test-context-id`;
        (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue({
          name: legacyCookieName,
          value: 'legacy-client-id',
        });
        (utilsModule.createCookieString as jest.Mock)
          .mockReturnValueOnce('sc_cid=legacy-client-id; Max-Age=63072000')
          .mockReturnValueOnce(`${legacyCookieName}=; Max-Age=0`);

        const request = createMockRequest(`${legacyCookieName}=legacy-client-id`);
        const response = createMockResponse();

        const environment = analyticsServerEnvironment(request, response);
        await environment.setClientId();

        expect(utilsModule.getCookieServerSide).toHaveBeenCalledWith(
          `${legacyCookieName}=legacy-client-id`,
          legacyCookieName
        );
        expect(utilsModule.createCookieString).toHaveBeenCalledTimes(2);
        expect(response.setHeader).toHaveBeenCalledWith('Set-Cookie', [
          'sc_cid=legacy-client-id; Max-Age=63072000',
          `${legacyCookieName}=; Max-Age=0`,
        ]);
      });

      it('should replace legacy cookie name in request headers', async () => {
        const legacyCookieName = `${COOKIE_NAME_PREFIX}test-context-id`;
        (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue({
          name: legacyCookieName,
          value: 'legacy-client-id',
        });
        (utilsModule.createCookieString as jest.Mock)
          .mockReturnValueOnce('new-cookie')
          .mockReturnValueOnce('delete-cookie');

        const request = createMockRequest(`${legacyCookieName}=legacy-client-id`);
        const response = createMockResponse();

        const environment = analyticsServerEnvironment(request, response);
        await environment.setClientId();

        expect(request.headers.cookie).toBe('sc_cid=legacy-client-id');
      });

      it('should not fetch from edge proxy when legacy cookie exists', async () => {
        (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue({
          name: 'legacy-cookie',
          value: 'legacy-client-id',
        });
        (utilsModule.createCookieString as jest.Mock).mockReturnValue('cookie-string');

        const request = createMockRequest('legacy-cookie=legacy-client-id');
        const response = createMockResponse();

        const environment = analyticsServerEnvironment(request, response);
        await environment.setClientId();

        expect(internalModule.fetchClientIdFromEdgeProxy).not.toHaveBeenCalled();
      });

      it('should handle legacy cookie migration when request.headers.cookie is undefined', async () => {
        const legacyCookieName = `${COOKIE_NAME_PREFIX}test-context-id`;
        (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue({
          name: legacyCookieName,
          value: 'legacy-client-id',
        });
        (utilsModule.createCookieString as jest.Mock)
          .mockReturnValueOnce('sc_cid=legacy-client-id; Max-Age=63072000')
          .mockReturnValueOnce(`${legacyCookieName}=; Max-Age=0`);

        const request = createMockRequest(undefined);
        const response = createMockResponse();

        const environment = analyticsServerEnvironment(request, response);
        await environment.setClientId();

        expect(request.headers.cookie).toBeUndefined();
        expect(response.setHeader).toHaveBeenCalledWith('Set-Cookie', [
          'sc_cid=legacy-client-id; Max-Age=63072000',
          `${legacyCookieName}=; Max-Age=0`,
        ]);
      });
    });

    describe('existing client ID', () => {
      it('should use existing client ID and set cookie in response', async () => {
        (utilsModule.getCookieServerSide as jest.Mock)
          .mockReturnValueOnce(undefined) // legacy cookie check
          .mockReturnValueOnce({ name: 'sc_cid', value: 'existing-client-id' }); // client id check
        (utilsModule.createCookieString as jest.Mock).mockReturnValue(
          'sc_cid=existing-client-id; Max-Age=63072000'
        );

        const request = createMockRequest('sc_cid=existing-client-id');
        const response = createMockResponse();

        const environment = analyticsServerEnvironment(request, response);
        await environment.setClientId();

        expect(internalModule.fetchClientIdFromEdgeProxy).not.toHaveBeenCalled();
        expect(utilsModule.createCookieString).toHaveBeenCalledWith(
          'sc_cid',
          'existing-client-id',
          mockCookieAttributes
        );
        expect(response.setHeader).toHaveBeenCalledWith(
          'Set-Cookie',
          'sc_cid=existing-client-id; Max-Age=63072000'
        );
      });

      it('should not modify request cookie when client ID already exists', async () => {
        (utilsModule.getCookieServerSide as jest.Mock)
          .mockReturnValueOnce(undefined)
          .mockReturnValueOnce({ name: 'sc_cid', value: 'existing-id' });
        (utilsModule.createCookieString as jest.Mock).mockReturnValue('cookie-string');

        const request = createMockRequest('sc_cid=existing-id');
        const response = createMockResponse();

        const environment = analyticsServerEnvironment(request, response);
        await environment.setClientId();

        expect(request.headers.cookie).toBe('sc_cid=existing-id');
      });
    });

    describe('fetch from edge proxy', () => {
      it('should fetch client ID from edge proxy when no cookies exist', async () => {
        (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue(undefined);
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

        const request = createMockRequest();
        const response = createMockResponse();

        const environment = analyticsServerEnvironment(request, response);
        await environment.setClientId();

        expect(internalModule.fetchClientIdFromEdgeProxy).toHaveBeenCalledWith(
          'https://edge.test.com',
          'test-context-id',
          3000
        );
      });

      it('should store proxy values in plugin settings after fetching', async () => {
        const proxyValues = {
          clientId: 'new-client-id',
          guestId: 'client-key-123',
        };
        (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue(undefined);
        (
          internalModule.fetchClientIdFromEdgeProxy as jest.Mock<
            typeof internalModule.fetchClientIdFromEdgeProxy
          >
        ).mockResolvedValue(proxyValues);
        (utilsModule.createCookieString as jest.Mock).mockReturnValue('cookie-string');

        const request = createMockRequest();
        const response = createMockResponse();

        const environment = analyticsServerEnvironment(request, response);
        await environment.setClientId();

        expect(mockAnalyticsSettings.proxyValues).toEqual(proxyValues);
      });

      it('should append cookie to request headers when no existing cookies', async () => {
        (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue(undefined);
        (
          internalModule.fetchClientIdFromEdgeProxy as jest.Mock<
            typeof internalModule.fetchClientIdFromEdgeProxy
          >
        ).mockResolvedValue({
          clientId: 'new-client-id',
          guestId: 'guest-id-123',
        });
        (utilsModule.createCookieString as jest.Mock).mockReturnValue(
          'sc_cid=new-client-id; Max-Age=63072000'
        );

        const request = createMockRequest(undefined);
        const response = createMockResponse();

        const environment = analyticsServerEnvironment(request, response);
        await environment.setClientId();

        expect(request.headers.cookie).toBe('sc_cid=new-client-id; Max-Age=63072000');
      });

      it('should append cookie to existing request cookies', async () => {
        (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue(undefined);
        (
          internalModule.fetchClientIdFromEdgeProxy as jest.Mock<
            typeof internalModule.fetchClientIdFromEdgeProxy
          >
        ).mockResolvedValue({
          clientId: 'new-client-id',
          guestId: 'guest-id-123',
        });
        (utilsModule.createCookieString as jest.Mock).mockReturnValue(
          'sc_cid=new-client-id; Max-Age=63072000'
        );

        const request = createMockRequest('other_cookie=value');
        const response = createMockResponse();

        const environment = analyticsServerEnvironment(request, response);
        await environment.setClientId();

        expect(request.headers.cookie).toBe(
          'other_cookie=value; sc_cid=new-client-id; Max-Age=63072000'
        );
      });
    });

    describe('response Set-Cookie header handling', () => {
      it('should set cookie header when no existing Set-Cookie header', async () => {
        (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue(undefined);
        (
          internalModule.fetchClientIdFromEdgeProxy as jest.Mock<
            typeof internalModule.fetchClientIdFromEdgeProxy
          >
        ).mockResolvedValue({
          clientId: 'new-client-id',
          guestId: 'guest-id-123',
        });
        (utilsModule.createCookieString as jest.Mock).mockReturnValue('sc_cid=new-client-id');

        const request = createMockRequest();
        const response = createMockResponse();

        const environment = analyticsServerEnvironment(request, response);
        await environment.setClientId();

        expect(response.setHeader).toHaveBeenCalledWith('Set-Cookie', 'sc_cid=new-client-id');
      });

      it('should append to existing Set-Cookie header string', async () => {
        (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue(undefined);
        (
          internalModule.fetchClientIdFromEdgeProxy as jest.Mock<
            typeof internalModule.fetchClientIdFromEdgeProxy
          >
        ).mockResolvedValue({
          clientId: 'new-client-id',
          guestId: 'guest-id-123',
        });
        (utilsModule.createCookieString as jest.Mock).mockReturnValue('sc_cid=new-client-id');

        const request = createMockRequest();
        const response = createMockResponse();
        response.headers['Set-Cookie'] = 'existing_cookie=value';

        const environment = analyticsServerEnvironment(request, response);
        await environment.setClientId();

        expect(response.setHeader).toHaveBeenCalledWith(
          'Set-Cookie',
          'existing_cookie=value; sc_cid=new-client-id'
        );
      });

      it('should append to existing Set-Cookie header array', async () => {
        (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue(undefined);
        (
          internalModule.fetchClientIdFromEdgeProxy as jest.Mock<
            typeof internalModule.fetchClientIdFromEdgeProxy
          >
        ).mockResolvedValue({
          clientId: 'new-client-id',
          guestId: 'guest-id-123',
        });
        (utilsModule.createCookieString as jest.Mock).mockReturnValue('sc_cid=new-client-id');

        const request = createMockRequest();
        const response = createMockResponse();
        response.headers['Set-Cookie'] = ['cookie1=value1', 'cookie2=value2'];

        const environment = analyticsServerEnvironment(request, response);
        await environment.setClientId();

        expect(response.setHeader).toHaveBeenCalledWith('Set-Cookie', [
          'cookie1=value1',
          'cookie2=value2',
          'sc_cid=new-client-id',
        ]);
      });
    });
  });

  describe('location.getSearchParams', () => {
    it('should return search params from request URL', () => {
      const request = createMockRequest(undefined, '/page?param1=value1&param2=value2');
      const response = createMockResponse();

      const environment = analyticsServerEnvironment(request, response);
      const result = environment.location.getSearchParams();

      expect(result).toBe('?param1=value1&param2=value2');
    });

    it('should return empty string when no search params in URL', () => {
      const request = createMockRequest(undefined, '/page');
      const response = createMockResponse();

      const environment = analyticsServerEnvironment(request, response);
      const result = environment.location.getSearchParams();

      expect(result).toBe('');
    });

    it('should handle URL with only path', () => {
      const request = createMockRequest(undefined, '/');
      const response = createMockResponse();

      const environment = analyticsServerEnvironment(request, response);
      const result = environment.location.getSearchParams();

      expect(result).toBe('');
    });

    it('should handle complex query strings', () => {
      const request = createMockRequest(
        undefined,
        '/page?utm_source=google&utm_medium=cpc&utm_campaign=test'
      );
      const response = createMockResponse();

      const environment = analyticsServerEnvironment(request, response);
      const result = environment.location.getSearchParams();

      expect(result).toBe('?utm_source=google&utm_medium=cpc&utm_campaign=test');
    });
  });
});
