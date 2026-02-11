import { Plugin } from '@sitecore-content-sdk/core';
import { EVENTS_PLUGIN_NAME } from './const';

/**
 * Defines the structure of the events plugin, including its initialization method, name, and dependencies.
 * @public
 */
export interface EventsPlugin extends Plugin {
  /**
   * Initializes the events plugin, which may involve setting up necessary configurations or performing any asynchronous operations required for the plugin to function properly.
   * @returns A promise that resolves when the initialization is complete.
   */
  init: () => Promise<void>;
  /**
   * The name of the events plugin.
   */
  name: typeof EVENTS_PLUGIN_NAME;
  /**
   * An array of plugin names that the events plugin depends on. This ensures that the required plugins are initialized before the events plugin is initialized.
   */
  dependencies: string[];
}
