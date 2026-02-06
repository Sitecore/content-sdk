import { PERSONALIZE_PLUGIN_NAME } from './const';
import { PACKAGE_VERSION } from '../consts';
import {
  CLIENT_ID_COOKIE_NAME,
  COOKIE_NAME_PREFIX,
} from '@sitecore-content-sdk/analytics-core/internal';
import {
  PersonalizeBrowserPlugin,
  PersonalizeAdapter,
  PersonalizePluginOptions,
  WebPersonalizationOptions,
  PersonalizeOptions,
} from './types';
import { EVENTS_PLUGIN_NAME } from '@sitecore-content-sdk/events/internal';
import { getCoreContext } from '@sitecore-content-sdk/core';
import { getCdnUrl } from '../web-personalization/get-cdn-url';
import { appendScriptWithAttributes } from '@sitecore-content-sdk/analytics-core/utils';
import { getPersonalizePlugin } from './shared';
import {
  ANALYTICS_PLUGIN_NAME,
  getAnalyticsPlugin,
} from '@sitecore-content-sdk/analytics-core/internal';
import { getGuestId } from './get-guest-id';
import { personalize } from '../personalization/personalize';

/**
 * Initializes the personalize plugin with the provided settings.
 * @internal
 */
async function init() {
  const coreConfig = getCoreContext().config;
  const personalizePlugin = getPersonalizePlugin();
  const personalizeOptions = personalizePlugin.options as PersonalizeOptions;
  const analyticsPlugin = getAnalyticsPlugin();

  if (
    analyticsPlugin.options.cookies.enabled &&
    personalizeOptions.cookies.enabled &&
    (!personalizePlugin.adapter.getGuestId() || personalizePlugin.adapter.type !== 'browser')
  )
    await personalizePlugin.adapter.setGuestId();

  if (typeof window === 'undefined') return;

  window.scContentSDK = {
    ...window.scContentSDK,
    personalize: {
      personalize,
      version: PACKAGE_VERSION,
      options: personalizeOptions.webPersonalization
        ? {
            async: personalizeOptions.webPersonalization.async,
            defer: personalizeOptions.webPersonalization.defer,
          }
        : {},
    },
    analytics_core: {
      ...window.scContentSDK?.analytics_core,
      getGuestId,
    },
  };

  if (!personalizeOptions.webPersonalization) return;

  window.scContentSDK.personalize.options = personalizeOptions.webPersonalization;
  const cdnUrl = await getCdnUrl(coreConfig.contextId, coreConfig.edgeUrl);

  if (!cdnUrl) return;

  appendScriptWithAttributes({
    async: personalizeOptions.webPersonalization.async,
    src: cdnUrl,
  });
}

/**
 * Parameters for creating a personalize browser plugin.
 */
interface PersonalizeBrowserPluginParams {
  adapter: PersonalizeAdapter;
  options?: PersonalizePluginOptions;
}

/**
 * Creates a personalize browser plugin with the provided adapter and options.
 * @param {PersonalizeBrowserPluginParams} params - The personalize plugin parameters including adapter and options.
 * @returns {PersonalizeBrowserPlugin} The configured personalize browser plugin.
 * @public
 */
export function personalizeBrowserPlugin(
  params: PersonalizeBrowserPluginParams
): PersonalizeBrowserPlugin {
  const { adapter, options } = params;
  const cookies = {
    enabled: options?.enablePersonalizeCookie ?? false,
    name: `${COOKIE_NAME_PREFIX}${CLIENT_ID_COOKIE_NAME}_personalize`,
  };

  const dependencies = [ANALYTICS_PLUGIN_NAME];

  let webPersonalization: false | WebPersonalizationOptions;

  if (options?.webPersonalization) {
    dependencies.push(EVENTS_PLUGIN_NAME);

    webPersonalization = {
      async: (options.webPersonalization as WebPersonalizationOptions).async ?? true,
      defer: (options.webPersonalization as WebPersonalizationOptions).defer ?? false,
      language: (options.webPersonalization as WebPersonalizationOptions).language ?? undefined,
    };
  }
  webPersonalization ??= false as const;

  const resolvedOptions = {
    webPersonalization,
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

declare global {
  // eslint-disable-next-line no-unused-vars
  interface AnalyticsCore {
    getGuestId: typeof getGuestId;
  }
  // eslint-disable-next-line no-unused-vars
  interface ScContentSDK {
    personalize: {
      personalize: typeof personalize;
      options?: {
        async?: boolean;
        defer?: boolean;
      };
      version: string;
    };
  }
}
