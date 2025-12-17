import {
  createPlugin,
  Plugin,
  PluginContext,
  PluginSettingsBase,
} from '@sitecore-content-sdk/core';
import { PACKAGE_NAME, PACKAGE_VERSION, PERSONALIZE_NAMESPACE } from '../consts';

/**
 * Personalize plugin settings.
 * Extends PluginSettingsBase for the enabled flag.
 * @public
 */
export interface PersonalizePluginSettings extends PluginSettingsBase {
  /**
   * Guest ID cookie name for personalization.
   * @default 'gid_<sitecoreEdgeContextId>'
   */
  guestIdCookieName?: string;
  /**
   * Whether to enable web personalization features.
   * @default false
   */
  webPersonalization?: boolean | WebPersonalizationSettings;
  /**
   * Whether to enable personalize cookie creation.
   * @default false
   */
  enablePersonalizeCookie?: boolean;
  /**
   * Whether to enable debug logging.
   * @default false
   */
  debug?: boolean;
}

/**
 * Web personalization settings for client-side personalization.
 * @public
 */
export interface WebPersonalizationSettings {
  /**
   * Whether to load the personalization script asynchronously.
   * @default true
   */
  async?: boolean;
  /**
   * Whether to defer loading the personalization script.
   * @default false
   */
  defer?: boolean;
  /**
   * Language for personalization.
   */
  language?: string;
}

/**
 * Generates the default guest ID cookie name based on context ID.
 * @param contextId - The Sitecore Edge context ID
 * @returns The cookie name
 */
export function getDefaultGuestIdCookieName(contextId: string): string {
  return `gid_${contextId.substring(0, 8)}`;
}

/**
 * Validates the personalize plugin configuration.
 * @param ctx - The plugin context
 */
export function validatePersonalizeConfig(ctx: PluginContext): void {
  const { config } = ctx;

  // Personalize requires an Edge context ID
  if (!config.sitecoreContextId) {
    throw new Error(
      `[${PERSONALIZE_NAMESPACE}] Personalize plugin requires a Sitecore context ID. ` +
        'Please provide sitecoreContextId in your config.'
    );
  }
}

/**
 * Resolves the guest ID cookie name from settings or generates default.
 * @param settings - The plugin settings
 * @param ctx - The plugin context
 */
export function resolveGuestIdCookieName(
  settings: PersonalizePluginSettings,
  ctx: PluginContext
): string {
  if (settings.guestIdCookieName) {
    return settings.guestIdCookieName;
  }
  return getDefaultGuestIdCookieName(ctx.config.sitecoreContextId);
}

// Re-export for convenience
export {
  createPlugin,
  Plugin,
  PluginContext,
  PACKAGE_NAME,
  PACKAGE_VERSION,
  PERSONALIZE_NAMESPACE,
};

