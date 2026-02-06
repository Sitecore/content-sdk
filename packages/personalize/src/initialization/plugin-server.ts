import { PERSONALIZE_PLUGIN_NAME } from './const';
import {
  CLIENT_ID_COOKIE_NAME,
  COOKIE_NAME_PREFIX,
} from '@sitecore-content-sdk/analytics-core/internal';
import {
  PersonalizeAdapter,
  PersonalizeServerPlugin,
  PersonalizeServerPluginOptions,
  PersonalizeServerOptions,
} from './types';
import { getPersonalizePlugin } from './shared';
import {
  ANALYTICS_PLUGIN_NAME,
  getAnalyticsPlugin,
} from '@sitecore-content-sdk/analytics-core/internal';

/**
 * Initializes the personalize plugin with the provided options.
 * @internal
 */
async function init() {
  const personalizePlugin = getPersonalizePlugin();
  const personalizeOptions = personalizePlugin.options as PersonalizeServerOptions;
  const analyticsPlugin = getAnalyticsPlugin();

  if (analyticsPlugin.options.cookies.enabled && personalizeOptions.cookies.enabled)
    await personalizePlugin.adapter.setGuestId();
}

interface PersonalizeServerPluginParams {
  adapter: PersonalizeAdapter;
  options?: PersonalizeServerPluginOptions;
}

/**
 * Creates an personalize server plugin with the provided options.
 * @param {PersonalizeServerPluginParams} params - The parameters for the personalize plugin.
 * @returns {PersonalizeServerPlugin} The personalize plugin instance.
 * @public
 */
export function personalizeServerPlugin(
  params: PersonalizeServerPluginParams
): PersonalizeServerPlugin {
  const { adapter, options } = params;
  const cookies = {
    enabled: options?.enablePersonalizeCookie ?? false,
    name: `${COOKIE_NAME_PREFIX}${CLIENT_ID_COOKIE_NAME}_personalize`,
  };

  const dependencies = [ANALYTICS_PLUGIN_NAME];

  const resolvedOptions = {
    cookies,
  };

  return {
    name: PERSONALIZE_PLUGIN_NAME,
    init,
    dependencies,
    options: resolvedOptions,
    adapter,
  };
}
