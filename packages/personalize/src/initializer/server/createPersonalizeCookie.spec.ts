import * as utilsModule from '@sitecore-content-sdk/utils';
import * as createPersonalizeCookieModule from './createPersonalizeCookie';
import * as handleHttpCookieModule from './handleHttpCookie';
import * as handleNextJsMiddlewareCookieModule from './handleNextJsMiddlewareCookie';

jest.mock('@sitecore-content-sdk/utils', () => ({
  __esModule: true,
  isHttpRequest: jest.fn(),
  isHttpResponse: jest.fn(),
  isNextJsMiddlewareRequest: jest.fn(),
  isNextJsMiddlewareResponse: jest.fn(),
}));

jest.mock('./handleNextJsMiddlewareCookie', () => ({
  __esModule: true,
  handleNextJsMiddlewareCookie: jest.fn(),
}));

jest.mock('./handleHttpCookie', () => ({
  __esModule: true,
  handleHttpCookie: jest.fn(),
}));

describe('createPersonalizeCookie', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  // eslint-disable-next-line max-len
  it('should call handleMiddlewareRequest when isNextJsMiddlewareRequest and isNextJsMiddlewareResponse is true', async () => {
    jest.spyOn(utilsModule, 'isNextJsMiddlewareRequest').mockImplementation(() => true);
    jest.spyOn(utilsModule, 'isNextJsMiddlewareResponse').mockImplementation(() => true);

    const handleNextJsMiddlewareCookieSpy = jest.spyOn(
      handleNextJsMiddlewareCookieModule,
      'handleNextJsMiddlewareCookie'
    );

    await createPersonalizeCookieModule.createPersonalizeCookie(
      mockRequest,
      mockResponse,
      mockSettings,
      mockCloudSDKSettings
    );

    expect(handleNextJsMiddlewareCookieSpy).toHaveBeenCalled();
  });

  // eslint-disable-next-line max-len
  it('should NOT call handleMiddlewareRequest when isNextJsMiddlewareRequest or isNextJsMiddlewareResponse is false - example 1', async () => {
    jest.spyOn(utilsModule, 'isNextJsMiddlewareRequest').mockImplementation(() => false);
    jest.spyOn(utilsModule, 'isNextJsMiddlewareResponse').mockImplementation(() => true);

    const handleNextJsMiddlewareCookieSpy = jest.spyOn(
      handleNextJsMiddlewareCookieModule,
      'handleNextJsMiddlewareCookie'
    );

    await createPersonalizeCookieModule.createPersonalizeCookie(
      mockRequest,
      mockResponse,
      mockSettings,
      mockCloudSDKSettings
    );

    expect(handleNextJsMiddlewareCookieSpy).not.toHaveBeenCalled();
  });

  // eslint-disable-next-line max-len
  it('should NOT call handleMiddlewareRequest when isNextJsMiddlewareRequest or isNextJsMiddlewareResponse is false - example 2', async () => {
    jest.spyOn(utilsModule, 'isNextJsMiddlewareRequest').mockImplementation(() => true);
    jest.spyOn(utilsModule, 'isNextJsMiddlewareResponse').mockImplementation(() => false);

    const handleNextJsMiddlewareCookieSpy = jest.spyOn(
      handleNextJsMiddlewareCookieModule,
      'handleNextJsMiddlewareCookie'
    );

    await createPersonalizeCookieModule.createPersonalizeCookie(
      mockRequest,
      mockResponse,
      mockSettings,
      mockCloudSDKSettings
    );

    expect(handleNextJsMiddlewareCookieSpy).not.toHaveBeenCalled();
  });

  it('should call handleHttpCookie when isHttpRequest and isHttpRequest is true', async () => {
    jest.spyOn(utilsModule, 'isNextJsMiddlewareRequest').mockImplementation(() => false);
    jest.spyOn(utilsModule, 'isNextJsMiddlewareResponse').mockImplementation(() => false);
    jest.spyOn(utilsModule, 'isHttpRequest').mockImplementation(() => true);
    jest.spyOn(utilsModule, 'isHttpResponse').mockImplementation(() => true);

    const handleHttpCookieSpy = jest.spyOn(handleHttpCookieModule, 'handleHttpCookie');

    await createPersonalizeCookieModule.createPersonalizeCookie(
      mockRequest,
      mockResponse,
      mockSettings,
      mockCloudSDKSettings
    );

    expect(handleHttpCookieSpy).toHaveBeenCalled();
  });

  it('should NOT call handleHttpCookie when isHttpRequest or isHttpRequest is false - example 1', async () => {
    jest.spyOn(utilsModule, 'isNextJsMiddlewareRequest').mockImplementation(() => false);
    jest.spyOn(utilsModule, 'isNextJsMiddlewareResponse').mockImplementation(() => false);
    jest.spyOn(utilsModule, 'isHttpRequest').mockImplementation(() => false);
    jest.spyOn(utilsModule, 'isHttpResponse').mockImplementation(() => true);

    const handleHttpCookieSpy = jest.spyOn(handleHttpCookieModule, 'handleHttpCookie');

    await createPersonalizeCookieModule.createPersonalizeCookie(
      mockRequest,
      mockResponse,
      mockSettings,
      mockCloudSDKSettings
    );

    expect(handleHttpCookieSpy).not.toHaveBeenCalled();
  });

  it('should NOT call handleHttpCookie when isHttpRequest or isHttpRequest is false - example 2', async () => {
    jest.spyOn(utilsModule, 'isNextJsMiddlewareRequest').mockImplementation(() => false);
    jest.spyOn(utilsModule, 'isNextJsMiddlewareResponse').mockImplementation(() => false);
    jest.spyOn(utilsModule, 'isHttpRequest').mockImplementation(() => true);
    jest.spyOn(utilsModule, 'isHttpResponse').mockImplementation(() => false);

    const handleHttpCookieSpy = jest.spyOn(handleHttpCookieModule, 'handleHttpCookie');

    await createPersonalizeCookieModule.createPersonalizeCookie(
      mockRequest,
      mockResponse,
      mockSettings,
      mockCloudSDKSettings
    );

    expect(handleHttpCookieSpy).not.toHaveBeenCalled();
  });
});
