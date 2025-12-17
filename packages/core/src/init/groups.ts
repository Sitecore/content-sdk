import { defineGroup } from './create-group';

/**
 * Settings for the tracking group.
 * Used by events and personalize packages for shared tracking functionality.
 * @public
 */
export interface TrackingGroupSettings {
  /**
   * The name of the cookie used to store the browser ID.
   * @default 'bid'
   */
  browserIdCookieName: string;
  /**
   * The max age of the browser ID cookie in seconds.
   * @default 31536000 (365 days)
   */
  browserIdCookieMaxAge: number;
}

/**
 * Tracking group for shared browser identification across packages.
 * Used by events and personalize packages to ensure consistent tracking.
 *
 * This group handles:
 * - Browser ID cookie creation and management
 * - Consistent cookie naming across packages
 *
 * @example
 * ```typescript
 * import { trackingGroup } from '@sitecore-content-sdk/core/init';
 * import { createPlugin } from '@sitecore-content-sdk/core/init';
 *
 * const myPlugin = createPlugin({
 *   name: 'my-tracking-plugin',
 *   groups: [trackingGroup],
 *   // ...
 * });
 * ```
 *
 * @public
 */
export const trackingGroup = defineGroup<TrackingGroupSettings>({
  name: 'tracking',
  defaultSettings: {
    browserIdCookieName: 'bid',
    browserIdCookieMaxAge: 365 * 24 * 60 * 60, // 1 year in seconds
  },
  deferredInit: (ctx) => {
    // Create browser ID cookie if it doesn't exist
    const { browserIdCookieName, browserIdCookieMaxAge } = ctx.settings;
    let browserId = ctx.environment.getCookie?.(browserIdCookieName);

    if (!browserId) {
      // Generate a new browser ID (UUID v4 format)
      browserId = generateBrowserId();
      ctx.environment.setCookie?.(browserIdCookieName, browserId, {
        maxAge: browserIdCookieMaxAge,
        path: '/',
      });
    }
  },
});

/**
 * Generates a browser ID in UUID v4 format.
 * Uses crypto.randomUUID if available, otherwise falls back to a manual implementation.
 * @internal
 */
function generateBrowserId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

