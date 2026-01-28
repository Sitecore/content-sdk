import packageJson from '../package.json';
import { MAX_EXT_ATTRIBUTES } from './events/consts';

export const PACKAGE_VERSION = packageJson.version;
export const PACKAGE_NAME = packageJson.name;

/**
 * Returns the name & version of the library in a String.
 */
export const X_CLIENT_SOFTWARE_ID = `${PACKAGE_NAME} ${PACKAGE_VERSION}`;

export const ERROR_MESSAGES = {
  MV_0003: '[MV-0003] "identifiers" is required.',
  IV_0002: '[IV-0002] Incorrect value for "dob". Format the value according to ISO 8601.',
  IV_0003: '[IV-0003] Incorrect value for "email". Set the value to a valid email address.',
  IV_0004: '[IV-0004] Incorrect value for "expiryDate". Format the value according to ISO 8601.',
  IV_0005: `[IV-0005] "extensionData" supports maximum ${MAX_EXT_ATTRIBUTES} attributes. Reduce the number of attributes.`,
};
