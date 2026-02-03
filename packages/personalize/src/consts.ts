import packageJson from '../package.json';

export const PACKAGE_VERSION = packageJson.version;
export const PACKAGE_NAME = packageJson.name;
export const UTM_PREFIX = 'utm_';

export const ERROR_MESSAGES = {
  MV_0004: '[MV-0004] "friendlyId" is required.',
  IE_0011:
    '[IE-0011] Unable to set the "sc_{SitecoreEdgeContextId}_personalize" cookie because the guest ID could not be retrieved from the server. Make sure to set the correct values for "sitecoreEdgeContextId" and "siteName". If the issue persists, try again later or use try-catch blocks to handle this error.',
};
