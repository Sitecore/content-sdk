/**
 * Constants for Sitecore template IDs
 * @public
 */
export enum SitecoreTemplateId {
  // /sitecore/templates/Foundation/JavaScript Services/App
  ContentSdkApp = '061cba1554744b918a0617903b102b82',

  // /sitecore/templates/System/Dictionary/Dictionary entry
  DictionaryEntry = '6d1cd89719364a3aa511289a94c2a7b1',
}

/**
 * Error message for empty site name
 * @internal
 */
export const siteNameError = 'The siteName cannot be empty';

/**
 * Default Sitecore Edge URL
 * @public
 */
export const SITECORE_EDGE_URL_DEFAULT = 'https://edge-platform.sitecorecloud.io';

/**
 * Hidden Rendering name
 * @internal
 */
export const HIDDEN_RENDERING_NAME = 'Hidden Rendering';

/**
 * Claims URL
 * @internal
 */
export const CLAIMS = 'https://auth.sitecorecloud.io/claims';

/**
 * Default Sitecore Auth Domain
 * @internal
 */
export const DEFAULT_SITECORE_AUTH_DOMAIN = 'https://auth.sitecorecloud.io';

/**
 * Default Sitecore Auth Audience
 * @internal
 */
export const DEFAULT_SITECORE_AUTH_AUDIENCE = 'https://api.sitecorecloud.io';

/**
 * Default Sitecore Auth Base URL
 * @internal
 */
export const DEFAULT_SITECORE_AUTH_BASE_URL = 'https://edge-platform.sitecorecloud.io/cs/api';
