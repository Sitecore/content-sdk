import { getCloudSDKSettings } from '../initializer/server/initializer';
import { fetchGuestIdFromEdgeProxy } from './fetch-guest-id-from-edge-proxy';

/**
 * Returns the guest ID for the given browser ID.
 * @param {string} browserId - The browser ID of the client.
 * @returns {Promise<string>} A promise that resolves with the guest ID.
 * @throws Will throw an error if the Sitecore Edge context ID is incorrect.
 */
export async function getGuestIdServer(browserId: string): Promise<string> {
  const settings = getCloudSDKSettings();

  return fetchGuestIdFromEdgeProxy(
    browserId,
    settings.sitecoreEdgeContextId,
    settings.sitecoreEdgeUrl
  );
}
