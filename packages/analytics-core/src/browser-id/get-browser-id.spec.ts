import * as coreBrowserModule from '../initializer/browser/initializer';
import { getBrowserId } from './get-browser-id';

jest.mock('../initializer/browser/initializer');

describe('getBrowserId', () => {
  const getCloudSDKSettingsSpy = jest
    .spyOn(coreBrowserModule, 'getCloudSDKSettings')
    .mockReturnValue({
      cookieSettings: {
        domain: 'cDomain',
        expiryDays: 730,
        name: { browserId: 'bid_name' },
        path: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: '',
    });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the cookie value when cookie exists on the page', async () => {
    jest.spyOn(document, 'cookie', 'get').mockReturnValueOnce(`bid_name=bid_value`);

    const mockCoreBrowserModule = coreBrowserModule as { initCoreState: Promise<void> };
    mockCoreBrowserModule.initCoreState = Promise.resolve();

    const browserId = getBrowserId();
    expect(browserId).toEqual('bid_value');
    expect(getCloudSDKSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it('should return empty string if there is a cookie but not the correct one', async () => {
    jest.spyOn(document, 'cookie', 'get').mockReturnValueOnce('WrongCookieName=cookieValue');

    const mockCoreBrowserModule = coreBrowserModule as { initCoreState: Promise<void> };
    mockCoreBrowserModule.initCoreState = Promise.resolve();

    const browserId = getBrowserId();
    expect(browserId).toEqual('');
    expect(getCloudSDKSettingsSpy).toHaveBeenCalledTimes(1);
  });
  it('should return empty string if no cookie exists on the page', async () => {
    const mockCoreBrowserModule = coreBrowserModule as { initCoreState: Promise<void> };
    mockCoreBrowserModule.initCoreState = Promise.resolve();

    const browserId = getBrowserId();
    expect(browserId).toBe('');
    expect(getCloudSDKSettingsSpy).toHaveBeenCalledTimes(1);
  });
});
