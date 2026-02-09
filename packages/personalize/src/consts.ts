import packageJson from '../package.json';

/**
 * The package version.
 * @internal
 */
export const PACKAGE_VERSION = packageJson.version;
export const PACKAGE_NAME = packageJson.name;
export const UTM_PREFIX = 'utm_';

export const ERROR_MESSAGES = {
  MV_004: '[MV-004] "friendlyId" is required.',
  IE_006:
    '[IE-006] Unable to set the "sc_cid_personalize" cookie because the visitor ID could not be retrieved from the server. Make sure to set the correct values for "contextId" and "siteName". If the issue persists, try again later or use try-catch blocks to handle this error.',
};
