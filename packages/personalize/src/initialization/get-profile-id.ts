import { getAnalyticsPlugin } from '@sitecore-content-sdk/analytics-core/internal';
import { fetchProfileIdFromEdgeProxy } from '../profile-id/fetch-profile-id-from-edge-proxy';
import { getCoreContext } from '@sitecore-content-sdk/core';

/**
 * Returns the profile ID.
 * @returns {Promise<string>} A promise that resolves with the profile ID.
 * @throws If the Sitecore Edge context ID is incorrect.
 * @internal
 */
export async function getProfileId(): Promise<string> {
  const { config } = getCoreContext();

  const clientId = getAnalyticsPlugin().adapter.getClientId() || '';

  return fetchProfileIdFromEdgeProxy(clientId, config.contextId, config.edgeUrl);
}
