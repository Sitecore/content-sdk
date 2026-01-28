import { debugNamespace, debugModule } from '@sitecore-content-sdk/core';

export const EVENTS_NAMESPACE = 'events';
/**
 * Debug module for content package
 * @public
 */
export const debug = {
  events: debugModule(`${debugNamespace}:${EVENTS_NAMESPACE}`),
};

