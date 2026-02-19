/**
 * Default Edge Platform URL (edge-platform.sitecorecloud.io). Used for service endpoints
 * (GraphQL, content API, forms, layout, static files) when no custom hostname is configured.
 * @internal
 */
export const SITECORE_EDGE_PLATFORM_URL_DEFAULT = 'https://edge-platform.sitecorecloud.io';

/**
 * Default Experience Edge URL (edge.sitecorecloud.io). Used only when replacing media URLs
 * in layout/editing responses (rewrite-edge-host). Do not use for service endpoints.
 * @internal
 */
export const SITECORE_EXPERIENCE_EDGE_URL_DEFAULT = 'https://edge.sitecorecloud.io';

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
