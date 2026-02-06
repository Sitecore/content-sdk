/**
 * Parameters for initContentSdk
 * @public
 */
export interface InitContentSdkParams {
  /** Initialization settings */
  config: {
    contextId: string;
    edgeUrl?: string;
    siteName: string;
  };
  /** Array of plugins to initialize */
  plugins: Plugin[];
}

/**
 * Internal config of the SDK initialization
 * @internal
 */
export interface CoreContext {
  /**
   * The SDK initialization config
   */
  config: { contextId: string; edgeUrl: string; siteName: string };
  /**
   * Map of enabled plugins by name
   */
  plugins: Map<string, Plugin>;
  /**
   * Promise that resolves when initialization is complete
   */
  readyPromise: Promise<void> | null;
}

/**
 * Dependency definition for a plugin.
 * Used to declare that a plugin requires another plugin to be present.
 * @public
 */
export type PluginDependency = string;

/**
 * Plugin interface for extending SDK functionality.
 * Plugins are the standard way to add capabilities to the SDK.
 * @template Options - Plugin-specific options type
 * @template Adapter - Plugin-specific adapter type
 * @public
 */
export interface Plugin<Options = unknown, Adapter = unknown> {
  /**
   * Unique identifier for the plugin (e.g., '@sitecore-content-sdk/events')
   */
  name: string;
  /**
   * Optional plugin-specific options
   */
  options?: Options;
  /**
   * List of plugins this plugin depends on
   */
  dependencies?: PluginDependency[];
  /**
   * Initialization function run once when init is called for the first time.
   * Can be async for plugins that need to perform async setup.
   */
  init?: () => void | Promise<void>;
  /**
   * Optional adapter requirements for the plugin.
   */
  adapter?: Adapter;
}

/**
 * Adapter definition for plugins.
 * @internal
 */
export interface PluginAdapter {
  type: 'browser' | (string & {});
}
