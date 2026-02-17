/**
 * Default Experience Edge URL (edge.sitecorecloud.io). Used when no custom hostname is configured.
 * @internal
 */
export const SITECORE_EXPERIENCE_EDGE_URL_DEFAULT = 'https://edge.sitecorecloud.io';

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
export const DEFAULT_EDGE_HOSTNAMES = [
  'edge-platform.sitecorecloud.io',
  'edge.sitecorecloud.io',
  'edge-staging.sitecore-staging.cloud',
  'edge-platform-staging.sitecore-staging.cloud',
] as const;

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
