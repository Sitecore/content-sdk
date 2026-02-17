/**
 * Default Sitecore edge URL
 * @internal
 */
export const SITECORE_EDGE_URL_DEFAULT = 'https://edge-platform.sitecorecloud.io';

/**
 * Default Edge Platform URL (alias for naming consistency with SITECORE_EDGE_PLATFORM_HOSTNAME).
 * @internal
 */
export const SITECORE_EDGE_PLATFORM_URL_DEFAULT = 'https://edge-platform.sitecorecloud.io';

/**
 * Default Edge Platform hostnames that may appear in layout/editing responses.
 * Used when rewriting URLs to a custom hostname. Includes production and staging.
 *
 * These hostnames can appear in any string in the response, including:
 * - Media URLs (Image field value.src, Rich Text markup)
 * - Link field href values
 * - Other URL fields in component data
 * @public
 */
export const SITECORE_EXPERIENCE_EDGE_URL_DEFAULT = 'https://edge.sitecorecloud.io'

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
