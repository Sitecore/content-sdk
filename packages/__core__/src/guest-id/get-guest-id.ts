import { getCookieValueClientSide } from '@sitecore-content-sdk/utils';
import { getCloudSDKSettings } from '../initializer/browser/initializer';
import { fetchGuestIdFromEdgeProxy } from './fetch-guest-id-from-edge-proxy';

/**
 * Returns the guest ID.
 * @returns {Promise<string>} A promise that resolves with the guest ID.
 * @throws Will throw an error if the Sitecore Edge context ID is incorrect.
 */
export async function getGuestId(): Promise<string> {
  const settings = getCloudSDKSettings();
  const id = getCookieValueClientSide(settings.cookieSettings.name.browserId);

  return fetchGuestIdFromEdgeProxy(id, settings.sitecoreEdgeContextId, settings.sitecoreEdgeUrl);
}
