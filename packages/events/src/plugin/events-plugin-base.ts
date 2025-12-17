import {
  createPlugin,
  Plugin,
  PluginContext,
  CookieOptions,
  PluginSettingsBase,
  updatePluginSettings,
  isPluginEnabled,
} from '@sitecore-content-sdk/core';
import { PACKAGE_NAME, PACKAGE_VERSION, EVENTS_NAMESPACE } from '../consts';

/**
 * Events plugin settings.
 * Extends PluginSettingsBase for the enabled flag.
 * @public
 */
export interface EventsPluginSettings extends PluginSettingsBase {
  /**
   * Browser ID cookie name.
   * @default 'bid_<sitecoreEdgeContextId>'
   */
  browserIdCookieName?: string;
  /**
   * Browser ID cookie max age in seconds.
   * @default 31536000 (1 year)
   */
  browserIdCookieMaxAge?: number;
  /**
   * Whether to enable debug logging.
   * @default false
   */
  debug?: boolean;
}

/**
 * Default cookie max age: 1 year in seconds
 */
export const DEFAULT_COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

/**
 * Generates the default browser ID cookie name based on context ID.
 * @param contextId - The Sitecore Edge context ID
 * @returns The cookie name
 */
export function getDefaultBrowserIdCookieName(contextId: string): string {
  return `bid_${contextId.substring(0, 8)}`;
}

/**
 * Generates a new browser ID (UUID v4).
 * @returns A new browser ID
 */
export function generateBrowserId(): string {
  // Use crypto.randomUUID if available, otherwise fallback
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Validates the events plugin configuration.
 * @param ctx - The plugin context
 */
export function validateEventsConfig(ctx: PluginContext): void {
  const { config } = ctx;

  // Events requires an Edge context ID for tracking
  if (!config.sitecoreContextId) {
    throw new Error(
      `[${EVENTS_NAMESPACE}] Events plugin requires a Sitecore context ID. ` +
        'Please provide sitecoreContextId in your config.'
    );
  }
}

/**
 * Resolves the browser ID cookie name from settings or generates default.
 * @param settings - The plugin settings
 * @param ctx - The plugin context
 */
export function resolveBrowserIdCookieName(
  settings: EventsPluginSettings,
  ctx: PluginContext
): string {
  if (settings.browserIdCookieName) {
    return settings.browserIdCookieName;
  }
  return getDefaultBrowserIdCookieName(ctx.config.sitecoreContextId);
}

/**
 * Handles browser ID cookie management on each request.
 * @param ctx - The plugin context
 * @param settings - The resolved plugin settings
 */
export function handleBrowserIdCookie(
  ctx: PluginContext,
  settings: Required<
    Pick<EventsPluginSettings, 'browserIdCookieName' | 'browserIdCookieMaxAge' | 'debug'>
  >
): void {
  const { environment } = ctx;
  const { browserIdCookieName, browserIdCookieMaxAge, debug } = settings;

  // Get or create browser ID
  let browserId = environment.getCookie?.(browserIdCookieName);

  if (!browserId) {
    // Generate new browser ID
    browserId = generateBrowserId();

    if (debug) {
      console.log(`[${EVENTS_NAMESPACE}] Generated new browser ID: ${browserId}`);
    }
  }

  // Refresh cookie TTL on every request
  const cookieOptions: CookieOptions = {
    maxAge: browserIdCookieMaxAge,
    path: '/',
    sameSite: 'lax',
  };

  environment.setCookie?.(browserIdCookieName, browserId, cookieOptions);

  if (debug) {
    console.log(`[${EVENTS_NAMESPACE}] Browser ID cookie refreshed: ${browserIdCookieName}`);
  }
}

/**
 * Gets the browser ID from the current environment.
 * Must be called after initialization.
 *
 * @param ctx - The plugin context
 * @param settings - The events plugin settings
 * @returns The browser ID or undefined if not found
 * @public
 */
export function getBrowserId(
  ctx: PluginContext,
  settings: EventsPluginSettings
): string | undefined {
  if (!settings.browserIdCookieName) {
    return undefined;
  }
  return ctx.environment.getCookie?.(settings.browserIdCookieName);
}

/**
 * Updates the events plugin settings.
 * This is a type-safe wrapper around the core `updatePluginSettings` function.
 *
 * Common use cases:
 * - Enabling/disabling events based on cookie consent
 * - Changing debug mode at runtime
 *
 * @example
 * ```typescript
 * import { updateEventsSettings, isEventsEnabled } from '@sitecore-content-sdk/events';
 *
 * // When user accepts cookies
 * updateEventsSettings({ enabled: true });
 *
 * // When user declines cookies
 * updateEventsSettings({ enabled: false });
 *
 * // Check if events are enabled
 * if (isEventsEnabled()) {
 *   await pageView({ page: '/home' });
 * }
 *
 * // Enable debug mode
 * updateEventsSettings({ debug: true });
 * ```
 *
 * @param settings - Partial settings to merge with existing settings
 * @throws Error if the SDK is not initialized
 * @public
 */
export function updateEventsSettings(settings: Partial<EventsPluginSettings>): void {
  updatePluginSettings<EventsPluginSettings>(PACKAGE_NAME, settings);
}

/**
 * Checks if the events plugin is currently enabled.
 * Returns false if the SDK is not initialized or if the plugin is disabled.
 *
 * @example
 * ```typescript
 * import { isEventsEnabled, updateEventsSettings } from '@sitecore-content-sdk/events';
 *
 * // Check before sending events
 * if (isEventsEnabled()) {
 *   await pageView({ page: '/home' });
 * }
 *
 * // Or use in conditional rendering
 * {isEventsEnabled() && <AnalyticsOptOutButton />}
 * ```
 *
 * @returns true if events are enabled, false otherwise
 * @public
 */
export function isEventsEnabled(): boolean {
  return isPluginEnabled(PACKAGE_NAME);
}

export { PACKAGE_NAME, PACKAGE_VERSION, EVENTS_NAMESPACE };
export type { Plugin, PluginContext, CookieOptions };
export { createPlugin };

