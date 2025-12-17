import { trackingGroup, PluginContext } from '@sitecore-content-sdk/core';
import {
  createPlugin,
  Plugin,
  PersonalizePluginSettings,
  WebPersonalizationSettings,
  PACKAGE_NAME,
  PACKAGE_VERSION,
  validatePersonalizeConfig,
} from './personalize-plugin-base';
import { personalize } from '../personalization/personalize';

/**
 * Settings specific to the browser personalize plugin.
 * @public
 */
export interface PersonalizeBrowserSettings extends Omit<PersonalizePluginSettings, 'enabled'> {}

/**
 * Default settings for the browser personalize plugin.
 */
const DEFAULT_SETTINGS: PersonalizeBrowserSettings = {
  debug: false,
  webPersonalization: false,
  enablePersonalizeCookie: false,
};

/**
 * Gets the guest ID from cookies.
 * @param ctx - The plugin context
 * @param settings - The plugin settings with guestIdCookieName
 * @returns The guest ID or undefined
 * @public
 */
export function getGuestId(
  ctx: PluginContext,
  settings: { guestIdCookieName?: string }
): string | undefined {
  if (!settings.guestIdCookieName) {
    return undefined;
  }
  return ctx.environment.getCookie?.(settings.guestIdCookieName);
}

/**
 * Creates the Personalize plugin for browser environments.
 *
 * This plugin provides client-side personalization functionality including:
 * - Integration with tracking group for browser ID management
 * - Web personalization script loading
 * - Personalization cookie support
 *
 * Use this plugin in:
 * - Client-side React components
 * - Browser-based applications
 * - Single Page Applications (SPAs)
 *
 * @example
 * ```typescript
 * import { initSitecore } from '@sitecore-content-sdk/core';
 * import { personalizePluginBrowser } from '@sitecore-content-sdk/personalize/plugin';
 *
 * await initSitecore({
 *   config: { sitecoreContextId: 'your-context-id' },
 *   plugins: [personalizePluginBrowser()],
 * });
 * ```
 *
 * @param settings - Optional settings for the personalize plugin
 * @returns A configured Plugin instance for browser personalization
 * @public
 */
export function personalizePluginBrowser(settings?: PersonalizeBrowserSettings): Plugin {
  const mergedSettings: PersonalizeBrowserSettings = {
    ...DEFAULT_SETTINGS,
    ...settings,
  };

  // Normalize webPersonalization settings
  if (mergedSettings.webPersonalization === true) {
    mergedSettings.webPersonalization = {
      async: true,
      defer: false,
    };
  } else if (
    mergedSettings.webPersonalization &&
    typeof mergedSettings.webPersonalization === 'object'
  ) {
    mergedSettings.webPersonalization = {
      async: (mergedSettings.webPersonalization as WebPersonalizationSettings).async ?? true,
      defer: (mergedSettings.webPersonalization as WebPersonalizationSettings).defer ?? false,
      language: (mergedSettings.webPersonalization as WebPersonalizationSettings).language,
    };
  }

  return createPlugin({
    name: PACKAGE_NAME,
    settings: mergedSettings,
    groups: [trackingGroup],

    validate: validatePersonalizeConfig,

    deferredInit: () => {
      // Expose personalize API on window.scCloudSDK.personalize
      if (typeof window !== 'undefined') {
        window.scCloudSDK = {
          ...window.scCloudSDK,
          personalize: {
            ...window.scCloudSDK?.personalize,
            personalize,
            version: PACKAGE_VERSION,
          },
        };

        // Add web personalization settings if enabled
        if (
          mergedSettings.webPersonalization &&
          typeof mergedSettings.webPersonalization === 'object'
        ) {
          (window.scCloudSDK as any).personalize.settings = mergedSettings.webPersonalization;
        }
      }
    },
  });
}

export { PersonalizePluginSettings, WebPersonalizationSettings };

