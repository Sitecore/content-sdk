import * as internalModule from '@sitecore-content-sdk/__core__/internal';
import * as handleNextJsMiddlewareCookieModule from './handleNextJsMiddlewareCookie';

jest.mock('@sitecore-content-sdk/__core__/internal', () => ({
  __esModule: true,
  getCookieValueFromMiddlewareRequest: jest.fn(),
  getCookiesValuesFromEdgeServer: jest.fn(),
  getDefaultCookieAttributes: jest.fn(),
  getGuestIdServer: jest.fn(),
}));

describe('handleMiddlewareRequest', () => {
  const mockSettings = {
    cookieSettings: { name: { guestId: 'sc_123_personalize' } },
  };

  const mockCloudSDKSettings = {
    cookieSettings: { domain: 'example.com', expiryDays: 7, name: 'sc_123' },
    siteName: 'spinair.com',
    sitecoreEdgeContextId: 'context-id',
    sitecoreEdgeUrl: 'https://sitecore.edge.url',
  } as any;

  const mockRequest = {
    cookies: { get: jest.fn(), set: jest.fn() },
    headers: {
      get: jest.fn(),
    },
  };
  const mockResponse = {
    cookies: {
      set: jest.fn(),
    },
  };

  jest
    .spyOn(internalModule, 'getDefaultCookieAttributes')
    .mockReturnValue({ domain: 'test', maxAge: 123345, path: '/', sameSite: 'None', secure: true });

  const setRequestSpy = jest.spyOn(mockRequest.cookies, 'set');
  const setResponseSpy = jest.spyOn(mockResponse.cookies, 'set');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle Next.js middleware cookie when guestId cookie exists', async () => {
    jest
      .spyOn(internalModule, 'getCookieValueFromMiddlewareRequest')
      .mockReturnValueOnce('guest_id_from_proxy')
      .mockReturnValueOnce(undefined);
    jest
      .spyOn(internalModule, 'getCookiesValuesFromEdgeServer')
      .mockReturnValueOnce({ browserId: '' } as any);

    await handleNextJsMiddlewareCookieModule.handleNextJsMiddlewareCookie(
      mockRequest,
      mockResponse,
      mockSettings,
      mockCloudSDKSettings
    );

    expect(setRequestSpy).toHaveBeenCalledWith(
      mockSettings.cookieSettings.name.guestId,
      'guest_id_from_proxy',
      {
        domain: 'test',
        maxAge: 123345,
        path: '/',
        sameSite: 'None',
        secure: true,
      }
    );
    expect(setResponseSpy).toHaveBeenCalledWith(
      mockSettings.cookieSettings.name.guestId,
      'guest_id_from_proxy',
      {
        domain: 'test',
        maxAge: 123345,
        path: '/',
        sameSite: 'None',
        secure: true,
      }
    );
  });

  it('should handle Next.js middleware cookie when guestId (cached) value exists', async () => {
    jest
      .spyOn(internalModule, 'getCookieValueFromMiddlewareRequest')
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(undefined);
    jest.spyOn(internalModule, 'getCookiesValuesFromEdgeServer').mockReturnValueOnce({
      browserId: 'browser_id_from_proxy',
      guestId: 'guest_id_from_proxy',
    } as any);

    const getGuestIdSpy = jest.spyOn(internalModule, 'getGuestIdServer');

    await handleNextJsMiddlewareCookieModule.handleNextJsMiddlewareCookie(
      mockRequest,
      mockResponse,
      mockSettings,
      mockCloudSDKSettings
    );

    expect(setRequestSpy).toHaveBeenCalledWith(
      mockSettings.cookieSettings.name.guestId,
      'guest_id_from_proxy',
      {
        domain: 'test',
        maxAge: 123345,
        path: '/',
        sameSite: 'None',
        secure: true,
      }
    );
    expect(setResponseSpy).toHaveBeenCalledWith(
      mockSettings.cookieSettings.name.guestId,
      'guest_id_from_proxy',
      {
        domain: 'test',
        maxAge: 123345,
        path: '/',
        sameSite: 'None',
        secure: true,
      }
    );
    expect(getGuestIdSpy).not.toHaveBeenCalled();
  });

  it('should handle Next.js middleware cookie when browserId cookie value exists', async () => {
    jest
      .spyOn(internalModule, 'getCookieValueFromMiddlewareRequest')
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce('browser_id_from_proxy');
    jest
      .spyOn(internalModule, 'getCookiesValuesFromEdgeServer')
      .mockReturnValueOnce({ browserId: '', guestId: '' } as any);

    const getGuestIdSpy = jest
      .spyOn(internalModule, 'getGuestIdServer')
      .mockResolvedValueOnce('guest_id_from_proxy');

    await handleNextJsMiddlewareCookieModule.handleNextJsMiddlewareCookie(
      mockRequest,
      mockResponse,
      mockSettings,
      mockCloudSDKSettings
    );

    expect(setRequestSpy).toHaveBeenCalledWith(
      mockSettings.cookieSettings.name.guestId,
      'guest_id_from_proxy',
      {
        domain: 'test',
        maxAge: 123345,
        path: '/',
        sameSite: 'None',
        secure: true,
      }
    );
    expect(setResponseSpy).toHaveBeenCalledWith(
      mockSettings.cookieSettings.name.guestId,
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
  });

  it(`should handle Next.js middleware cookie when no guestId, 
      no guestId (cached) value 
      and no browserId cookie value exists`, async () => {
    jest
      .spyOn(internalModule, 'getCookieValueFromMiddlewareRequest')
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(undefined);
    jest
      .spyOn(internalModule, 'getCookiesValuesFromEdgeServer')
      .mockReturnValueOnce(undefined as any);

    await handleNextJsMiddlewareCookieModule.handleNextJsMiddlewareCookie(
      mockRequest,
      mockResponse,
      mockSettings,
      mockCloudSDKSettings
    );

    expect(setRequestSpy).not.toHaveBeenCalled();
    expect(setResponseSpy).not.toHaveBeenCalled();
  });
});
