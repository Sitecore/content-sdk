import {
  COOKIE_NAME_PREFIX,
  debug,
  enabledPackagesServer as enabledPackages,
  getCloudSDKRequest,
  getCloudSDKResponse,
  getCloudSDKSettingsServer,
  getEnabledPackageServer,
  PackageInitializerServer,
  BROWSER_ID_COOKIE_NAME,
} from '@sitecore-content-sdk/analytics-core/internal';
import { CloudSDKServerInitializer } from '@sitecore-content-sdk/analytics-core/server';
import { ErrorMessages, PACKAGE_NAME, PERSONALIZE_NAMESPACE } from '../../consts';
import { createPersonalizeCookie } from './createPersonalizeCookie';
import type { PersonalizeSettings, ServerSettings } from './interfaces';

/**
 * Side effects function that runs after initialization to set up the personalize server library
 */
export async function sideEffects() {
  const cloudSDKSettings = getCloudSDKSettingsServer();
  const personalizeSettings = getEnabledPackageServer(PACKAGE_NAME)
    ?.settings as PersonalizeSettings;

  debug(PERSONALIZE_NAMESPACE)('personalizeServer library initialized');

  if (
    !cloudSDKSettings.cookieSettings.enableServerCookie ||
    !personalizeSettings.enablePersonalizeCookie
  )
    return;
  await createPersonalizeCookie(
    getCloudSDKRequest(),
    getCloudSDKResponse(),
    personalizeSettings,
    cloudSDKSettings
  );
}

/**
 * Makes the functionality of the personalize package available.
 * @param {ServerSettings} [settings] - Configuration settings for the personalize package
 * @returns {CloudSDKServerInitializer} An instance of {@link CloudSDKServerInitializer}
 */
export function addPersonalize(
  this: CloudSDKServerInitializer,
  settings: ServerSettings = { enablePersonalizeCookie: false }
): CloudSDKServerInitializer {
  const cookieSettings = {
    name: {
      guestId: `${COOKIE_NAME_PREFIX}${BROWSER_ID_COOKIE_NAME}_personalize`,
    },
  };

  const personalizeInitializer = new PackageInitializerServer({
    settings: { ...settings, cookieSettings },
    sideEffects,
  });

  enabledPackages.set(PACKAGE_NAME, personalizeInitializer);

  return this;
}

CloudSDKServerInitializer.prototype.addPersonalize = addPersonalize;

declare module '@sitecore-content-sdk/analytics-core/server' {
  // eslint-disable-next-line no-unused-vars
  interface CloudSDKServerInitializer {
    addPersonalize: typeof addPersonalize;
  }
}

/**
 * Verifies that the personalize package has been initialized
 * @throws {Error} Error if the personalize package is not enabled
 */
export function verifyPersonalizePackageExistence() {
  if (!getEnabledPackageServer(PACKAGE_NAME)) throw Error(ErrorMessages.IE_0017);
}
