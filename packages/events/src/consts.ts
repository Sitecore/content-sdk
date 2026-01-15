import packageJson from '../package.json';
import { MAX_EXT_ATTRIBUTES } from './events/consts';

export const EVENTS_NAMESPACE = 'sitecore-cloudsdk:events';
export const PACKAGE_VERSION = packageJson.version;
export const PACKAGE_NAME = packageJson.name;
export const PACKAGE_INITIALIZER_METHOD_NAME = 'addEvents';

/**
 * Returns the name & version of the library in a String.
 */
export const X_CLIENT_SOFTWARE_ID = `${PACKAGE_NAME} ${PACKAGE_VERSION}`;

/* eslint-disable max-len */
export enum ErrorMessages {
  IE_0001 = `[IE-0001] You are trying to run a browser-side function on the server side. On the server side, run the server-side equivalent of the function, available in "server" modules.`,
  IE_0014 = '[IE-0014] You must first initialize the Cloud SDK and the "events" package. First, import "CloudSDK" from "@sitecore-content-sdk/analytics-core/browser" and import "@sitecore-cloudsdk/events/browser". Then, run "CloudSDK().addEvents().initialize()".',
  IE_0015 = '[IE-0015] You must first initialize the Cloud SDK and the "events" package. First, import "CloudSDK" from "@sitecore-content-sdk/analytics-core/server" and import "@sitecore-cloudsdk/events/server". Then, run "await CloudSDK().addEvents().initialize()".',
  IV_0002 = '[IV-0002] Incorrect value for "dob". Format the value according to ISO 8601.',
  IV_0003 = '[IV-0003] Incorrect value for "email". Set the value to a valid email address.',
  IV_0004 = '[IV-0004] Incorrect value for "expiryDate". Format the value according to ISO 8601.',
  IV_0005 = `[IV-0005] "extensionData" supports maximum ${MAX_EXT_ATTRIBUTES} attributes. Reduce the number of attributes.`,
  MV_0003 = '[MV-0003] "identifiers" is required.',
}
/* eslint-enable max-len */
