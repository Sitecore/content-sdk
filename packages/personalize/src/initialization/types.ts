import { PluginAdapter } from '@sitecore-content-sdk/core';
import { PERSONALIZE_PLUGIN_NAME } from './const';

export type WebPersonalizationSettings = { async: boolean; defer: boolean; language?: string };

export interface PersonalizePluginOptions {
  enablePersonalizeCookie?: boolean;
  webPersonalization?: boolean | Partial<WebPersonalizationSettings>;
}

export type PersonalizeServerPluginOptions = Omit<PersonalizePluginOptions, 'webPersonalization'>;

export interface PersonalizeSettings {
  webPersonalization: false | WebPersonalizationSettings;
  enablePersonalizeCookie: boolean;
  cookieSettings: {
    name: {
      guestId: string;
    };
  };
}

export type PersonalizeServerSettings = Omit<PersonalizeSettings, 'webPersonalization'>;

export interface PersonalizePlugin {
  settings: PersonalizeSettings | PersonalizeServerSettings;
  init: () => Promise<void>;
  name: typeof PERSONALIZE_PLUGIN_NAME;
  dependencies: string[];
  adapter: PersonalizeAdapter;
}

export interface PersonalizeBrowserPlugin {
  settings: PersonalizeSettings;
  init: () => Promise<void>;
  name: typeof PERSONALIZE_PLUGIN_NAME;
  dependencies: string[];
  adapter: PersonalizeAdapter;
}

export interface PersonalizeServerPlugin {
  settings: PersonalizeServerSettings;
  init: () => Promise<void>;
  name: typeof PERSONALIZE_PLUGIN_NAME;
  dependencies: string[];
  adapter: PersonalizeAdapter;
}

export interface PersonalizeAdapter extends PluginAdapter {
  getGuestId: () => string | null;
  setGuestId: () => Promise<void>;
  getUserAgent?: () => string | undefined;
}
