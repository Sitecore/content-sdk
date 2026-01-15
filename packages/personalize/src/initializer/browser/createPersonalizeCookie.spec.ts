import * as browserModule from '@sitecore-content-sdk/analytics-core/browser';
import * as internalModule from '@sitecore-content-sdk/analytics-core/internal';
import * as utilsModule from '@sitecore-content-sdk/utils';
import * as createPersonalizeCookieModule from './createPersonalizeCookie';

jest.mock('@sitecore-content-sdk/analytics-core/internal', () => ({
  __esModule: true,
  getCookiesValuesFromEdgeBrowser: jest.fn(),
  getDefaultCookieAttributes: jest.fn(),
  getGuestId: jest.fn(),
}));

jest.mock('@sitecore-content-sdk/analytics-core/browser', () => ({
  __esModule: true,
  getGuestId: jest.fn(),
}));

jest.mock('@sitecore-content-sdk/utils', () => ({
  __esModule: true,
  createCookieString: jest.fn(),
  getCookieValueClientSide: jest.fn(),
}));

describe('createPersonalizeCookie', () => {
  const mockSettings = {
    cookieSettings: { name: { guestId: 'sc_123_personalize' } },
  } as any;

  const mockCloudSDKSettings = {
    cookieSettings: { domain: 'example.com', expiryDays: 7, name: 'sc_123' },
    siteName: 'spinair.com',
    sitecoreEdgeContextId: 'context-id',
    sitecoreEdgeUrl: 'https://sitecore.edge.url',
  } as any;

  jest
    .spyOn(internalModule, 'getDefaultCookieAttributes')
    .mockReturnValue({ domain: 'test', maxAge: 123345, path: '/', sameSite: 'None', secure: true });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return when guestId cookie exists', async () => {
    const createCookieStringSpy = jest.spyOn(utilsModule, 'createCookieString');

    jest
      .spyOn(utilsModule, 'getCookieValueClientSide')
      .mockReturnValueOnce('guest_id')
      .mockReturnValueOnce('');

    await createPersonalizeCookieModule.createPersonalizeCookie(mockSettings, mockCloudSDKSettings);
    expect(createCookieStringSpy).not.toHaveBeenCalled();
  });

  it('should return when guestId and browserId cookie exists', async () => {
    const createCookieStringSpy = jest.spyOn(utilsModule, 'createCookieString');

    jest
      .spyOn(utilsModule, 'getCookieValueClientSide')
      .mockReturnValueOnce('guest_id')
      .mockReturnValueOnce('browser_id');

    await createPersonalizeCookieModule.createPersonalizeCookie(mockSettings, mockCloudSDKSettings);
    expect(createCookieStringSpy).not.toHaveBeenCalled();
  });

  it('should create a guestId cookie when guestId (cached) value exists', async () => {
    jest
      .spyOn(internalModule, 'getCookiesValuesFromEdgeBrowser')
      .mockReturnValueOnce({ browserId: '', guestId: 'guest_id_from_proxy' } as any);
    jest
      .spyOn(utilsModule, 'getCookieValueClientSide')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');

    const createCookieStringSpy = jest
      .spyOn(utilsModule, 'createCookieString')
      .mockReturnValueOnce('sc_123_personalize=guest_id_from_proxy');

    await createPersonalizeCookieModule.createPersonalizeCookie(mockSettings, mockCloudSDKSettings);

    expect(createCookieStringSpy).toHaveBeenCalled();
    expect(document.cookie).toBe('sc_123_personalize=guest_id_from_proxy');
  });

  // eslint-disable-next-line max-len
  it('should create a guestId cookie when guestId cookie and guestId (cached) value does not exist and browserId cookie exists', async () => {
    jest
      .spyOn(utilsModule, 'getCookieValueClientSide')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('browser_id_from_proxy');
    jest
      .spyOn(internalModule, 'getCookiesValuesFromEdgeBrowser')
      .mockReturnValueOnce(undefined as any);

    const getGuestIdSpy = jest
      .spyOn(browserModule, 'getGuestId')
      .mockResolvedValueOnce('guest_id_from_proxy');
    const createCookieStringSpy = jest
      .spyOn(utilsModule, 'createCookieString')
      .mockReturnValueOnce('sc_123_personalize=guest_id_from_proxy');

    await createPersonalizeCookieModule.createPersonalizeCookie(mockSettings, mockCloudSDKSettings);

    expect(getGuestIdSpy).toHaveBeenCalled();
    expect(createCookieStringSpy).toHaveBeenCalled();
    expect(document.cookie).toBe('sc_123_personalize=guest_id_from_proxy');
  });

  // eslint-disable-next-line max-len
  it('should do nothing when guestId cookie, guestId (cached) value and browserId cookie does not exist', async () => {
    jest
      .spyOn(utilsModule, 'getCookieValueClientSide')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');

    jest
      .spyOn(internalModule, 'getCookiesValuesFromEdgeBrowser')
      .mockReturnValueOnce({ browserId: '', guestId: '' } as any);

    const getGuestIdSpy = jest.spyOn(browserModule, 'getGuestId');
    const createCookieStringSpy = jest.spyOn(utilsModule, 'createCookieString');

    await createPersonalizeCookieModule.createPersonalizeCookie(mockSettings, mockCloudSDKSettings);

    expect(getGuestIdSpy).not.toHaveBeenCalled();
    expect(createCookieStringSpy).not.toHaveBeenCalled();
  });
});
