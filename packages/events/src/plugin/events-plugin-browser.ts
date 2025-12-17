import debug from 'debug';
import { trackingGroup } from '@sitecore-content-sdk/core';
import {
  createPlugin,
  Plugin,
  EventsPluginSettings,
  PACKAGE_NAME,
  PACKAGE_VERSION,
  EVENTS_NAMESPACE,
  validateEventsConfig,
} from './events-plugin-base';
import { event } from '../events/custom-event/event';
import { form } from '../events/custom-event/form';
import { identity } from '../events/identity/identity';
import { pageView } from '../events/page-view/page-view';
import { addToEventQueue } from '../eventStorage/addToEventQueue';
import { clearEventQueue } from '../eventStorage/clearEventQueue';
import { processEventQueue } from '../eventStorage/processEventQueue';

/**
 * Creates the Events plugin for browser environments.
 *
 * This plugin provides event tracking functionality including:
 * - Browser ID cookie management (auto-refresh on each request)
 * - Page view tracking
 * - Custom event tracking
 * - Identity tracking
 * - Exposes events API on window.scCloudSDK.events
 *
 * @example
 * ```typescript
 * import { initClient } from '@sitecore-content-sdk/nextjs/init';
 * import { eventsPluginBrowser } from '@sitecore-content-sdk/events/plugin';
 *
 * // In a useEffect or client component
 * await initClient({
 *   config,
 *   plugins: [
 *     eventsPluginBrowser({
 *       browserIdCookieMaxAge: 60 * 60 * 24 * 365, // 1 year
 *     })
 *   ]
 * });
 *
 * // Then use the global API
 * window.scCloudSDK.events.pageView({ page: '/home' });
 * ```
 *
 * @param settings - Optional plugin settings
 * @returns A configured Events plugin for browser
 * @public
 */
export function eventsPluginBrowser(settings?: EventsPluginSettings): Plugin<EventsPluginSettings> {
  const resolvedSettings: EventsPluginSettings = {
    debug: false,
    ...settings,
  };

  return createPlugin<EventsPluginSettings>({
    name: PACKAGE_NAME,
    settings: resolvedSettings,
    groups: [trackingGroup],

    validate: validateEventsConfig,
    /**
     * Initialize the events plugin for browser (runs once)
     * Sets up window.scCloudSDK.events API
     * Note: Browser ID cookie is managed by the tracking group
     */
    deferredInit: () => {
      if (resolvedSettings.debug) {
        console.log(`[${EVENTS_NAMESPACE}] Events browser plugin v${PACKAGE_VERSION} initialized`);
      }

      // Expose events API on window object
      window.scCloudSDK = {
        ...window.scCloudSDK,
        events: {
          addToEventQueue,
          clearEventQueue,
          event,
          form,
          identity,
          pageView,
          processEventQueue,
          version: PACKAGE_VERSION,
        },
      };

      debug(EVENTS_NAMESPACE)('Events client library initialized on window.scCloudSDK.events');
    },
  });
}

export type { EventsPluginSettings };
export { getBrowserId } from './events-plugin-base';

