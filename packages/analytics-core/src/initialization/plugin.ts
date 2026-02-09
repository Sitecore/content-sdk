import { AnalyticsAdapter, AnalyticsPlugin } from './types';
import {
  CLIENT_ID_COOKIE_NAME,
  COOKIE_NAME_PREFIX,
  DEFAULT_COOKIE_EXPIRY_DAYS,
  LIBRARY_VERSION,
} from '../consts';
import { ANALYTICS_PLUGIN_NAME } from './const';
import { getCoreContext, debug, CoreContext } from '@sitecore-content-sdk/core';
import { getClientId } from '../client-id/get-client-id';
const debugInit = debug.init;

/**
 * Parameters for creating an analytics plugin.
 * @public
 */
export interface AnalyticsPluginParams {
  /**
   * Optional configuration options for the analytics plugin.
   */
  options?: {
    /**
     * The domain for which the cookie is valid.
     */
    cookieDomain?: string;
    /**
     * The number of days until the cookie expires.
     */
    cookieExpiryDays?: number;
    /**
     * The path for which the cookie is valid.
     */
    cookiePath?: string;
    /**
     * Whether the cookie should be set.
     */
    enableCookie?: boolean;
    /**
     * The timeout duration for the analytics plugin, in milliseconds.
     */
    timeout?: number;
  };
  /**
   * The adapter to be used for the analytics plugin.
   */
  adapter: AnalyticsAdapter;
}

/**
 * Creates an analytics plugin with the provided options.
 * @param {AnalyticsPluginParams} params - The parameters for the analytics plugin.
 * @returns {AnalyticsPlugin} The analytics plugin instance.
 * @public
 */
export function analyticsPlugin(params: AnalyticsPluginParams): AnalyticsPlugin {
  const { options, adapter } = params;

  const resolvedOptions = {
    cookies: {
      domain: options?.cookieDomain,
      enabled: options?.enableCookie ?? false,
      expiryDays: options?.cookieExpiryDays || DEFAULT_COOKIE_EXPIRY_DAYS,
      name: `${COOKIE_NAME_PREFIX}${CLIENT_ID_COOKIE_NAME}`,
      path: options?.cookiePath || '/',
    },
    timeout: options?.timeout,
  };

  return {
    name: ANALYTICS_PLUGIN_NAME,
    init,
    options: resolvedOptions,
    adapter,
  };
}

/**
 * Initializes the analytics plugin with the provided options.
 * @internal
 */
async function init() {
  debugInit(`Initializing ${ANALYTICS_PLUGIN_NAME}`);
  const coreContext = getCoreContext();
  const analyticsPlugin = getAnalyticsPlugin();

  if (!analyticsPlugin.options.cookies.enabled) {
    debugInit(
      `Cookies are disabled for ${ANALYTICS_PLUGIN_NAME}. If this was not intentional, set "enableCookie" to "true".`
    );
    return;
  }

  const adapter = analyticsPlugin.adapter;

  if (!adapter.getClientId() || analyticsPlugin.adapter.type !== 'browser') {
    await adapter.setClientId();
    debugInit(`Cookie set for ${ANALYTICS_PLUGIN_NAME}`);
  }

  if (analyticsPlugin.adapter.type === 'browser')
    window.scContentSDK = {
      ...window.scContentSDK,
      analytics_core: {
        getClientId,
        options: {
          siteName: coreContext.config.siteName,
          contextId: coreContext.config.contextId,
          edgeUrl: coreContext.config.edgeUrl,
        },
        version: LIBRARY_VERSION,
      },
    };
}

/**
 * Retrieves the analytics plugin instance from the core context.
 * @returns {AnalyticsPlugin} The analytics plugin instance.
 * @internal
 */
export function getAnalyticsPlugin(): AnalyticsPlugin {
  const plugin = getCoreContext().plugins.get(ANALYTICS_PLUGIN_NAME) as AnalyticsPlugin | undefined;

  if (!plugin)
    throw new Error(
      `[IE-004] - You must first add "${ANALYTICS_PLUGIN_NAME}" to the "initContentSdk()" "plugins" array.`
    );

  return plugin;
}

declare global {
  interface AnalyticsCore {
    getClientId: typeof getClientId;
    options: CoreContext['config'];
    version: string;
  }
  interface ScContentSDK {
    analytics_core: AnalyticsCore;
  }
  // eslint-disable-next-line no-unused-vars
  interface Window {
    scContentSDK: ScContentSDK;
  }
}
