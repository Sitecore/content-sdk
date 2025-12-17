import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';
import {
  createPlugin,
  Plugin,
  PluginSettingsBase,
  PluginContext,
  PluginDependency,
} from '@sitecore-content-sdk/core/init';
import { debug } from '@sitecore-content-sdk/core';
import { SiteInfo } from '@sitecore-content-sdk/core/site';
import {
  PersonalizeMiddleware,
  PersonalizeMiddlewareConfig,
  PersonalizeGeoData,
  ExperienceParams,
} from '../personalize-middleware';

const PLUGIN_NAME = '@sitecore-content-sdk/nextjs/personalize-middleware';

/**
 * The name of the personalize plugin that this middleware depends on.
 * The personalize plugin handles guest ID cookie management and provides
 * the core personalization functionality.
 */
const PERSONALIZE_PLUGIN_NAME = '@sitecore-content-sdk/personalize';

/**
 * Settings for the personalize middleware plugin.
 *
 * Note: `contextId` and `edgeUrl` are automatically taken from the core config
 * (`sitecoreContextId` and `sitecoreEdgeUrl`) passed to `initSitecore`.
 *
 * @public
 */
export interface PersonalizeMiddlewarePluginSettings extends PluginSettingsBase {
  /**
   * List of sites for site resolution
   */
  sites: SiteInfo[];
  /**
   * The Sitecore Edge Client Context ID (for client-side)
   * Only needed if different from the server-side contextId
   */
  clientContextId?: string;
  /**
   * Timeout for Edge requests in milliseconds
   */
  edgeTimeout?: number;
  /**
   * Timeout for CDP requests in milliseconds
   */
  cdpTimeout?: number;
  /**
   * Scope for personalization queries
   */
  scope?: string;
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
   * Callback to extract geo data for personalization
   */
  extractGeoDataCb?: (req?: NextRequest) => Promise<PersonalizeGeoData> | PersonalizeGeoData;
  /**
   * Callback to get extra UTM parameters
   */
  getExtraUtmParams?: (req: NextRequest) => Partial<ExperienceParams['utm']>;
}

// Store the middleware instance at module level
let personalizeMiddleware: PersonalizeMiddleware | null = null;

/**
 * Gets the current PersonalizeMiddleware instance.
 * @returns The middleware instance or null if not initialized
 * @public
 */
export function getPersonalizeMiddleware(): PersonalizeMiddleware | null {
  return personalizeMiddleware;
}

/**
 * Creates the Personalize middleware plugin.
 *
 * This plugin handles personalization functionality including:
 * - Fetching personalization rules from Experience Edge
 * - Executing personalization decisions via CDP
 * - URL rewrites for personalized content variants
 *
 * The plugin integrates with the SDK init system and exposes a middleware
 * handler that can be used in the Next.js middleware chain.
 *
 * This plugin depends on the `@sitecore-content-sdk/personalize` plugin which handles
 * guest ID cookie management. The personalize plugin must be registered alongside this
 * middleware plugin.
 *
 * @example
 * ```typescript
 * import { initSitecore } from '@sitecore-content-sdk/core';
 * import { personalizePluginServer } from '@sitecore-content-sdk/personalize/plugin';
 * import {
 *   personalizeMiddlewarePlugin,
 *   executeMiddlewares
 * } from '@sitecore-content-sdk/nextjs/middleware';
 *
 * // Initialize outside middleware function
 * // contextId and edgeUrl are automatically taken from core config
 * initSitecore({
 *   config: { sitecoreContextId: 'your-context-id', sitecoreEdgeUrl: 'https://edge.sitecorecloud.io' },
 *   plugins: [
 *     // Required: Personalize plugin handles guest ID cookie management
 *     personalizePluginServer(),
 *     // Middleware plugin handles personalization decisions and rewrites
 *     personalizeMiddlewarePlugin({
 *       sites: sitesConfig,
 *     })
 *   ]
 * });
 *
 * // In middleware function
 * export async function middleware(req: NextRequest, ev: NextFetchEvent) {
 *   const response = NextResponse.next();
 *
 *   // Execute all middleware plugins (multisite, personalize, etc.)
 *   return executeMiddlewares(req, ev, { response });
 * }
 * ```
 *
 * @param settings - Plugin settings including personalization configuration
 * @returns A configured Personalize middleware plugin
 * @public
 */
export function personalizeMiddlewarePlugin(
  settings: PersonalizeMiddlewarePluginSettings
): Plugin<PersonalizeMiddlewarePluginSettings> {
  const resolvedSettings: PersonalizeMiddlewarePluginSettings = {
    enabled: true,
    ...settings,
  };

  return createPlugin<PersonalizeMiddlewarePluginSettings>({
    name: PLUGIN_NAME,
    settings: resolvedSettings,

    /**
     * Declare dependency on the personalize plugin.
     * The personalize plugin handles guest ID cookie management and
     * must be initialized before this middleware can function properly.
     */
    dependencies: [{ name: PERSONALIZE_PLUGIN_NAME }],

    /**
     * Validate personalize configuration
     */
    validate: (ctx: PluginContext) => {
      if (!resolvedSettings.sites || resolvedSettings.sites.length === 0) {
        throw new Error(`[${PLUGIN_NAME}] 'sites' configuration is required`);
      }
      // Note: contextId validation is done inside PersonalizeMiddleware constructor
      // which will log a warning if not present
    },

    /**
     * Initialize the personalize middleware (runs once)
     */
    init: (ctx: PluginContext) => {
      // Create the middleware instance with settings
      // contextId and edgeUrl come from core config
      personalizeMiddleware = new PersonalizeMiddleware({
        sites: resolvedSettings.sites,
        enabled: resolvedSettings.enabled,
        contextId: ctx.config.sitecoreContextId,
        clientContextId: resolvedSettings.clientContextId,
        edgeUrl: ctx.config.sitecoreEdgeUrl,
        edgeTimeout: resolvedSettings.edgeTimeout,
        cdpTimeout: resolvedSettings.cdpTimeout,
        scope: resolvedSettings.scope,
        defaultHostname: resolvedSettings.defaultHostname,
        defaultLanguage: resolvedSettings.defaultLanguage,
        skip: resolvedSettings.skip,
        extractGeoDataCb: resolvedSettings.extractGeoDataCb,
        getExtraUtmParams: resolvedSettings.getExtraUtmParams,
      });
    },
  });
}

export { PLUGIN_NAME as PERSONALIZE_MIDDLEWARE_PLUGIN_NAME };

