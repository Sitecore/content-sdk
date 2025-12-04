import { getCookieValueClientSide } from '@sitecore-content-sdk/utils';
import { getCloudSDKSettings } from '../initializer/browser/initializer';

/**
 * Get the browser ID from the cookie
 * @returns The browser ID if the cookie exists
 */
export function getBrowserId() {
  const cloudSDKSettings = getCloudSDKSettings();
  return getCookieValueClientSide(cloudSDKSettings.cookieSettings.name.browserId);
}
