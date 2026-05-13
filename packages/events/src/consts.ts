import packageJson from '../package.json';

/**
 * The package version.
 * @internal
 */
export const PACKAGE_VERSION = packageJson.version;
/**
 * The package version.
 * @internal
 */
export const PACKAGE_NAME = packageJson.name;

/**
 * Returns the name & version of the library in a String.
 */
export const X_CLIENT_SOFTWARE_ID = `${PACKAGE_NAME} ${PACKAGE_VERSION}`;
