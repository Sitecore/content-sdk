import * as internalModule from '@sitecore-content-sdk/analytics-core/internal';
import * as utilsModule from '@sitecore-content-sdk/utils';
import * as handleHttpCookieModule from './handleHttpCookie';

jest.mock('@sitecore-content-sdk/analytics-core/internal', () => ({
  __esModule: true,
  getCookieServerSide: jest.fn(),
  getCookiesValuesFromEdgeServer: jest.fn(),
  getDefaultCookieAttributes: jest.fn(),
  getGuestIdServer: jest.fn(),
}));

jest.mock('@sitecore-content-sdk/utils', () => ({
  __esModule: true,
  createCookieString: jest.fn(),
  getCookieServerSide: jest.fn(),
  isNextJsMiddlewareRequest: jest.fn(),
  isNextJsMiddlewareResponse: jest.fn(),
}));

jest.mock('@sitecore-content-sdk/analytics-core/browser', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/analytics-core/browser');

  return {
    __esModule: true,
    ...originalModule,
  };
});

describe('handleHttpCookie', () => {
  const mockSettings = {
    cookieSettings: { name: { guestId: 'sc_123_personalize' } },
  };

  const mockCloudSDKSettings = {
    cookieSettings: { domain: 'example.com', expiryDays: 7, name: 'sc_123' },
    siteName: 'spinair.com',
    sitecoreEdgeContextId: 'context-id',
    sitecoreEdgeUrl: 'https://sitecore.edge.url',
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  jest
    .spyOn(internalModule, 'getDefaultCookieAttributes')
    .mockReturnValue({ domain: 'test', maxAge: 123345, path: '/', sameSite: 'None', secure: true });

  it('should handle HTTP cookie when guestId cookie exists', async () => {
    const mockRequest = {
      headers: {
        cookie: 'sc_123_personalize=guest_id_from_proxy',
      },
    };

    const mockResponse = {
      setHeader: jest.fn(),
    };

    jest
      .spyOn(utilsModule, 'getCookieServerSide')
      .mockReturnValueOnce({ name: 'sc_123_personalize', value: 'guest_id_from_proxy' })
      .mockReturnValueOnce(undefined);

    const createCookieStringSpy = jest
      .spyOn(utilsModule, 'createCookieString')
      .mockReturnValueOnce('sc_123_personalize=guest_id_from_proxy');

    await handleHttpCookieModule.handleHttpCookie(
      mockRequest,
      mockResponse,
      mockSettings,
      mockCloudSDKSettings
    );

    expect(createCookieStringSpy).toHaveBeenCalledWith(
      'sc_123_personalize',
      'guest_id_from_proxy',
      {
        domain: 'test',
        maxAge: 123345,
        path: '/',
        sameSite: 'None',
        secure: true,
      }
    );
    expect(mockRequest.headers.cookie).toBe('sc_123_personalize=guest_id_from_proxy');
    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      'sc_123_personalize=guest_id_from_proxy'
    );
  });

  it('should handle HTTP cookie when guestId (cached) value exists', async () => {
    const mockRequest = {
      headers: {
        cookie: '',
      },
    };

    const mockResponse = {
      setHeader: jest.fn(),
    };

    jest
      .spyOn(utilsModule, 'getCookieServerSide')
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(undefined);
    jest.spyOn(internalModule, 'getCookiesValuesFromEdgeServer').mockReturnValueOnce({
      browserId: 'browser_id_from_proxy',
      guestId: 'guest_id_from_proxy',
    } as any);

    const createCookieStringSpy = jest
      .spyOn(utilsModule, 'createCookieString')
      .mockReturnValueOnce('sc_123_personalize=guest_id_from_proxy');

    await handleHttpCookieModule.handleHttpCookie(
      mockRequest,
      mockResponse,
      mockSettings,
      mockCloudSDKSettings
    );

    expect(createCookieStringSpy).toHaveBeenCalledWith(
      'sc_123_personalize',
      'guest_id_from_proxy',
      {
        domain: 'test',
        maxAge: 123345,
        path: '/',
        sameSite: 'None',
        secure: true,
      }
    );
    expect(mockRequest.headers.cookie).toBe('sc_123_personalize=guest_id_from_proxy');
    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      'sc_123_personalize=guest_id_from_proxy'
    );
  });

  it('should handle HTTP cookie when browserId cookie exists', async () => {
    const mockRequest = {
      headers: {
        cookie: 'sc_123=browser_id_from_proxy',
      },
    };

    const mockResponse = {
      setHeader: jest.fn(),
    };

    jest
      .spyOn(internalModule, 'getCookiesValuesFromEdgeServer')
      .mockReturnValueOnce({ browserId: '', guestId: '' } as any);
    jest
      .spyOn(utilsModule, 'getCookieServerSide')
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce({ name: 'sc_123', value: 'browser_id_from_proxy' });

    const getGuestIdSpy = jest
      .spyOn(internalModule, 'getGuestIdServer')
      .mockResolvedValueOnce('guest_id_from_proxy');

    const createCookieStringSpy = jest
      .spyOn(utilsModule, 'createCookieString')
      .mockReturnValueOnce('sc_123_personalize=guest_id_from_proxy');

    await handleHttpCookieModule.handleHttpCookie(
      mockRequest,
      mockResponse,
      mockSettings,
      mockCloudSDKSettings
    );

    expect(createCookieStringSpy).toHaveBeenCalledWith(
      'sc_123_personalize',
      'guest_id_from_proxy',
      {
        domain: 'test',
        maxAge: 123345,
        path: '/',
        sameSite: 'None',
        secure: true,
      }
    );
    expect(getGuestIdSpy).toHaveBeenCalled();
    expect(mockRequest.headers.cookie).toBe(
      'sc_123=browser_id_from_proxy; sc_123_personalize=guest_id_from_proxy'
    );
    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      'sc_123_personalize=guest_id_from_proxy'
    );
  });

  it(`should handle HTTP cookie when no guestId, 
      no guestId (cached) value 
      and no browserId cookie value exists`, async () => {
    const mockRequest = {
      headers: {
        cookie: '',
      },
    };

    const mockResponse = {
      setHeader: jest.fn(),
    };

    jest
      .spyOn(utilsModule, 'getCookieServerSide')
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(undefined);
    jest
      .spyOn(internalModule, 'getCookiesValuesFromEdgeServer')
      .mockReturnValueOnce(undefined as any);

    await handleHttpCookieModule.handleHttpCookie(
      mockRequest,
      mockResponse,
      mockSettings,
      mockCloudSDKSettings
    );

    expect(mockRequest.headers.cookie).toBe('');
    expect(mockResponse.setHeader).not.toHaveBeenCalled();
  });
});
