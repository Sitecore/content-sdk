import { GroupDefinition, GroupContext, InitConfig, EnvironmentHandlers } from './models';

/**
 * Options for defining a group.
 * @public
 */
export interface DefineGroupOptions<TSettings> {
  /**
   * Unique identifier for the group (e.g., 'tracking', 'analytics')
   */
  name: string;
  /**
   * Default settings for the group. Can be overridden at init time.
   */
  defaultSettings: TSettings;
  /**
   * Validation function run once during init before plugin validation.
   * Should throw an error if validation fails.
   * @param context - The group context with resolved settings
   */
  validate?: (context: GroupContext<TSettings>) => void;
  /**
   * Initialization function run once when init is called.
   * Runs before any plugin init functions.
   * @param context - The group context with resolved settings
   */
  init?: (context: GroupContext<TSettings>) => void | Promise<void>;
  /**
   * Deferred initialization function.
   * Runs once when any plugin in this group triggers deferred init.
   * Runs before the plugin's own deferredInit.
   * @param context - The group context with resolved settings
   */
  deferredInit?: (context: GroupContext<TSettings>) => void | Promise<void>;
}

/**
 * Creates a group definition for shared initialization logic.
 *
 * Groups allow multiple plugins to share common setup operations
 * (like creating tracking cookies) without duplicating code.
 * The group's init/deferredInit will only run once, even if multiple
 * plugins belong to the same group.
 *
 * @example
 * ```typescript
 * // Define a tracking group with settings
 * interface TrackingGroupSettings {
 *   browserIdCookieName: string;
 *   browserIdCookieMaxAge: number;
 * }
 *
 * export const trackingGroup = defineGroup<TrackingGroupSettings>({
 *   name: 'tracking',
 *   defaultSettings: {
 *     browserIdCookieName: 'bid',
 *     browserIdCookieMaxAge: 86400 * 365
 *   },
 *   init: (ctx) => {
 *     // Create browser ID cookie if it doesn't exist
 *     const existingId = ctx.environment.getCookie?.(ctx.settings.browserIdCookieName);
 *     if (!existingId) {
 *       const newId = crypto.randomUUID();
 *       ctx.environment.setCookie?.(
 *         ctx.settings.browserIdCookieName,
 *         newId,
 *         { maxAge: ctx.settings.browserIdCookieMaxAge }
 *       );
 *     }
 *   }
 * });
 *
 * // Plugin uses the group
 * const eventsPlugin = createPlugin({
 *   name: '@sitecore-content-sdk/events',
 *   groups: [trackingGroup],
 *   // ...
 * });
 *
 * // Configure group settings at init time
 * await initSitecore({
 *   config: { sitecoreContextId: 'xxx' },
 *   plugins: [eventsPlugin()],
 *   groups: {
 *     tracking: {
 *       browserIdCookieName: 'my_custom_bid'
 *     }
 *   }
 * });
 * ```
 *
 * @param options - The group definition options
 * @returns A group definition object
 * @public
 */
export function defineGroup<TSettings>(
  options: DefineGroupOptions<TSettings>
): GroupDefinition<TSettings> {
  return {
    name: options.name,
    defaultSettings: options.defaultSettings,
    validate: options.validate,
    init: options.init,
    deferredInit: options.deferredInit,
  };
}

/**
 * Creates a GroupContext for a specific group.
 * @internal
 */
export function createGroupContext<TSettings>(
  config: InitConfig,
  environment: EnvironmentHandlers,
  settings: TSettings,
  isReady: () => boolean,
  ready: () => Promise<void>
): GroupContext<TSettings> {
  return {
    config,
    environment,
    settings,
    isReady,
    ready,
  };
}

