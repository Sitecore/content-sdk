import { getCookieValueClientSide } from '@sitecore-content-sdk/utils';
import { getCloudSDKSettings } from '../initializer/browser/initializer';
import { fetchGuestIdFromEdgeProxy } from './fetch-guest-id-from-edge-proxy';

/**
 * A function that returns the guest ID.
 * @returns - A promise that resolves with the guest ID
 * @throws - Will throw an error if the sitecoreEdgeContextId is incorrect
 */
export async function getGuestId() {
  const settings = getCloudSDKSettings();
  const id = getCookieValueClientSide(settings.cookieSettings.name.browserId);

  return fetchGuestIdFromEdgeProxy(id, settings.sitecoreEdgeContextId, settings.sitecoreEdgeUrl);
}
