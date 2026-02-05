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
 */
interface AnalyticsPluginOptions {
  settings?: {
    cookieDomain?: string;
    cookieExpiryDays?: number;
    cookiePath?: string;
    enableCookie?: boolean;
    timeout?: number;
  };
  adapter: AnalyticsAdapter;
}

/**
 * Creates an analytics plugin with the provided options.
 * @param {AnalyticsPluginOptions} options - The parameters for the analytics plugin.
 * @returns {AnalyticsPlugin} The analytics plugin instance.
 * @public
 */
export function analyticsPlugin(options: AnalyticsPluginOptions): AnalyticsPlugin {
  const { settings, adapter } = options;

  const analyticsSettings = {
    cookieSettings: {
      domain: settings?.cookieDomain,
      enableCookie: settings?.enableCookie ?? false,
      expiryDays: settings?.cookieExpiryDays || DEFAULT_COOKIE_EXPIRY_DAYS,
      name: {
        clientId: `${COOKIE_NAME_PREFIX}${CLIENT_ID_COOKIE_NAME}`,
      },
      path: settings?.cookiePath || '/',
    },
    timeout: settings?.timeout,
  };

  return {
    name: ANALYTICS_PLUGIN_NAME,
    init,
    settings: analyticsSettings,
    adapter,
  };
}

/**
 * Initializes the analytics plugin with the provided settings.
 * @internal
 */
async function init() {
  debugInit(`Initializing ${ANALYTICS_PLUGIN_NAME}`);
  const coreContext = getCoreContext();
  const analyticsPlugin = getAnalyticsPlugin();

  if (!analyticsPlugin.settings.cookieSettings.enableCookie) {
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
        settings: {
          siteName: coreContext.settings.siteName,
          contextId: coreContext.settings.contextId,
          edgeUrl: coreContext.settings.edgeUrl,
        },
        version: LIBRARY_VERSION,
      },
    };
}

/**
 * Retrieves the analytics plugin instance from the core configuration.
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
    settings: CoreContext['settings'];
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
