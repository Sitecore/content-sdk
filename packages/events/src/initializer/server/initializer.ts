import {
  debug,
  enabledPackagesServer as enabledPackages,
  getEnabledPackageServer as getEnabledPackage,
  PackageInitializerServer,
} from '@sitecore-content-sdk/__core__/internal';
import { CloudSDKServerInitializer } from '@sitecore-content-sdk/__core__/server';
import { ErrorMessages, EVENTS_NAMESPACE, PACKAGE_NAME } from '../../consts';

/**
 * Side effects function that runs after initialization to set up the events server library
 */
export async function sideEffects() {
  debug(EVENTS_NAMESPACE)('eventsServer library initialized');
}

/**
 * Makes the functionality of the events package available.
 * @returns An instance of {@link CloudSDKServerInitializer}
 */
export function addEvents(this: CloudSDKServerInitializer): CloudSDKServerInitializer {
  const eventsInitializer = new PackageInitializerServer({ sideEffects });

  enabledPackages.set(PACKAGE_NAME, eventsInitializer);

  return this;
}

CloudSDKServerInitializer.prototype.addEvents = addEvents;

declare module '@sitecore-content-sdk/__core__/server' {
  // eslint-disable-next-line no-unused-vars
  interface CloudSDKServerInitializer {
    addEvents: typeof addEvents;
  }
}

/**
 * Verifies that the events package has been initialized
 * @throws Error if the events package is not enabled
 */
export function verifyEventsPackageExistence() {
  if (!getEnabledPackage(PACKAGE_NAME)) throw Error(ErrorMessages.IE_0015);
}
