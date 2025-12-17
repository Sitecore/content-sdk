/**
 * Configuration for SDK initialization.
 * Contains only the essential settings needed for the init system.
 * @public
 */
export interface InitConfig {
  /**
   * The Sitecore Edge context ID used for API connections and tracking.
   * This is the primary identifier for your XM Cloud instance.
   */
  sitecoreContextId: string;
  /**
   * Optional proxy URL for Sitecore Edge requests.
   * Use this when you need to route Edge API calls through a proxy.
   */
  sitecoreEdgeUrl?: string;
}

/**
 * Context passed to groups during initialization.
 * Similar to PluginContext but with access to the group's resolved settings.
 * @public
 */
export interface GroupContext<TSettings = unknown> {
  /**
   * The SDK initialization configuration
   */
  config: InitConfig;
  /**
   * Environment-specific handlers provided during initialization.
   */
  environment: EnvironmentHandlers;
  /**
   * The resolved settings for this group (merged from defaults and init options)
   */
  settings: TSettings;
  /**
   * Check if initialization has completed
   */
  isReady: () => boolean;
  /**
   * Promise that resolves when initialization is complete
   */
  ready: () => Promise<void>;
}

/**
 * Definition for a group that provides shared initialization logic.
 * Groups allow multiple plugins to share common setup operations
 * (like creating tracking cookies) without duplicating code.
 * @public
 */
export interface GroupDefinition<TSettings = unknown> {
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
 * Environment-specific handlers for cross-platform functionality.
 * These handlers abstract environment-specific operations like cookie access,
 * making plugins framework and runtime agnostic.
 * @public
 */
export interface EnvironmentHandlers {
  /**
   * Get a cookie value by name.
   * Implementation varies by environment (browser, Next.js middleware, etc.)
   * @param name - The cookie name
   * @returns The cookie value or undefined if not found
   */
  getCookie?: (name: string) => string | undefined;
  /**
   * Set a cookie with the given name and value.
   * @param name - The cookie name
   * @param value - The cookie value
   * @param options - Optional cookie options (maxAge, path, etc.)
   */
  setCookie?: (name: string, value: string, options?: CookieOptions) => void;
  /**
   * Delete a cookie by name.
   * @param name - The cookie name to delete
   */
  deleteCookie?: (name: string) => void;
  /**
   * Get a request header value.
   * @param name - The header name
   * @returns The header value or undefined
   */
  getHeader?: (name: string) => string | undefined;
  /**
   * Get the current URL/pathname.
   * @returns The current URL or pathname
   */
  getPathname?: () => string;
  /**
   * Custom environment handlers for extensibility.
   * Plugins can define their own handlers here.
   */
  [key: string]: unknown;
}

/**
 * Options for cookie operations.
 * @public
 */
export interface CookieOptions {
  /**
   * Max age in seconds
   */
  maxAge?: number;
  /**
   * Cookie path
   */
  path?: string;
  /**
   * Cookie domain
   */
  domain?: string;
  /**
   * Secure flag
   */
  secure?: boolean;
  /**
   * SameSite attribute
   */
  sameSite?: 'strict' | 'lax' | 'none';
  /**
   * HttpOnly flag
   */
  httpOnly?: boolean;
}

/**
 * Base interface for plugin settings.
 * All plugin settings should extend this interface.
 * @public
 */
export interface PluginSettingsBase {
  /**
   * Whether the plugin is enabled.
   * When false, the plugin's functionality should be skipped.
   * Useful for scenarios like cookie consent where functionality
   * must be disabled until user approval.
   * @default true
   */
  enabled?: boolean;
}

/**
 * Type for plugin settings update.
 * Used with updatePluginSettings to provide type-safe updates.
 * @public
 */
export type PluginSettingsUpdate<TSettings = unknown> = Partial<TSettings & PluginSettingsBase>;

/**
 * Dependency definition for a plugin.
 * Used to declare that a plugin requires another plugin to be present.
 * @public
 */
export interface PluginDependency {
  /**
   * The unique name of the required plugin (e.g., '@sitecore-content-sdk/events')
   */
  name: string;
  /**
   * Optional: A specific method that must exist on the dependency
   */
  method?: string;
}

/**
 * Context passed to plugins during initialization.
 * @public
 */
export interface PluginContext {
  /**
   * The SDK initialization configuration
   */
  config: InitConfig;
  /**
   * Environment-specific handlers provided during initialization.
   * Use these for cross-platform operations like cookie access.
   */
  environment: EnvironmentHandlers;
  /**
   * Function to get another enabled plugin by name
   */
  getPlugin: <T = unknown>(name: string) => Plugin<T> | undefined;
  /**
   * Check if initialization has completed
   */
  isReady: () => boolean;
  /**
   * Promise that resolves when initialization is complete
   */
  ready: () => Promise<void>;
}

/**
 * Plugin interface for extending SDK functionality.
 * Plugins are the standard way to add capabilities to the SDK.
 * @public
 */
export interface Plugin<TSettings = unknown> {
  /**
   * Unique identifier for the plugin (e.g., '@sitecore-content-sdk/events')
   */
  name: string;
  /**
   * Optional plugin-specific settings
   */
  settings?: TSettings;
  /**
   * List of plugins this plugin depends on
   */
  dependencies?: PluginDependency[];
  /**
   * Groups this plugin belongs to.
   * Groups provide shared initialization logic across multiple plugins.
   * When a plugin belongs to a group, the group's init/deferredInit
   * will run before the plugin's own init/deferredInit (but only once per group).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  groups?: GroupDefinition<any>[];
  /**
   * Validation function run once during init.
   * Should throw an error if validation fails.
   * @param context - The plugin context
   */
  validate?: (context: PluginContext) => void;
  /**
   * Initialization function run once when init is called for the first time.
   * Can be async for plugins that need to perform async setup.
   * @param context - The plugin context
   */
  init?: (context: PluginContext) => void | Promise<void>;
  /**
   * Hook that runs on every request/init call after the first initialization.
   * Use this for per-request logic like refreshing cookie TTLs, updating headers, etc.
   * This is called even when the SDK is already initialized.
   *
   * @example
   * ```typescript
   * createPlugin({
   *   name: 'cookie-refresh-plugin',
   *   onRequest: (ctx) => {
   *     // Refresh visitor cookie TTL on every request
   *     const visitorId = ctx.environment.getCookie?.('visitor_id');
   *     if (visitorId) {
   *       ctx.environment.setCookie?.('visitor_id', visitorId, { maxAge: 86400 * 365 });
   *     }
   *   }
   * });
   * ```
   *
   * @param context - The plugin context with fresh environment handlers
   */
  onRequest?: (context: PluginContext) => void | Promise<void>;
  /**
   * Deferred initialization function.
   * Only runs when the plugin's functionality is first accessed.
   * Use this for expensive operations that may not always be needed.
   * @param context - The plugin context
   */
  deferredInit?: (context: PluginContext) => void | Promise<void>;
}

/**
 * Options for initializing the Sitecore SDK.
 * Uses named parameters for better maintainability.
 * @public
 */
export interface InitOptions {
  /**
   * The SDK initialization configuration
   */
  config: InitConfig;
  /**
   * Array of plugins to enable
   */
  plugins?: Plugin[];
  /**
   * Environment-specific handlers for cross-platform functionality.
   * Pass handlers appropriate for your runtime environment.
   *
   * @example Browser environment
   * ```typescript
   * environment: {
   *   getCookie: (name) => {
   *     const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
   *     return match ? match[2] : undefined;
   *   },
   *   setCookie: (name, value, options) => {
   *     document.cookie = `${name}=${value}; path=${options?.path ?? '/'}`;
   *   }
   * }
   * ```
   *
   * @example Next.js middleware
   * ```typescript
   * environment: {
   *   getCookie: (name) => request.cookies.get(name)?.value,
   *   setCookie: (name, value, options) => response.cookies.set(name, value, options)
   * }
   * ```
   */
  environment?: EnvironmentHandlers;
}

/**
 * Internal state of the initialization.
 * @public
 */
export interface InitState {
  /**
   * Whether initialization has completed
   */
  initialized: boolean;
  /**
   * Whether initialization is currently in progress
   */
  initializing: boolean;
  /**
   * The SDK initialization configuration
   */
  config: InitConfig | null;
  /**
   * Environment-specific handlers
   */
  environment: EnvironmentHandlers;
  /**
   * Map of enabled plugins by name
   */
  plugins: Map<string, Plugin>;
  /**
   * Map of deferred init promises by plugin name
   */
  deferredInitPromises: Map<string, Promise<void>>;
  /**
   * Promise that resolves when initialization is complete
   */
  readyPromise: Promise<void> | null;
  /**
   * Map of registered groups by name, with their resolved settings
   */
  groups: Map<string, { definition: GroupDefinition; settings: unknown }>;
  /**
   * Set of groups that have completed their init phase
   */
  initializedGroups: Set<string>;
  /**
   * Map of deferred init promises by group name
   */
  deferredGroupInitPromises: Map<string, Promise<void>>;
}

