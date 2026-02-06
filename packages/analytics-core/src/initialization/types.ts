import { ResolvedVisitorIds } from '../interfaces';
import { Plugin, type PluginAdapter } from '@sitecore-content-sdk/core';
import { ANALYTICS_PLUGIN_NAME } from './const';

/**
 * Defines the structure of the analytics adapter, including methods for getting and setting the client ID, and retrieving search parameters from the location.
 */
export interface AnalyticsAdapter extends PluginAdapter {
  getClientId: () => string | null;
  setClientId: () => Promise<void>;
  location: {
    getSearchParams: () => string;
  };
}

/**
 * Defines the structure of the analytics plugin options, including cookie settings and proxy values.
 */
export interface AnalyticsOptions {
  cookies: {
    name: string;
    domain?: string;
    expiryDays: number;
    path?: string;
    enabled?: boolean;
  };
  resolvedVisitorIds?: ResolvedVisitorIds;
  timeout?: number;
}

/**
 * Defines the structure of the analytics plugin, including its initialization method, name, options, and adapter.
 */
export interface AnalyticsPlugin extends Plugin {
  options: AnalyticsOptions;
  adapter: AnalyticsAdapter;
  init: () => Promise<void>;
  name: typeof ANALYTICS_PLUGIN_NAME;
}
