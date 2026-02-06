import { Plugin } from '@sitecore-content-sdk/core';
import { EVENTS_PLUGIN_NAME } from './const';

/**
 * Defines the structure of the events plugin, including its initialization method, name, and dependencies.
 */
export interface EventsPlugin extends Plugin {
  init: () => Promise<void>;
  name: typeof EVENTS_PLUGIN_NAME;
  dependencies: string[];
}
