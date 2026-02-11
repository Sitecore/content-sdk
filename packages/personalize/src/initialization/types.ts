import { PluginAdapter } from '@sitecore-content-sdk/core';
import { PERSONALIZE_PLUGIN_NAME } from './const';

/**
 * Represents the web personalization options.
 * @public
 */
export interface WebPersonalizationOptions {
  /**
   * Whether to load the web personalization script with the async attribute.
   */
  async: boolean;
  /**
   * Whether to load the web personalization script with the defer attribute.
   */
  defer: boolean;
  /**
   * The language to be used for web personalization.
   */
  language?: string;
}

/**
 * Parameters for creating a personalize plugin.
 * @public
 */
export interface PersonalizePluginOptions {
  /**
   * Whether to set the sc_cid_personalize cookie.
   *
   * If using only the browser plugin of the personalize package, set to true.
   *
   * If using both the browser and the server plugins of the personalize package, set enablePersonalizeCookie to true either on the browser or the server, and set to false on the other.
   *
   * If enableCookie of analytics plugin is false, enablePersonalizeCookie will not be set.
   *
   * Default: `false`.
   */
  enablePersonalizeCookie?: boolean;
  /**
   * Whether to enable web personalization.
   *
   * If true, a web personalization script will load in your app with async but without defer.
   *
   * To customize the loading of the script, set the value to an object, and in the object, use the async, defer, and language attributes.
   *
   * Default: `false`.
   */
  webPersonalization?: boolean | Partial<WebPersonalizationOptions>;
}

/**
 * Parameters for creating a personalize server plugin.
 * @public
 */
export type PersonalizeServerPluginOptions = Omit<PersonalizePluginOptions, 'webPersonalization'>;

/**
 * Represents the personalize plugin options.
 * @public
 */
export interface PersonalizeOptions {
  /**
   * The web personalization options.
   */
  webPersonalization: false | WebPersonalizationOptions;
  /**
   * The cookie settings for the personalize plugin, including whether the cookie is enabled and the name of the cookie.
   */
  cookies: {
    /**
     * Whether the sc_cid_personalize cookie is enabled.
     */
    enabled: boolean;
    /**
     * The name of the sc_cid_personalize cookie.
     */
    name: string;
  };
}

/**
 * Represents the personalize plugin interface.
 * @public
 */
export type PersonalizeServerOptions = Omit<PersonalizeOptions, 'webPersonalization'>;

/**
 * Represents the personalize plugin interface.
 * @internal
 */
export interface PersonalizePlugin {
  options: PersonalizeOptions | PersonalizeServerOptions;
  init: () => Promise<void>;
  name: typeof PERSONALIZE_PLUGIN_NAME;
  dependencies: string[];
  adapter: PersonalizeAdapter;
}

/**
 * Represents the personalize browser plugin interface.
 * @public
 */
export interface PersonalizeBrowserPlugin {
  /**
   * The options for the personalize browser plugin, including web personalization and cookie settings.
   */
  options: PersonalizeOptions;
  /**
   * Initializes the personalize browser plugin, which may involve setting up necessary configurations, loading scripts, or performing any asynchronous operations required for the plugin to function properly.
   * @returns A promise that resolves when the initialization is complete.
   */
  init: () => Promise<void>;
  /**
   * The name of the personalize plugin.
   */
  name: typeof PERSONALIZE_PLUGIN_NAME;
  /**
   * An array of plugin names that the personalize browser plugin depends on. This ensures that the required plugins are initialized before the personalize plugin is initialized.
   */
  dependencies: string[];
  /**
   * The adapter for the personalize browser plugin, which provides methods to get and set the profile id, and optionally get the user agent. The adapter allows the personalize plugin to interact with the underlying platform or environment in a consistent way.
   */
  adapter: PersonalizeAdapter;
}

/**
 * Represents the personalize server plugin interface.
 * @public
 */
export interface PersonalizeServerPlugin {
  /**
   * The options for the personalize server plugin, including cookie settings.
   */
  options: PersonalizeServerOptions;
  /**
   * Initializes the personalize server plugin, which may involve setting up necessary configurations or performing any asynchronous operations required for the plugin to function properly.
   * @returns A promise that resolves when the initialization is complete.
   */
  init: () => Promise<void>;
  /**
   * The name of the personalize plugin.
   */
  name: typeof PERSONALIZE_PLUGIN_NAME;
  /**
   * An array of plugin names that the personalize server plugin depends on. This ensures that the required plugins are initialized before the personalize plugin is initialized.
   */
  dependencies: string[];
  /**
   * The adapter for the personalize server plugin, which provides methods to get and set the profile id, and optionally get the user agent. The adapter allows the personalize plugin to interact with the underlying platform or environment in a consistent way.
   */
  adapter: PersonalizeAdapter;
}

/**
 * Represents the personalize adapter interface that defines the methods to get and set the profile id, and optionally get the user agent.
 * @public
 */
export interface PersonalizeAdapter extends PluginAdapter {
  /**
   * Gets the profile ID. The method returns a string representing the profile ID if it exists, or null if it does not exist.
   * @returns {string | null} The profile ID or null if not found.
   */
  getProfileId: () => string | null;
  /**
   * Sets the profile ID. The method may involve asynchronous operations, such as setting cookies or making API calls, and returns a promise that resolves when the profile ID has been set.
   * @returns {Promise<void>} A promise that resolves when the profile ID has been set.
   */
  setProfileId: () => Promise<void>;
  /**
   * Optionally gets the user agent string. The method returns a string representing the user agent if it is available, or undefined if it is not available. This method can be used to provide additional context for personalization based on the user's device or browser.
   * @returns {string | undefined} The user agent string or undefined.
   */
  getUserAgent?: () => string | undefined;
}
