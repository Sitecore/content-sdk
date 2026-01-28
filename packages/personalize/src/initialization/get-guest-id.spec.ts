import * as analyticsPluginsModule from '@sitecore-content-sdk/analytics-core/internal';
import * as coreModule from '@sitecore-content-sdk/core';
import * as fetchGuestIdFromEdgeProxyModule from '../guest-id/fetch-guest-id-from-edge-proxy';
import { getGuestId } from './get-guest-id';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/analytics-core/internal', () => ({
  getAnalyticsPlugin: jest.fn(),
}));
jest.mock('@sitecore-content-sdk/core', () => ({
  getCoreSettings: jest.fn(),
}));

describe('getGuestId', () => {
  const mockEnvironment = {
    getBrowserId: jest.fn(),
  };

  const mockAnalyticsPlugin = {
    environment: mockEnvironment,
  };

  const mockCoreSettings = {
    settings: {
      contextId: '123',
      sitecoreEdgeUrl: 'https://edge.test.com',
      siteName: '456',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (coreModule.getCoreSettings as jest.Mock).mockReturnValue(mockCoreSettings);
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
    mockEnvironment.getBrowserId.mockReturnValue(id);

    const guestID = await getGuestId();

    expect(fetchGuestIdSpy).toHaveBeenCalledTimes(1);
    expect(fetchGuestIdSpy).toHaveBeenCalledWith(
      id,
      mockCoreSettings.settings.contextId,
      mockCoreSettings.settings.sitecoreEdgeUrl
    );
    expect(guestID).toBe('guestID');
  });

  it('should use empty string for browserId when getBrowserId returns null', async () => {
    const fetchGuestIdSpy = jest
      .spyOn(fetchGuestIdFromEdgeProxyModule, 'fetchGuestIdFromEdgeProxy')
      .mockResolvedValueOnce('guestID');
    mockEnvironment.getBrowserId.mockReturnValue(null);

    await getGuestId();

    expect(fetchGuestIdSpy).toHaveBeenCalledWith(
      '',
      mockCoreSettings.settings.contextId,
      mockCoreSettings.settings.sitecoreEdgeUrl
    );
  });
});
