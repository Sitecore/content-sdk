import packageJson from '../package.json';

export const LIBRARY_VERSION = packageJson.version;

export const COOKIE_NAME_PREFIX = 'sc_';

export const BROWSER_ID_COOKIE_NAME = 'cid';

export const DEFAULT_COOKIE_EXPIRY_DAYS = 730;

export const DAILY_SECONDS = 86400;

export const API_VERSION = 'v1.2';

export const SITECORE_EDGE_URL = 'https://edge-platform.sitecorecloud.io';

export const CORRELATION_ID_HEADER = 'x-sc-correlation-id';

export const ERROR_MESSAGES = {
  IE_0003:
    '[IE-0003] Unable to set the "sc_cid" cookie because the browser ID could not be retrieved from the server. Make sure to set the correct values for "contextId" and "siteName". If the issue persists, try again later or use try-catch blocks to handle this error.',
} as const;
