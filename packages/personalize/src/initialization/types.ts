import { PluginAdapter } from '@sitecore-content-sdk/core';
import { PERSONALIZE_PLUGIN_NAME } from './const';

export type WebPersonalizationOptions = { async: boolean; defer: boolean; language?: string };

export interface PersonalizePluginOptions {
  enablePersonalizeCookie?: boolean;
  webPersonalization?: boolean | Partial<WebPersonalizationOptions>;
}

export type PersonalizeServerPluginOptions = Omit<PersonalizePluginOptions, 'webPersonalization'>;

export interface PersonalizeOptions {
  webPersonalization: false | WebPersonalizationOptions;
  cookies: {
    enabled: boolean;
    name: string;
  };
}

export type PersonalizeServerOptions = Omit<PersonalizeOptions, 'webPersonalization'>;

export interface PersonalizePlugin {
  options: PersonalizeOptions | PersonalizeServerOptions;
  init: () => Promise<void>;
  name: typeof PERSONALIZE_PLUGIN_NAME;
  dependencies: string[];
  adapter: PersonalizeAdapter;
}

export interface PersonalizeBrowserPlugin {
  options: PersonalizeOptions;
  init: () => Promise<void>;
  name: typeof PERSONALIZE_PLUGIN_NAME;
  dependencies: string[];
  adapter: PersonalizeAdapter;
}

export interface PersonalizeServerPlugin {
  options: PersonalizeServerOptions;
  init: () => Promise<void>;
  name: typeof PERSONALIZE_PLUGIN_NAME;
  dependencies: string[];
  adapter: PersonalizeAdapter;
}

export interface PersonalizeAdapter extends PluginAdapter {
  getProfileId: () => string | null;
  setProfileId: () => Promise<void>;
  getUserAgent?: () => string | undefined;
}
