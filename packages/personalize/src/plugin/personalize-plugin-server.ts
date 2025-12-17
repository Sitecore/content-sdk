import { trackingGroup, PluginContext } from '@sitecore-content-sdk/core';
import {
  createPlugin,
  Plugin,
  PersonalizePluginSettings,
  PACKAGE_NAME,
  validatePersonalizeConfig,
} from './personalize-plugin-base';

/**
 * Settings specific to the server personalize plugin.
 * @public
 */
export interface PersonalizeServerSettings extends Omit<PersonalizePluginSettings, 'enabled'> {}

/**
 * Default settings for the server personalize plugin.
 */
const DEFAULT_SETTINGS: PersonalizeServerSettings = {
  debug: false,
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
 * Creates the Personalize plugin for server environments (middleware, SSR, API routes).
 *
 * This plugin provides server-side personalization functionality including:
 * - Integration with tracking group for browser ID management
 * - Server-side personalization setup
 *
 * Use this plugin in:
 * - Next.js middleware
 * - Server components
 * - API routes
 * - SSR contexts
 *
 * @example
 * ```typescript
 * import { initMiddleware } from '@sitecore-content-sdk/nextjs/init';
 * import { personalizePluginServer } from '@sitecore-content-sdk/personalize/plugin';
 *
 * export async function middleware(request: NextRequest) {
 *   const response = NextResponse.next();
 *
 *   await initMiddleware({
 *     config,
 *     request,
 *     response,
 *     plugins: [personalizePluginServer()]
 *   });
 *
 *   return response;
 * }
 * ```
 *
 * @param settings - Optional settings for the personalize plugin
 * @returns A configured Plugin instance for server-side personalization
 * @public
 */
export function personalizePluginServer(settings?: PersonalizeServerSettings): Plugin {
  const mergedSettings: PersonalizeServerSettings = {
    ...DEFAULT_SETTINGS,
    ...settings,
  };

  return createPlugin({
    name: PACKAGE_NAME,
    settings: mergedSettings,
    groups: [trackingGroup],

    validate: validatePersonalizeConfig,
  });
}

export { PersonalizePluginSettings };

