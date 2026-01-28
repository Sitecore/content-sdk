import { Plugin } from '@sitecore-content-sdk/core';
import { EVENTS_PLUGIN_NAME } from './const';

export interface EventsPlugin extends Plugin {
  init: () => Promise<void>;
  name: typeof EVENTS_PLUGIN_NAME;
  dependencies: string[];
}

