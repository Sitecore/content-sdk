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

export interface AnalyticsOptions {
  cookies: {
    name: string;
    domain?: string;
    expiryDays: number;
    path?: string;
    enabled?: boolean;
  };
  proxyValues?: ProxySettings;
  timeout?: number;
}

export interface AnalyticsPlugin extends Plugin {
  options: AnalyticsOptions;
  adapter: AnalyticsAdapter;
  init: () => Promise<void>;
  name: typeof ANALYTICS_PLUGIN_NAME;
}
