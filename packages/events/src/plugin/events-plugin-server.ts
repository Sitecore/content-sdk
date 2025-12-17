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

/**
 * Creates the Events plugin for server environments (middleware, SSR, API routes).
 *
 * This plugin provides server-side event tracking functionality including:
 * - Browser ID cookie management (auto-refresh on each request)
 * - Server-side event tracking setup
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
 * import { eventsPluginServer } from '@sitecore-content-sdk/events/plugin';
 *
 * // In middleware.ts
 * export async function middleware(request: NextRequest) {
 *   const response = NextResponse.next();
 *
 *   await initMiddleware({
 *     config,
 *     request,
 *     response,
 *     plugins: [
 *       eventsPluginServer()
 *     ]
 *   });
 *
 *   return response;
 * }
 * ```
 *
 * @param settings - Optional plugin settings
 * @returns A configured Events plugin for server
 * @public
 */
export function eventsPluginServer(settings?: EventsPluginSettings): Plugin<EventsPluginSettings> {
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
     * Initialize the events plugin for server (runs once)
     * Note: Browser ID cookie is managed by the tracking group
     */
    init: () => {
      if (resolvedSettings.debug) {
        console.log(`[${EVENTS_NAMESPACE}] Events server plugin v${PACKAGE_VERSION} initialized`);
      }
    },
  });
}

export type { EventsPluginSettings };
export { getBrowserId } from './events-plugin-base';

