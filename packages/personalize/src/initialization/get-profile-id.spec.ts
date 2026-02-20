import * as analyticsPluginsModule from '@sitecore-content-sdk/analytics-core/internal';
import * as coreModule from '@sitecore-content-sdk/core';
import * as fetchProfileIdFromEdgeProxyModule from '../profile-id/fetch-profile-id-from-edge-proxy';
import { getProfileId } from './get-profile-id';
import { jest, expect } from '@jest/globals';

jest.mock('@sitecore-content-sdk/analytics-core/internal', () => ({
  getAnalyticsPlugin: jest.fn(),
}));
jest.mock('@sitecore-content-sdk/core', () => {
  const originalModule = jest.requireActual<typeof coreModule>('@sitecore-content-sdk/core');

  return {
    ...originalModule,
    getCoreContext: jest.fn(),
    debugModule: jest.fn(() => jest.fn()),
    debugNamespace: 'content-sdk',
  };
});

describe('getProfileId', () => {
  const mockAdapter = {
    getClientId: jest.fn(),
  };

  const mockAnalyticsPlugin = {
    adapter: mockAdapter,
  };

  const mockCoreContext = {
    config: {
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

  it('should call fetchProfileIdFromEdgeProxy with the correct parameters and resolve with profileId', async () => {
    const id = 'test_id';
    const fetchProfileIdSpy = jest
      .spyOn(fetchProfileIdFromEdgeProxyModule, 'fetchProfileIdFromEdgeProxy')
      .mockResolvedValueOnce('profileID');
    mockAdapter.getClientId.mockReturnValue(id);

    const profileID = await getProfileId();

    expect(fetchProfileIdSpy).toHaveBeenCalledTimes(1);
    expect(fetchProfileIdSpy).toHaveBeenCalledWith(
      id,
      mockCoreContext.config.contextId,
      mockCoreContext.config.edgeUrl
    );
    expect(profileID).toBe('profileID');
  });

  it('should use empty string for clientId when getClientId returns null', async () => {
    const fetchProfileIdSpy = jest
      .spyOn(fetchProfileIdFromEdgeProxyModule, 'fetchProfileIdFromEdgeProxy')
      .mockResolvedValueOnce('profileID');
    mockAdapter.getClientId.mockReturnValue(null);

    await getProfileId();

    expect(fetchProfileIdSpy).toHaveBeenCalledWith(
      '',
      mockCoreContext.config.contextId,
      mockCoreContext.config.edgeUrl
    );
  });
});
