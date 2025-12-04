import { getCloudSDKSettings } from '../initializer/server/initializer';
import { fetchGuestIdFromEdgeProxy } from './fetch-guest-id-from-edge-proxy';

/**
 * A function that returns the guest ID.
 * @param browserId - The browser id of the client
 * @returns - A promise that resolves with the guest ID
 * @throws - Will throw an error if the sitecoreEdgeContextId is incorrect
 */
export async function getGuestIdServer(browserId: string) {
  const settings = getCloudSDKSettings();

  return fetchGuestIdFromEdgeProxy(
    browserId,
    settings.sitecoreEdgeContextId,
    settings.sitecoreEdgeUrl
  );
}
