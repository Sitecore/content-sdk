import { personalizeServerAdapter } from './server-adapter';
import * as sharedModule from './shared';
import * as coreModule from '@sitecore-content-sdk/core';
import * as analyticsPluginModule from '@sitecore-content-sdk/analytics-core/internal';
import * as internalModule from '@sitecore-content-sdk/analytics-core/internal';
import * as utilsModule from '@sitecore-content-sdk/analytics-core/utils';
import * as fetchProfileIdModule from '../profile-id/fetch-profile-id-from-edge-proxy';
import type { IncomingMessage, OutgoingMessage } from 'http';
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
  getCookieServerSide: jest.fn(),
}));

jest.mock('../profile-id/fetch-profile-id-from-edge-proxy', () => ({
  fetchProfileIdFromEdgeProxy: jest.fn(),
}));

describe('personalizeServerAdapter', () => {
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
      visitorIds: undefined as any,
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

  const createMockRequest = (
    cookies?: string,
    url = '/test-page',
    userAgent = 'test-user-agent'
  ): IncomingMessage => {
    return {
      headers: {
        cookie: cookies,
        'user-agent': userAgent,
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
    mockAnalyticsPlugin.options.visitorIds = undefined;
    (sharedModule.getPersonalizePlugin as jest.Mock).mockReturnValue(mockPersonalizePlugin);
    (analyticsPluginModule.getAnalyticsPlugin as jest.Mock).mockReturnValue(mockAnalyticsPlugin);
    (coreModule.getCoreContext as jest.Mock).mockReturnValue(mockCoreContext);
    (internalModule.getDefaultCookieAttributes as jest.Mock).mockReturnValue(mockCookieAttributes);
  });

  it('should return an adapter with type "server"', () => {
    const request = createMockRequest();
    const response = createMockResponse();

    const adapter = personalizeServerAdapter(request, response);
    expect(adapter.type).toBe('server');
  });

  describe('getUserAgent', () => {
    it('should return the user agent from request headers', () => {
      const request = createMockRequest(undefined, '/test', 'Mozilla/5.0');
      const response = createMockResponse();

      const adapter = personalizeServerAdapter(request, response);
      const result = adapter.getUserAgent?.();

      expect(result).toBe('Mozilla/5.0');
    });

    it('should return undefined when user agent is not set', () => {
      const request = createMockRequest();
      delete request.headers['user-agent'];
      const response = createMockResponse();

      const adapter = personalizeServerAdapter(request, response);
      const result = adapter.getUserAgent?.();

      expect(result).toBeUndefined();
    });
  });

  describe('getProfileId', () => {
    it('should return the profile ID from request cookies', () => {
      (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue({
        name: 'sc_cid_personalize',
        value: 'profile-id-123',
      });
      const request = createMockRequest('sc_cid_personalize=profile-id-123');
      const response = createMockResponse();

      const adapter = personalizeServerAdapter(request, response);
      const result = adapter.getProfileId();

      expect(result).toBe('profile-id-123');
      expect(utilsModule.getCookieServerSide).toHaveBeenCalledWith(
        'sc_cid_personalize=profile-id-123',
        'sc_cid_personalize'
      );
    });

    it('should return null when cookie does not exist', () => {
      (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue(undefined);
      const request = createMockRequest();
      const response = createMockResponse();

      const adapter = personalizeServerAdapter(request, response);
      const result = adapter.getProfileId();

      expect(result).toBeNull();
    });
  });

  describe('setProfileId', () => {
    describe('legacy cookie migration', () => {
      it('should migrate legacy cookie and set new cookie in response', async () => {
        const legacyCookieName = 'sc_test-context-id_personalize';
        (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue({
          name: legacyCookieName,
          value: 'legacy-profile-id',
        });
        (utilsModule.createCookieString as jest.Mock)
          .mockReturnValueOnce('sc_cid_personalize=legacy-profile-id')
          .mockReturnValueOnce(`${legacyCookieName}=; Max-Age=0`);

        const request = createMockRequest(`${legacyCookieName}=legacy-profile-id`);
        const response = createMockResponse();

        const adapter = personalizeServerAdapter(request, response);
        await adapter.setProfileId();

        expect(response.setHeader).toHaveBeenCalledWith('Set-Cookie', [
          'sc_cid_personalize=legacy-profile-id',
          `${legacyCookieName}=; Max-Age=0`,
        ]);
      });

      it('should replace legacy cookie name in request headers', async () => {
        const legacyCookieName = 'sc_test-context-id_personalize';
        (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue({
          name: legacyCookieName,
          value: 'legacy-profile-id',
        });
        (utilsModule.createCookieString as jest.Mock)
          .mockReturnValueOnce('new-cookie')
          .mockReturnValueOnce('delete-cookie');

        const request = createMockRequest(`${legacyCookieName}=legacy-profile-id`);
        const response = createMockResponse();

        const adapter = personalizeServerAdapter(request, response);
        await adapter.setProfileId();

        expect(request.headers.cookie).toBe('sc_cid_personalize=legacy-profile-id');
      });

      it('should handle legacy cookie when request.headers.cookie is undefined', async () => {
        const legacyCookieName = 'sc_test-context-id_personalize';
        (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue({
          name: legacyCookieName,
          value: 'legacy-profile-id',
        });
        (utilsModule.createCookieString as jest.Mock)
          .mockReturnValueOnce('sc_cid_personalize=legacy-profile-id')
          .mockReturnValueOnce(`${legacyCookieName}=; Max-Age=0`);

        const request = createMockRequest(undefined);
        const response = createMockResponse();

        const adapter = personalizeServerAdapter(request, response);
        await adapter.setProfileId();

        expect(request.headers.cookie).toBeUndefined();
      });
    });

    describe('existing profile ID', () => {
      it('should use existing profile ID and set cookie in response', async () => {
        (utilsModule.getCookieServerSide as jest.Mock)
          .mockReturnValueOnce(undefined) // legacy cookie check
          .mockReturnValueOnce({ name: 'sc_cid_personalize', value: 'existing-profile-id' }) // profile id check
          .mockReturnValueOnce({ name: 'sc_cid', value: 'client-id' }); // client id check
        (utilsModule.createCookieString as jest.Mock).mockReturnValue(
          'sc_cid_personalize=existing-profile-id'
        );

        const request = createMockRequest('sc_cid_personalize=existing-profile-id');
        const response = createMockResponse();

        const adapter = personalizeServerAdapter(request, response);
        await adapter.setProfileId();

        expect(fetchProfileIdModule.fetchProfileIdFromEdgeProxy).not.toHaveBeenCalled();
        expect(response.setHeader).toHaveBeenCalledWith(
          'Set-Cookie',
          'sc_cid_personalize=existing-profile-id'
        );
      });
    });

    describe('profile ID from proxy values', () => {
      it('should use profile ID from proxy values when available', async () => {
        mockAnalyticsPlugin.options.visitorIds = { profileId: 'proxy-profile-id' };
        (utilsModule.getCookieServerSide as jest.Mock)
          .mockReturnValueOnce(undefined) // legacy cookie
          .mockReturnValueOnce(undefined) // profile id cookie
          .mockReturnValueOnce({ name: 'sc_cid', value: 'client-id' }); // client id
        (utilsModule.createCookieString as jest.Mock).mockReturnValue(
          'sc_cid_personalize=proxy-profile-id'
        );

        const request = createMockRequest('sc_cid=client-id');
        const response = createMockResponse();

        const adapter = personalizeServerAdapter(request, response);
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
      it('should fetch profile ID from edge proxy when client ID exists', async () => {
        (utilsModule.getCookieServerSide as jest.Mock)
          .mockReturnValueOnce(undefined) // legacy cookie
          .mockReturnValueOnce(undefined) // profile id cookie
          .mockReturnValueOnce({ name: 'sc_cid', value: 'client-id-123' }); // client id
        jest
          .spyOn(fetchProfileIdModule, 'fetchProfileIdFromEdgeProxy')
          .mockResolvedValue('new-profile-id');
        (utilsModule.createCookieString as jest.Mock).mockReturnValue(
          'sc_cid_personalize=new-profile-id'
        );

        const request = createMockRequest('sc_cid=client-id-123');
        const response = createMockResponse();

        const adapter = personalizeServerAdapter(request, response);
        await adapter.setProfileId();

        expect(fetchProfileIdModule.fetchProfileIdFromEdgeProxy).toHaveBeenCalledWith(
          'client-id-123',
          'test-context-id',
          'https://edge.test.com'
        );
      });

      it('should return early when no client ID cookie exists', async () => {
        (utilsModule.getCookieServerSide as jest.Mock).mockReturnValue(undefined);

        const request = createMockRequest();
        const response = createMockResponse();

        const adapter = personalizeServerAdapter(request, response);
        await adapter.setProfileId();

        expect(fetchProfileIdModule.fetchProfileIdFromEdgeProxy).not.toHaveBeenCalled();
        expect(response.setHeader).not.toHaveBeenCalled();
      });

      it('should append cookie to request headers when no existing cookies', async () => {
        (utilsModule.getCookieServerSide as jest.Mock)
          .mockReturnValueOnce(undefined) // legacy
          .mockReturnValueOnce(undefined) // profile id
          .mockReturnValueOnce({ name: 'sc_cid', value: 'client-id' }); // client id
        jest
          .spyOn(fetchProfileIdModule, 'fetchProfileIdFromEdgeProxy')
          .mockResolvedValue('profile-id');
        (utilsModule.createCookieString as jest.Mock).mockReturnValue(
          'sc_cid_personalize=profile-id'
        );

        const request = createMockRequest(undefined);
        request.headers.cookie = undefined;
        const response = createMockResponse();

        const adapter = personalizeServerAdapter(request, response);
        await adapter.setProfileId();

        expect(request.headers.cookie).toBe('sc_cid_personalize=profile-id');
      });

      it('should append cookie to existing request cookies', async () => {
        (utilsModule.getCookieServerSide as jest.Mock)
          .mockReturnValueOnce(undefined) // legacy
          .mockReturnValueOnce(undefined) // profile id
          .mockReturnValueOnce({ name: 'sc_cid', value: 'client-id' }); // client id
        jest
          .spyOn(fetchProfileIdModule, 'fetchProfileIdFromEdgeProxy')
          .mockResolvedValue('profile-id');
        (utilsModule.createCookieString as jest.Mock).mockReturnValue(
          'sc_cid_personalize=profile-id'
        );

        const request = createMockRequest('other_cookie=value');
        const response = createMockResponse();

        const adapter = personalizeServerAdapter(request, response);
        await adapter.setProfileId();

        expect(request.headers.cookie).toBe('other_cookie=value; sc_cid_personalize=profile-id');
      });
    });

    describe('response Set-Cookie header handling', () => {
      it('should set cookie header when no existing Set-Cookie header', async () => {
        (utilsModule.getCookieServerSide as jest.Mock)
          .mockReturnValueOnce(undefined)
          .mockReturnValueOnce(undefined)
          .mockReturnValueOnce({ name: 'sc_cid', value: 'client-id' });
        jest
          .spyOn(fetchProfileIdModule, 'fetchProfileIdFromEdgeProxy')
          .mockResolvedValue('profile-id');
        (utilsModule.createCookieString as jest.Mock).mockReturnValue(
          'sc_cid_personalize=profile-id'
        );

        const request = createMockRequest();
        const response = createMockResponse();

        const adapter = personalizeServerAdapter(request, response);
        await adapter.setProfileId();

        expect(response.setHeader).toHaveBeenCalledWith(
          'Set-Cookie',
          'sc_cid_personalize=profile-id'
        );
      });

      it('should append to existing Set-Cookie header string', async () => {
        (utilsModule.getCookieServerSide as jest.Mock)
          .mockReturnValueOnce(undefined)
          .mockReturnValueOnce(undefined)
          .mockReturnValueOnce({ name: 'sc_cid', value: 'client-id' });
        jest
          .spyOn(fetchProfileIdModule, 'fetchProfileIdFromEdgeProxy')
          .mockResolvedValue('profile-id');
        (utilsModule.createCookieString as jest.Mock).mockReturnValue(
          'sc_cid_personalize=profile-id'
        );

        const request = createMockRequest();
        const response = createMockResponse();
        response.headers['Set-Cookie'] = 'existing_cookie=value';

        const adapter = personalizeServerAdapter(request, response);
        await adapter.setProfileId();

        expect(response.setHeader).toHaveBeenCalledWith(
          'Set-Cookie',
          'existing_cookie=value; sc_cid_personalize=profile-id'
        );
      });

      it('should append to existing Set-Cookie header array', async () => {
        (utilsModule.getCookieServerSide as jest.Mock)
          .mockReturnValueOnce(undefined)
          .mockReturnValueOnce(undefined)
          .mockReturnValueOnce({ name: 'sc_cid', value: 'client-id' });
        jest
          .spyOn(fetchProfileIdModule, 'fetchProfileIdFromEdgeProxy')
          .mockResolvedValue('profile-id');
        (utilsModule.createCookieString as jest.Mock).mockReturnValue(
          'sc_cid_personalize=profile-id'
        );

        const request = createMockRequest();
        const response = createMockResponse();
        response.headers['Set-Cookie'] = ['cookie1=value1', 'cookie2=value2'];

        const adapter = personalizeServerAdapter(request, response);
        await adapter.setProfileId();

        expect(response.setHeader).toHaveBeenCalledWith('Set-Cookie', [
          'cookie1=value1',
          'cookie2=value2',
          'sc_cid_personalize=profile-id',
        ]);
      });
    });
  });
});
