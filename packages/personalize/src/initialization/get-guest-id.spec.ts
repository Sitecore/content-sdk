import * as analyticsPluginsModule from '@sitecore-content-sdk/analytics-core/internal';
import * as coreModule from '@sitecore-content-sdk/core';
import * as fetchGuestIdFromEdgeProxyModule from '../guest-id/fetch-guest-id-from-edge-proxy';
import { getGuestId } from './get-guest-id';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/analytics-core/internal', () => ({
  getAnalyticsPlugin: jest.fn(),
}));
jest.mock('@sitecore-content-sdk/core', () => ({
  getCoreContext: jest.fn(),
}));

describe('getGuestId', () => {
  const mockAdapter = {
    getClientId: jest.fn(),
  };

  const mockAnalyticsPlugin = {
    adapter: mockAdapter,
  };

  const mockCoreContext = {
    settings: {
      contextId: '123',
      edgeUrl: 'https://edge.test.com',
      siteName: '456',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (coreModule.getCoreContext as jest.Mock).mockReturnValue(mockCoreContext);
    (analyticsPluginsModule.getAnalyticsPlugin as jest.Mock).mockReturnValue(mockAnalyticsPlugin);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call fetchGuestIdFromEdgeProxy with the correct parameters and resolve with guestId', async () => {
    const id = 'test_id';
    const fetchGuestIdSpy = jest
      .spyOn(fetchGuestIdFromEdgeProxyModule, 'fetchGuestIdFromEdgeProxy')
      .mockResolvedValueOnce('guestID');
    mockAdapter.getClientId.mockReturnValue(id);

    const guestID = await getGuestId();

    expect(fetchGuestIdSpy).toHaveBeenCalledTimes(1);
    expect(fetchGuestIdSpy).toHaveBeenCalledWith(
      id,
      mockCoreContext.settings.contextId,
      mockCoreContext.settings.edgeUrl
    );
    expect(guestID).toBe('guestID');
  });

  it('should use empty string for clientId when getClientId returns null', async () => {
    const fetchGuestIdSpy = jest
      .spyOn(fetchGuestIdFromEdgeProxyModule, 'fetchGuestIdFromEdgeProxy')
      .mockResolvedValueOnce('guestID');
    mockAdapter.getClientId.mockReturnValue(null);

    await getGuestId();

    expect(fetchGuestIdSpy).toHaveBeenCalledWith(
      '',
      mockCoreContext.settings.contextId,
      mockCoreContext.settings.edgeUrl
    );
  });
});
