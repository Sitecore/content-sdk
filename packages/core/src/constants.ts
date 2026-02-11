/**
 * Default Sitecore edge URL
 * @internal
 */
export const SITECORE_EDGE_URL_DEFAULT = 'https://edge-platform.sitecorecloud.io';

/**
 * Claims URL
 * @internal
 */
export const CLAIMS = 'https://auth.sitecorecloud.io/claims';
/**
 * Default Sitecore auth domain
 * @internal
 */
export const DEFAULT_SITECORE_AUTH_DOMAIN = 'https://auth.sitecorecloud.io';
/**
 * Default Sitecore auth audience
 * @internal
 */
export const DEFAULT_SITECORE_AUTH_AUDIENCE = 'https://api.sitecorecloud.io';
/**
 * Default Sitecore auth base URL
 * @internal
 */
export const DEFAULT_SITECORE_AUTH_BASE_URL = 'https://edge-platform.sitecorecloud.io/cs/api';

/**
 * The error messages.
 * @internal
 */
export const ERROR_MESSAGES = {
  IV_002:
    '[IV-002] Incorrect value for "timeout". Set the value to an integer greater than or equal to 0.',
  IE_003: '[IE-003] Timeout exceeded. The server did not respond within the allotted time.',
} as const;
