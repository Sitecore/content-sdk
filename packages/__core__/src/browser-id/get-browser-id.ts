import { getCookieValueClientSide } from '@sitecore-content-sdk/utils';
import { getCloudSDKSettings } from '../initializer/browser/initializer';

/**
 * Gets the browser ID from the cookie.
 * @returns {string} The browser ID if the cookie exists.
 */
export function getBrowserId(): string {
  const cloudSDKSettings = getCloudSDKSettings();

  return getCookieValueClientSide(cloudSDKSettings.cookieSettings.name.browserId);
}
