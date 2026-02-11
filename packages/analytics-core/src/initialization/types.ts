import { VisitorIds } from '../interfaces';
import { Plugin, type PluginAdapter } from '@sitecore-content-sdk/core';
import { ANALYTICS_PLUGIN_NAME } from './const';

/**
 * Defines the structure of the analytics adapter, including methods for getting and setting the client ID, and retrieving search parameters from the location.
 * @public
 */
export interface AnalyticsAdapter extends PluginAdapter {
  /**
   * Gets the client ID.
   * @returns {string | null} The client ID, or null if it is not set.
   */
  getClientId: () => string | null;
  /**
   * Sets the client ID.
   * @returns {Promise<void>} A promise that resolves when the client ID has been set.
   */
  setClientId: () => Promise<void>;
  /**
   * The location object, which provides a method for getting search parameters.
   */
  location: {
    /**
     * Gets the search parameters from the location.
     * @returns {string} The search parameters from the location.
     */
    getSearchParams: () => string;
  };
}

/**
 * Defines options for the Analytics plugin.
 * @public
 */
export interface AnalyticsOptions {
  /**
   * The cookie settings for the analytics plugin.
   */
  cookies: {
    /**
     * The name of the cookie used to store the client ID.
     */
    name: string;
    /**
     * The domain for which the cookie is valid.
     */
    domain?: string;
    /**
     * The number of days until the cookie expires.
     */
    expiryDays: number;
    /**
     * The path for which the cookie is valid.
     */
    path?: string;
    /**
     * Whether the cookie should be set.
     */
    enabled?: boolean;
  };
  /**
   * The visitor IDs returned from the Edge Proxy.
   */
  visitorIds?: VisitorIds;
  /**
   * The timeout duration for the analytics plugin, in milliseconds.
   */
  timeout?: number;
}

/**
 * Defines the structure of the analytics plugin, including its initialization method, name, options, and adapter.
 * @public
 */
export interface AnalyticsPlugin extends Plugin {
  /**
   * The options for the analytics plugin.
   */
  options: AnalyticsOptions;
  /**
   * The adapter for the analytics plugin, which provides methods to get and set the client ID, and access location search parameters. The adapter allows the analytics plugin to interact with the underlying platform or environment in a consistent way.
   */
  adapter: AnalyticsAdapter;
  /**
   * Initializes the analytics plugin, which may involve setting up necessary configurations, loading scripts, or performing any asynchronous operations required for the plugin to function properly.
   * @returns A promise that resolves when the initialization is complete.
   */
  init: () => Promise<void>;
  /**
   * The name of the analytics plugin.
   */
  name: typeof ANALYTICS_PLUGIN_NAME;
}
