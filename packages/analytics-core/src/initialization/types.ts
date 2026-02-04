import { ProxySettings } from '../interfaces';
import { Plugin, type PluginEnvironment } from '@sitecore-content-sdk/core';
import { ANALYTICS_PLUGIN_NAME } from './const';

export interface AnalyticsEnvironment extends PluginEnvironment {
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
  environment: AnalyticsEnvironment;
  init: () => Promise<void>;
  name: typeof ANALYTICS_PLUGIN_NAME;
}
