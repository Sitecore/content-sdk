import { PERSONALIZE_PLUGIN_NAME } from './const';
import { PACKAGE_VERSION } from '../consts';
import {
  CLIENT_ID_COOKIE_NAME,
  COOKIE_NAME_PREFIX,
} from '@sitecore-content-sdk/analytics-core/internal';
import {
  PersonalizeBrowserPlugin,
  PersonalizeEnvironment,
  PersonalizePluginOptions,
  PersonalizeSettings,
  WebPersonalizationSettings,
} from './types';
import { EVENTS_PLUGIN_NAME } from '@sitecore-content-sdk/events/internal';
import { getCoreSettings } from '@sitecore-content-sdk/core';
import { getCdnUrl } from '../web-personalization/get-cdn-url';
import { appendScriptWithAttributes } from '@sitecore-content-sdk/analytics-core/utils';
import { getPersonalizePlugin } from './shared';
import {
  ANALYTICS_PLUGIN_NAME,
  getAnalyticsPlugin,
} from '@sitecore-content-sdk/analytics-core/internal';
import { getGuestId } from './get-guest-id';

/**
 * Initializes the personalize plugin with the provided settings.
 * @internal
 */
async function init() {
  const coreConfig = getCoreSettings();
  const coreSettings = coreConfig.settings;
  const personalizePlugin = getPersonalizePlugin();
  const personalizeSettings = personalizePlugin.settings as PersonalizeSettings;

  const analyticsPlugin = getAnalyticsPlugin();

  if (
    analyticsPlugin.settings.cookieSettings.enableCookie &&
    personalizeSettings.enablePersonalizeCookie &&
    (!personalizePlugin.environment.getGuestId() ||
      personalizePlugin.environment.type !== 'browser')
  )
    await personalizePlugin.environment.setGuestId();

  if (typeof window === 'undefined') return;

  window.scContentSDK = {
    ...window.scContentSDK,
    personalize: {
      version: PACKAGE_VERSION,
      settings: {},
    },
    analytics_core: {
      ...window.scContentSDK?.analytics_core,
      getGuestId,
    },
  };

  if (!personalizeSettings.webPersonalization) return;

  window.scContentSDK.personalize.settings = personalizeSettings.webPersonalization;
  const cdnUrl = await getCdnUrl(coreSettings.contextId, coreSettings.edgeUrl);

  if (!cdnUrl) return;

  appendScriptWithAttributes({
    async: personalizeSettings.webPersonalization.async,
    src: cdnUrl,
  });
}

/**
 * Parameters for creating a personalize browser plugin.
 */
interface PersonalizeBrowserPluginParams {
  environment: PersonalizeEnvironment;
  settings?: PersonalizePluginOptions;
}

/**
 * Creates a personalize browser plugin with the provided environment and settings.
 * @param {PersonalizeBrowserPluginParams} params - The personalize plugin parameters including environment and settings.
 * @returns {PersonalizeBrowserPlugin} The configured personalize browser plugin.
 * @public
 */
export function personalizeBrowserPlugin({
  environment,
  settings,
}: PersonalizeBrowserPluginParams): PersonalizeBrowserPlugin {
  const cookieSettings = {
    name: {
      guestId: `${COOKIE_NAME_PREFIX}${CLIENT_ID_COOKIE_NAME}_personalize`,
    },
  };

  const dependencies = [ANALYTICS_PLUGIN_NAME];

  let webPersonalization: false | WebPersonalizationSettings;

  if (settings?.webPersonalization) {
    dependencies.push(EVENTS_PLUGIN_NAME);

    webPersonalization = {
      async: (settings.webPersonalization as WebPersonalizationSettings).async ?? true,
      defer: (settings.webPersonalization as WebPersonalizationSettings).defer ?? false,
      language: (settings.webPersonalization as WebPersonalizationSettings).language ?? undefined,
    };
  }
  webPersonalization ??= false as const;

  const personalizeSettings = {
    webPersonalization,
    enablePersonalizeCookie: settings?.enablePersonalizeCookie ?? false,
    cookieSettings,
  };

  return {
    name: PERSONALIZE_PLUGIN_NAME,
    init,
    dependencies,
    settings: personalizeSettings,
    environment,
  };
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface AnalyticsCore {
    getGuestId: typeof getGuestId;
  }
  // eslint-disable-next-line no-unused-vars
  interface ScContentSDK {
    personalize: {
      settings?: {
        async?: boolean;
        defer?: boolean;
      };
      version: string;
    };
  }
}
