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
   * Default: false.
   */
  enablePersonalizeCookie?: boolean;
  /**
   * Whether to enable web personalization.
   *
   * If true, a web personalization script will load in your app with async but without defer.
   *
   * To customize the loading of the script, set the value to an object, and in the object, use the async, defer, and language attributes.
   *
   * Default: false.
   */
  webPersonalization?: boolean | Partial<WebPersonalizationOptions>;
}

/**
 * Parameters for creating a personalize server plugin.
 * @public
 */
export type PersonalizeServerPluginOptions = Omit<PersonalizePluginOptions, 'webPersonalization'>;

/**
 * Represents the resolved personalize plugin options.
 * @internal
 */
export interface PersonalizeOptions {
  webPersonalization: false | WebPersonalizationOptions;
  cookies: {
    enabled: boolean;
    name: string;
  };
}

/**
 * Represents the personalize plugin interface.
 * @internal
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
  options: PersonalizeServerOptions;
  init: () => Promise<void>;
  name: typeof PERSONALIZE_PLUGIN_NAME;
  dependencies: string[];
  adapter: PersonalizeAdapter;
}

/**
 * Represents the personalize adapter interface that defines the methods to get and set the profile id, and optionally get the user agent.
 * @internal
 */
export interface PersonalizeAdapter extends PluginAdapter {
  getProfileId: () => string | null;
  setProfileId: () => Promise<void>;
  getUserAgent?: () => string | undefined;
}
