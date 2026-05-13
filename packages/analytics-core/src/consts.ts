import packageJson from '../package.json';

/**
 * The package version.
 * @internal
 */
export const LIBRARY_VERSION = packageJson.version;

/**
 * The prefix for cookie names used by the analytics library.
 * @internal
 */
export const COOKIE_NAME_PREFIX = 'sc_';

/**
 * The name of the client ID cookie.
 * @internal
 */
export const CLIENT_ID_COOKIE_NAME = 'cid';

/**
 * The default number of days until the client ID cookie expires.
 * @internal
 */
export const DEFAULT_COOKIE_EXPIRY_DAYS = 730;

/**
 * The seconds in a day, used for cookie expiration calculations.
 * @internal
 */
export const DAILY_SECONDS = 86400;

/**
 * The api version of the Edge Proxy.
 * @internal
 */
export const API_VERSION = 'v1.2';

/**
 * The header name for the correlation ID used in analytics requests.
 * @internal
 */
export const CORRELATION_ID_HEADER = 'x-sc-correlation-id';
