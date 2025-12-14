import { getGuestId, type Settings } from '@sitecore-content-sdk/__core__/browser';
import {
  getCookiesValuesFromEdgeBrowser,
  getDefaultCookieAttributes,
} from '@sitecore-content-sdk/__core__/internal';
import { createCookieString, getCookieValueClientSide } from '@sitecore-content-sdk/utils';
import type { PersonalizeSettings } from './interfaces';

/**
 * Creates the personalize cookie for browser environments
 * @param {PersonalizeSettings} personalizeSettings - Personalize package settings
 * @param {Settings} cloudSDKSettings - Cloud SDK settings
 * @returns {Promise<void>} Promise that resolves when cookie is created
 */
export async function createPersonalizeCookie(
  personalizeSettings: PersonalizeSettings,
  cloudSDKSettings: Settings
): Promise<void> {
  const cookiesValuesFromEdgeBrowser = getCookiesValuesFromEdgeBrowser();

  const attributes = getDefaultCookieAttributes(
    cloudSDKSettings.cookieSettings.expiryDays,
    cloudSDKSettings.cookieSettings.domain
  );

  const guestIdCookieValue = getCookieValueClientSide(
    personalizeSettings.cookieSettings.name.guestId
  );
  const browserIdCookieValue = getCookieValueClientSide(
    cloudSDKSettings.cookieSettings.name.browserId
  );

  if (guestIdCookieValue) return;
  else if (cookiesValuesFromEdgeBrowser?.guestId)
    document.cookie = createCookieString(
      personalizeSettings.cookieSettings.name.guestId,
      cookiesValuesFromEdgeBrowser.guestId,
      attributes
    );
  else if (browserIdCookieValue) {
    const guestIdCookieValue = await getGuestId();

    document.cookie = createCookieString(
      personalizeSettings.cookieSettings.name.guestId,
      guestIdCookieValue,
      attributes
    );
  }
}
