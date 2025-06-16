export enum SitecoreTemplateId {
  // /sitecore/templates/Foundation/JavaScript Services/App
  JssApp = '061cba1554744b918a0617903b102b82',

  // /sitecore/templates/System/Dictionary/Dictionary entry
  DictionaryEntry = '6d1cd89719364a3aa511289a94c2a7b1',
}

export const siteNameError = 'The siteName cannot be empty';

export const SITECORE_EDGE_URL_DEFAULT = 'https://edge-platform.sitecorecloud.io';

export const HIDDEN_RENDERING_NAME = 'Hidden Rendering';

// Sitecore Auth constants
export const DEFAULT_SITECORE_AUTH_DOMAIN = 'https://auth.sitecorecloud.io';
export const DEFAULT_SITECORE_AUTH_AUDIENCE = 'https://api.sitecorecloud.io';
export const DEFAULT_SITECORE_AUTH_BASE_URL = 'https://edge-platform.sitecorecloud.io/cs/api';
export const CLAIMS = 'https://auth.sitecorecloud.io/claims';
export const CLIENT_GRANT_TYPE = 'client_credentials';
export const DEVICE_GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:device_code';
export const REFRESH_GRANT_TYPE = 'refresh_token';
export const SCOPE = 'openid profile email offline_access';
export const TIMEOUT = 600;
export const DEFAULT_INTERVAL = 10;
