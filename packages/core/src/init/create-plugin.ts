import { Plugin, PluginDependency, PluginContext, GroupDefinition } from './models';

/**
 * Options for creating a plugin.
 * @public
 */
export interface CreatePluginOptions<TSettings = unknown> {
  /**
   * Unique identifier for the plugin
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
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  groups?: GroupDefinition<any>[];
  /**
   * Validation function run once during init
   */
  validate?: (context: PluginContext) => void;
  /**
   * Initialization function run once when init is called for the first time
   */
  init?: (context: PluginContext) => void | Promise<void>;
  /**
   * Hook that runs on every request/init call after the first initialization.
   * Use this for per-request logic like refreshing cookie TTLs, tracking, etc.
   */
  onRequest?: (context: PluginContext) => void | Promise<void>;
  /**
   * Deferred initialization function (runs on first access)
   */
  deferredInit?: (context: PluginContext) => void | Promise<void>;
}

/**
 * Factory function to create a plugin with proper typing.
 * Provides a clean API for plugin authors.
 *
 * @example
 * ```typescript
 * const myPlugin = createPlugin({
 *   name: '@my-org/my-plugin',
 *   dependencies: [{ name: '@sitecore-content-sdk/events' }],
 *   validate: (ctx) => {
 *     if (!ctx.config.api.edge.contextId) {
 *       throw new Error('Edge context ID required');
 *     }
 *   },
 *   init: async (ctx) => {
 *     // Async initialization - runs once
 *   },
 *   onRequest: (ctx) => {
 *     // Per-request logic - runs on every init call
 *     const visitorId = ctx.environment.getCookie?.('visitor_id');
 *     if (visitorId) {
 *       ctx.environment.setCookie?.('visitor_id', visitorId, { maxAge: 86400 * 365 });
 *     }
 *   }
 * });
 * ```
 *
 * @param options - Plugin configuration options
 * @returns A configured Plugin instance
 * @public
 */
export function createPlugin<TSettings = unknown>(
  options: CreatePluginOptions<TSettings>
): Plugin<TSettings> {
  return {
    name: options.name,
    settings: options.settings,
    dependencies: options.dependencies,
    groups: options.groups,
    validate: options.validate,
    init: options.init,
    onRequest: options.onRequest,
    deferredInit: options.deferredInit,
  };
}

