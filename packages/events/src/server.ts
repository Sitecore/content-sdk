import './initializer/server/initializer';

export { eventServer as event } from './events/custom-event/eventServer';
export { identityServer as identity } from './events/identity/identityServer';
export { pageViewServer as pageView } from './events/page-view/page-view-server';
export {
  PACKAGE_VERSION,
  EVENTS_NAMESPACE,
  PACKAGE_NAME,
  PACKAGE_INITIALIZER_METHOD_NAME,
} from './consts';
export type { PageViewData, EventData, IdentityData } from './events';
