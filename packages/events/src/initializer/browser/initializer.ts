import { CloudSDKBrowserInitializer } from '@sitecore-content-sdk/__core__/browser';
import {
  debug,
  enabledPackagesBrowser as enabledPackages,
  getEnabledPackageBrowser as getEnabledPackage,
  PackageInitializer,
} from '@sitecore-content-sdk/__core__/internal';
import { ErrorMessages, EVENTS_NAMESPACE, PACKAGE_NAME, PACKAGE_VERSION } from '../../consts';
import { event } from '../../events/custom-event/event';
import { form } from '../../events/custom-event/form';
import { identity } from '../../events/identity/identity';
import { pageView } from '../../events/page-view/page-view';
import { addToEventQueue } from '../../eventStorage/addToEventQueue';
import { clearEventQueue } from '../../eventStorage/clearEventQueue';
import { processEventQueue } from '../../eventStorage/processEventQueue';

/**
 * Side effects function that runs after initialization to set up the events client library
 */
export async function sideEffects() {
  window.scCloudSDK = {
    ...window.scCloudSDK,
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

  debug(EVENTS_NAMESPACE)('eventsClient library initialized');
}

/**
 * Makes the functionality of the events package available.
 * @returns An instance of {@link CloudSDKBrowserInitializer}
 */
export function addEvents(this: CloudSDKBrowserInitializer): CloudSDKBrowserInitializer {
  const eventsInitializer = new PackageInitializer({ sideEffects });

  enabledPackages.set(PACKAGE_NAME, eventsInitializer);

  return this;
}

CloudSDKBrowserInitializer.prototype.addEvents = addEvents;

declare module '@sitecore-content-sdk/__core__/browser' {
  // eslint-disable-next-line no-unused-vars
  interface CloudSDKBrowserInitializer {
    addEvents: typeof addEvents;
  }
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Events {
    version: string;
    pageView?: typeof pageView;
    identity?: typeof identity;
    form?: typeof form;
    event?: typeof event;
    addToEventQueue?: typeof addToEventQueue;
    processEventQueue?: typeof processEventQueue;
    clearEventQueue?: typeof clearEventQueue;
  }
}

/**
 * Waits for the events package initialization to complete
 */
export async function awaitInit() {
  const initState = getEnabledPackage(PACKAGE_NAME)?.initState;

  if (!initState) throw new Error(ErrorMessages.IE_0014);

  await initState;
}
