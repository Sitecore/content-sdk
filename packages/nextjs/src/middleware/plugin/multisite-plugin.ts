import { NextRequest, NextResponse } from 'next/server';
import {
  createPlugin,
  Plugin,
  PluginSettingsBase,
  PluginContext,
} from '@sitecore-content-sdk/core/init';
import { SiteInfo } from '@sitecore-content-sdk/core/site';
import { MultisiteMiddleware, CookieAttributes } from '../multisite-middleware';

const PLUGIN_NAME = '@sitecore-content-sdk/nextjs/multisite';

/**
 * Settings for the multisite middleware plugin.
 * @public
 */
export interface MultisitePluginSettings extends PluginSettingsBase {
  /**
   * List of sites for site resolution
   */
  sites: SiteInfo[];
  /**
   * Fallback hostname when host header is not present
   * @default 'localhost'
   */
  defaultHostname?: string;
  /**
   * Fallback language when locale cannot be extracted from request URL
   * @default 'en'
   */
  defaultLanguage?: string;
  /**
   * Function to determine if middleware execution should be skipped
   */
  skip?: (req: NextRequest, res: NextResponse) => boolean;
  /**
   * Function to determine if cookie resolution should be used
   */
  useCookieResolution?: (req: NextRequest) => boolean;
  /**
   * Cookie attributes for the site cookie
   */
  cookieAttributes?: CookieAttributes;
}

// Store the middleware instance at module level
let multisiteMiddleware: MultisiteMiddleware | null = null;

/**
 * Gets the current MultisiteMiddleware instance.
 * @returns The middleware instance or null if not initialized
 * @internal
 */
export function getMultisiteMiddleware(): MultisiteMiddleware | null {
  return multisiteMiddleware;
}

/**
 * Creates the Multisite middleware plugin.
 *
 * This plugin handles multisite functionality including:
 * - Site resolution based on hostname
 * - Site-specific URL rewrites
 * - Site cookie management
 *
 * The plugin integrates with the SDK init system and exposes a middleware
 * handler that can be used in the Next.js middleware chain.
 *
 * @example
 * ```typescript
 * import { initSitecore } from '@sitecore-content-sdk/core';
 * import { multisitePlugin, getMultisiteMiddleware } from '@sitecore-content-sdk/nextjs/middleware';
 *
 * // Initialize outside middleware function
 * initSitecore({
 *   config: { sitecoreContextId: 'your-context-id' },
 *   plugins: [
 *     multisitePlugin({
 *       sites: sitesConfig,
 *       defaultHostname: 'localhost',
 *     })
 *   ]
 * });
 *
 * // In middleware function
 * export async function middleware(req: NextRequest) {
 *   const response = NextResponse.next();
 *
 *   // Get the initialized middleware and execute
 *   const multisite = getMultisiteMiddleware();
 *   if (multisite) {
 *     return multisite.handle(req, response);
 *   }
 *
 *   return response;
 * }
 * ```
 *
 * @param settings - Plugin settings including sites configuration
 * @returns A configured Multisite plugin
 * @public
 */
export function multisitePlugin(
  settings: MultisitePluginSettings
): Plugin<MultisitePluginSettings> {
  const resolvedSettings: MultisitePluginSettings = {
    enabled: true,
    ...settings,
  };

  return createPlugin<MultisitePluginSettings>({
    name: PLUGIN_NAME,
    settings: resolvedSettings,

    /**
     * Validate multisite configuration
     */
    validate: (ctx: PluginContext) => {
      if (!resolvedSettings.sites || resolvedSettings.sites.length === 0) {
        throw new Error(`[${PLUGIN_NAME}] 'sites' configuration is required`);
      }
    },

    /**
     * Initialize the multisite middleware (runs once)
     */
    init: (ctx: PluginContext) => {
      // Create the middleware instance with settings
      multisiteMiddleware = new MultisiteMiddleware({
        sites: resolvedSettings.sites,
        enabled: resolvedSettings.enabled,
        defaultHostname: resolvedSettings.defaultHostname,
        defaultLanguage: resolvedSettings.defaultLanguage,
        skip: resolvedSettings.skip,
        useCookieResolution: resolvedSettings.useCookieResolution,
      });
    },
  });
}

export { PLUGIN_NAME as MULTISITE_PLUGIN_NAME };

