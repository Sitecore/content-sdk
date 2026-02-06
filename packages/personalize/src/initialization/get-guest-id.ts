import { getAnalyticsPlugin } from '@sitecore-content-sdk/analytics-core/internal';
import { fetchGuestIdFromEdgeProxy } from '../guest-id/fetch-guest-id-from-edge-proxy';
import { getCoreContext } from '@sitecore-content-sdk/core';

/**
 * Returns the guest ID.
 * @returns {Promise<string>} A promise that resolves with the guest ID.
 * @throws If the Sitecore Edge context ID is incorrect.
 * @internal
 */
export async function getGuestId(): Promise<string> {
  const { config } = getCoreContext();

  const clientId = getAnalyticsPlugin().adapter.getClientId() || '';

  return fetchGuestIdFromEdgeProxy(clientId, config.contextId, config.edgeUrl);
}
