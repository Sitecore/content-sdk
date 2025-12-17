import type { EPResponse, Settings } from '@sitecore-content-sdk/__core__/internal';
import type { InitConfig, TrackingGroupSettings } from '@sitecore-content-sdk/core';
import {
  getInitState,
  isInitialized,
  isPluginEnabled,
  triggerDeferredInit,
  getGroupSettings,
} from '@sitecore-content-sdk/core';
import { PACKAGE_NAME, DEFAULT_EDGE_URL } from '../../consts';
import { sendEvent } from '../send-event/sendEvent';
import type { PageViewData } from './page-view-event';
import { PageViewEvent } from './page-view-event';

/**
 * Creates a Settings object from the new InitConfig for backward compatibility
 * with existing event sending infrastructure.
 * @internal
 */
function createSettingsFromConfig(config: InitConfig, browserIdCookieName: string): Settings {
  return {
    sitecoreEdgeContextId: config.sitecoreContextId,
    siteName: '', // Not used in events, will be read from page context
    sitecoreEdgeUrl: config.sitecoreEdgeUrl || DEFAULT_EDGE_URL,
    cookieSettings: {
      name: {
        browserId: browserIdCookieName,
      },
      expiryDays: 365,
      path: '/',
    },
  };
}

/**
 * A function that sends a VIEW event to SitecoreCloud API.
 *
 * This function respects the `enabled` setting on the events plugin.
 * If the plugin is disabled (e.g., user hasn't accepted cookies), this function
 * returns null without sending the event.
 *
 * @param {PageViewData} [pageViewData] - The optional attributes in order to be send to SitecoreCloud API
 * This object will be flattened and sent in the ext object of the payload
 * @returns The response object that Sitecore EP returns, or null if plugin is disabled
 *
 * @example
 * ```typescript
 * // Basic usage
 * await pageView({ page: '/products' });
 *
 * // To enable/disable the plugin based on cookie consent:
 * import { updatePluginSettings } from '@sitecore-content-sdk/core';
 *
 * // When user accepts cookies
 * updatePluginSettings('@sitecore-content-sdk/events', { enabled: true });
 *
 * // When user declines cookies
 * updatePluginSettings('@sitecore-content-sdk/events', { enabled: false });
 * ```
 */
export async function pageView(pageViewData?: PageViewData): Promise<EPResponse | null> {
  if (!isInitialized()) {
    throw new Error(
      `[${PACKAGE_NAME}] SDK not initialized. Call initClient() with eventsPluginBrowser before using pageView.`
    );
  }

  // Check if the events plugin is enabled (e.g., user has accepted cookies)
  if (!isPluginEnabled(PACKAGE_NAME)) {
    // Plugin is disabled, silently return null
    return null;
  }

  // Ensure deferred init has run (sets up browser ID cookie via tracking group)
  await triggerDeferredInit(PACKAGE_NAME);

  const state = getInitState();
  const trackingSettings = getGroupSettings<TrackingGroupSettings>('tracking');

  if (!trackingSettings?.browserIdCookieName) {
    throw new Error(`[${PACKAGE_NAME}] Tracking group not properly initialized.`);
  }

  // Get browser ID from cookie (set by tracking group)
  const browserId = state.environment.getCookie?.(trackingSettings.browserIdCookieName);

  // Create settings adapter for backward compatibility
  const settings = createSettingsFromConfig(state.config!, trackingSettings.browserIdCookieName);

  return new PageViewEvent({
    id: browserId || '',
    pageViewData,
    searchParams: window.location.search,
    sendEvent,
    settings,
  }).send();
}
