import { ProxySettings } from '../interfaces';
import { Plugin, type PluginAdapter } from '@sitecore-content-sdk/core';
import { ANALYTICS_PLUGIN_NAME } from './const';

export interface AnalyticsAdapter extends PluginAdapter {
  getClientId: () => string | null;
  setClientId: () => Promise<void>;
  location: {
    getSearchParams: () => string;
  };
}

export interface AnalyticsSettings {
  cookieSettings: {
    name: {
      clientId: string;
    };
    domain?: string;
    expiryDays: number;
    path?: string;
    enableCookie?: boolean;
  };
  proxyValues?: ProxySettings;
  timeout?: number;
}

export interface AnalyticsPlugin extends Plugin {
  settings: AnalyticsSettings;
  adapter: AnalyticsAdapter;
  init: () => Promise<void>;
  name: typeof ANALYTICS_PLUGIN_NAME;
}
