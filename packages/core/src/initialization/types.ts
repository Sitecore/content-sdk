/**
 * Options for initSitecore
 */
export interface InitSitecoreOptions {
  /** Initialization settings */
  settings: {
    contextId: string;
    sitecoreEdgeUrl?: string;
    siteName: string;
  };
  /** Array of plugins to initialize */
  plugins: Plugin[];
}

/**
 * Internal settings of the SDK initialization
 */
export interface CoreSettings {
  /**
   * The SDK initialization settings
   */
  settings: { contextId: string; sitecoreEdgeUrl: string; siteName: string };
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
 * @internal
 */
export type PluginDependency = string;

/**
 * Plugin interface for extending SDK functionality.
 * Plugins are the standard way to add capabilities to the SDK.
 * @template Settings - Plugin-specific settings type
 * @internal
 */
export interface Plugin<Settings = unknown, Environment = unknown> {
  /**
   * Unique identifier for the plugin (e.g., '@sitecore-content-sdk/events')
   */
  name: string;
  /**
   * Optional plugin-specific settings
   */
  settings?: Settings;
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
   * Optional environment requirements for the plugin.
   */
  environment?: Environment;
}

export interface PluginEnvironment {
  type: 'browser' | (string & {});
}
