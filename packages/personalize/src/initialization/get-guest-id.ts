import { getAnalyticsPlugin } from '@sitecore-content-sdk/analytics-core/internal';
import { fetchGuestIdFromEdgeProxy } from '../guest-id/fetch-guest-id-from-edge-proxy';
import { getCoreSettings } from '@sitecore-content-sdk/core';

/**
 * Returns the guest ID.
 * @returns {Promise<string>} A promise that resolves with the guest ID.
 * @throws Will throw an error if the Sitecore Edge context ID is incorrect.
 * @internal
 */
export async function getGuestId(): Promise<string> {
  const { settings } = getCoreSettings();

  const clientId = getAnalyticsPlugin().environment.getClientId() || '';

  return fetchGuestIdFromEdgeProxy(clientId, settings.contextId, settings.sitecoreEdgeUrl);
}
