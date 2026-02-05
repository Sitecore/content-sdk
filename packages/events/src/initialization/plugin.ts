import { getCoreContext } from '@sitecore-content-sdk/core';
import { EVENTS_PLUGIN_NAME } from './const';
import { PACKAGE_VERSION } from '../consts';
import { event } from '../events/custom-event/event';
import { form } from '../events/custom-event/form';
import { identity } from '../events/identity/identity';
import { pageView } from '../events/page-view/page-view';
import { addToEventQueue } from '../eventStorage/addToEventQueue';
import { clearEventQueue } from '../eventStorage/clearEventQueue';
import { processEventQueue } from '../eventStorage/processEventQueue';
import { ANALYTICS_PLUGIN_NAME } from '@sitecore-content-sdk/analytics-core/internal';
import { EventsPlugin } from './types';

/**
 * Initializes the analytics plugin with the provided settings.
 * @internal
 */
async function init() {
  if (typeof window !== 'undefined')
    window.scContentSDK = {
      ...window.scContentSDK,
      events: {
        addToEventQueue,
        clearEventQueue,
        event,
        form,
        identity,
        pageView,
        processEventQueue,
        version: PACKAGE_VERSION,
      },
    };
}

/**
 * Creates an events plugin with the provided settings.
 * @returns {EventsPlugin} The events plugin instance.
 * @public
 */
export function eventsPlugin(): EventsPlugin {
  return {
    name: EVENTS_PLUGIN_NAME,
    init,
    dependencies: [ANALYTICS_PLUGIN_NAME],
  };
}

/**
 * Retrieves the events plugin instance from the core configuration.
 * @returns {EventsPlugin} The events plugin instance.
 * @internal
 */
export function getEventsPlugin(): EventsPlugin {
  const plugin = getCoreContext().plugins.get(EVENTS_PLUGIN_NAME) as EventsPlugin | undefined;

  if (!plugin)
    throw new Error(
      `[IE-004] You must first add "${EVENTS_PLUGIN_NAME}" to the "initContentSdk()" "plugins" array.`
    );
  return plugin;
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface ScContentSDK {
    events: {
      addToEventQueue: typeof addToEventQueue;
      clearEventQueue: typeof clearEventQueue;
      event: typeof event;
      form: typeof form;
      identity: typeof identity;
      pageView: typeof pageView;
      processEventQueue: typeof processEventQueue;
      version: string;
    };
  }
}
