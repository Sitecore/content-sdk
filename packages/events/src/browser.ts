import './initializer/browser/initializer';

export type { PageViewData, EventData, IdentityData } from './events';
export { addToEventQueue } from './eventStorage/addToEventQueue';
export { processEventQueue } from './eventStorage/processEventQueue';
export { clearEventQueue } from './eventStorage/clearEventQueue';
export { form } from './events/custom-event/form';
export { event } from './events/custom-event/event';
export { identity } from './events/identity/identity';
export { pageView } from './events/page-view/page-view';
export {
  PACKAGE_VERSION,
  EVENTS_NAMESPACE,
  PACKAGE_NAME,
  PACKAGE_INITIALIZER_METHOD_NAME,
} from './consts';

// Plugin settings management
export { updateEventsSettings, isEventsEnabled } from './plugin/events-plugin-base';
export type { EventsPluginSettings } from './plugin/events-plugin-base';
