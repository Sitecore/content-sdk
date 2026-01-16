import * as initializerModule from '../initializer/server/initializer';
import * as fetchGuestIdFromEdgeProxyModule from './fetch-guest-id-from-edge-proxy';
import { getGuestIdServer } from './get-guest-id-server';

describe('getGuestId', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getGuestIdFromCore with the correct parameters and resolve with guestId', async () => {
    const id = 'test_id';
    const getGuestIdSpy = jest.spyOn(fetchGuestIdFromEdgeProxyModule, 'fetchGuestIdFromEdgeProxy');
    const getSettingsSpy = jest.spyOn(initializerModule, 'getCloudSDKSettings').mockReturnValue({
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

    getGuestIdSpy.mockResolvedValueOnce('guestID');

    const guestID = await getGuestIdServer(id);
    expect(getGuestIdSpy).toHaveBeenCalledTimes(1);
    expect(guestID).toBe('guestID');
    expect(getSettingsSpy).toHaveBeenCalledTimes(1);
  });
});
