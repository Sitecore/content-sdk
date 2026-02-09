import packageJson from '../package.json';
import { MAX_EXT_ATTRIBUTES } from './events/consts';

/**
 * The package version.
 * @internal
 */
export const PACKAGE_VERSION = packageJson.version;
export const PACKAGE_NAME = packageJson.name;

/**
 * Returns the name & version of the library in a String.
 */
export const X_CLIENT_SOFTWARE_ID = `${PACKAGE_NAME} ${PACKAGE_VERSION}`;

export const ERROR_MESSAGES = {
  MV_003: '[MV-003] "identifiers" is required.',
  IV_003: '[IV-003] Incorrect value for "dob". Format the value according to ISO 8601.',
  IV_004: '[IV-004] Incorrect value for "email". Set the value to a valid email address.',
  IV_005: '[IV-005] Incorrect value for "expiryDate". Format the value according to ISO 8601.',
  IV_006: `[IV-006] "extensionData" supports maximum ${MAX_EXT_ATTRIBUTES} attributes. Reduce the number of attributes.`,
};
