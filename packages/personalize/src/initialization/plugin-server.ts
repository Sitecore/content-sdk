import { PERSONALIZE_PLUGIN_NAME } from './const';
import {
  CLIENT_ID_COOKIE_NAME,
  COOKIE_NAME_PREFIX,
} from '@sitecore-content-sdk/analytics-core/internal';
import {
  PersonalizeEnvironment,
  PersonalizeServerPlugin,
  PersonalizeServerPluginOptions,
  PersonalizeServerSettings,
} from './types';
import { getPersonalizePlugin } from './shared';
import {
  ANALYTICS_PLUGIN_NAME,
  getAnalyticsPlugin,
} from '@sitecore-content-sdk/analytics-core/internal';

/**
 * Initializes the personalize plugin with the provided settings.
 * @internal
 */
async function init() {
  const personalizePlugin = getPersonalizePlugin();
  const personalizeSettings = personalizePlugin.settings as PersonalizeServerSettings;

  const analyticsPlugin = getAnalyticsPlugin();

  if (
    analyticsPlugin.settings.cookieSettings.enableCookie &&
    personalizeSettings.enablePersonalizeCookie
  )
    await personalizePlugin.environment.setGuestId();
}

interface PersonalizeServerPluginParams {
  environment: PersonalizeEnvironment;
  settings?: PersonalizeServerPluginOptions;
}

/**
 * Creates an personalize server plugin with the provided settings.
 * @param {PersonalizeServerPluginsOptions | undefined} settings - The personalize plugin settings to validate.
 * @returns {PersonalizeServerPlugin} The personalize plugin instance.
 * @public
 */
export function personalizeServerPlugin({
  settings,
  environment,
}: PersonalizeServerPluginParams): PersonalizeServerPlugin {
  const cookieSettings = {
    name: {
      guestId: `${COOKIE_NAME_PREFIX}${CLIENT_ID_COOKIE_NAME}_personalize`,
    },
  };

  const dependencies = [ANALYTICS_PLUGIN_NAME];

  const personalizeSettings = {
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
