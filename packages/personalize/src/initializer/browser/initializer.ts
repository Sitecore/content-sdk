import { CloudSDKBrowserInitializer } from '@sitecore-content-sdk/analytics-core/browser';
import {
  COOKIE_NAME_PREFIX,
  debug,
  enabledPackagesBrowser as enabledPackages,
  getCloudSDKSettingsBrowser as getCloudSDKSettings,
  getEnabledPackageBrowser,
  type PackageContextDependencyBrowser,
  PackageInitializer,
  BROWSER_ID_COOKIE_NAME,
} from '@sitecore-content-sdk/analytics-core/internal';
import {
  PACKAGE_NAME as EVENTS_PACKAGE_NAME,
  PACKAGE_INITIALIZER_METHOD_NAME,
} from '@sitecore-content-sdk/events/browser';
import { appendScriptWithAttributes } from '@sitecore-content-sdk/analytics-core/utils';
import { ErrorMessages, PACKAGE_NAME, PACKAGE_VERSION, PERSONALIZE_NAMESPACE } from '../../consts';
import { personalize } from '../../personalization/personalize';
import { getCdnUrl } from '../../web-personalization/get-cdn-url';
import { createPersonalizeCookie } from './createPersonalizeCookie';
import type {
  BrowserSettings,
  PersonalizeSettings,
  WebPersonalizationSettings,
} from './interfaces';

/**
 * Side effects function that runs after initialization to set up the personalize client library
 */
export async function sideEffects() {
  const personalizeSettings = getEnabledPackageBrowser(PACKAGE_NAME)
    ?.settings as PersonalizeSettings;
  const cloudSDKSettings = getCloudSDKSettings();

  window.scCloudSDK = {
    ...window.scCloudSDK,
    personalize: {
      personalize,
      version: PACKAGE_VERSION,
    },
  };

  if (personalizeSettings.webPersonalization) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    window.scCloudSDK.personalize.settings = personalizeSettings.webPersonalization;

    const cdnUrl = await getCdnUrl(
      cloudSDKSettings.sitecoreEdgeContextId,
      cloudSDKSettings.sitecoreEdgeUrl
    );
    if (cdnUrl)
      appendScriptWithAttributes({
        async: personalizeSettings.webPersonalization.async,
        src: cdnUrl,
      });
  }
  debug(PERSONALIZE_NAMESPACE)('personalizeClient library initialized');

  if (
    !cloudSDKSettings.cookieSettings.enableBrowserCookie ||
    !personalizeSettings.enablePersonalizeCookie
  )
    return;
  await createPersonalizeCookie(personalizeSettings, cloudSDKSettings);
}

/**
 * Makes the functionality of the personalize package available.
 * @param {BrowserSettings} [settings] - Configuration settings for the personalize package
 * @returns {CloudSDKBrowserInitializer} An instance of {@link CloudSDKBrowserInitializer}
 */
export function addPersonalize(
  this: CloudSDKBrowserInitializer,
  settings: BrowserSettings = { enablePersonalizeCookie: false }
): CloudSDKBrowserInitializer {
  const dependencies: PackageContextDependencyBrowser[] = [];

  const cookieSettings = {
    name: {
      guestId: `${COOKIE_NAME_PREFIX}${BROWSER_ID_COOKIE_NAME}_personalize`,
    },
  };

  let webPersonalization: boolean | WebPersonalizationSettings = false;

  if (settings.webPersonalization) {
    dependencies.push({ method: PACKAGE_INITIALIZER_METHOD_NAME, name: EVENTS_PACKAGE_NAME });

    webPersonalization = {
      async: (settings.webPersonalization as WebPersonalizationSettings).async ?? true,
      defer: (settings.webPersonalization as WebPersonalizationSettings).defer ?? false,
      language: (settings.webPersonalization as WebPersonalizationSettings).language ?? undefined,
    };
  }

  const personalizeInitializer = new PackageInitializer({
    dependencies,
    settings: { ...settings, cookieSettings, webPersonalization },
    sideEffects,
  });

  enabledPackages.set(PACKAGE_NAME, personalizeInitializer);

  return this;
}

CloudSDKBrowserInitializer.prototype.addPersonalize = addPersonalize;

declare module '@sitecore-content-sdk/analytics-core/browser' {
  // eslint-disable-next-line no-unused-vars
  interface CloudSDKBrowserInitializer {
    addPersonalize: typeof addPersonalize;
  }
}

/* eslint-disable @typescript-eslint/naming-convention*/
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, no-unused-vars
  interface Personalize {
    personalize?: typeof personalize;
    settings?: {
      async?: boolean;
      defer?: boolean;
    };
    version: string;
  }
}

/**
 * A function that handles the async browser init logic. Throws an error or awaits the promise.
 */
export async function awaitInit() {
  const initState = getEnabledPackageBrowser(PACKAGE_NAME)?.initState;

  if (!initState) throw new Error(ErrorMessages.IE_0016);

  await initState;
}
