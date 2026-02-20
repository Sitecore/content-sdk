/* eslint-disable jsdoc/require-param */

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
 * The error messages. Includes errors for all packages.
 * @internal
 */
export const ERROR_MESSAGES = {
  /** IV errors are related to incorrect values, wrongly formatted objects, etc. */
  IV_001: '[IV-001] Incorrect value for "edgeUrl". Set the value to a valid URL.',
  IV_002:
    '[IV-002] Incorrect value for "timeout". Set the value to an integer greater than or equal to 0.',
  IV_003: '[IV-003] Incorrect value for "dob". Format the value according to ISO 8601.',
  IV_004: '[IV-004] Incorrect value for "email". Set the value to a valid email address.',
  IV_005: '[IV-005] Incorrect value for "expiryDate". Format the value according to ISO 8601.',
  IV_006: (maxAttributes: number) =>
    `[IV-006] "extensionData" supports maximum ${maxAttributes} attributes. Reduce the number of attributes.`,
  IV_007: (siteName: string) =>
    `[IV-007] Site "${siteName}" does not exist or site item tree is missing`,

  /** IE errors are related to incorrect execution */
  IE_001: (pluginName: string, dependency: string) =>
    `[IE-001] "${pluginName}" also requires "${dependency}"`,
  IE_002: '[IE-002] You must first initialize the SDK using "initContentSdk()".',
  IE_003: '[IE-003] Timeout exceeded. The server did not respond within the allotted time.',
  IE_004: (pluginName: string) =>
    `[IE-004] You must first add "${pluginName}" to the "initContentSdk()" "plugins" array.`,
  IE_005:
    '[IE-005] Unable to set the "sc_cid" cookie because the client ID could not be retrieved from the server. Make sure to set the correct values for "contextId" and "siteName". If the issue persists, try again later or use try-catch blocks to handle this error.',
  IE_006:
    '[IE-006] Unable to set the "sc_cid_personalize" cookie because the visitor ID could not be retrieved from the server. Make sure to set the correct values for "contextId" and "siteName". If the issue persists, try again later or use try-catch blocks to handle this error.',
  IE_007: (hostName: string) => `[IE-007] Could not resolve site for host "${hostName}"`,

  /** MV errors are related to missing values */
  MV_001: '[MV-001] "contextId" is required.',
  MV_002: '[MV-002] "siteName" is required.',
  MV_003: '[MV-003] "identifiers" is required.',
  MV_004: '[MV-004] "friendlyId" is required.',
  MV_005: (property: string) =>
    `[MV-005] The "sitecore.cli.config" file is missing a "${property}". Please add it to use this command.`,
  MV_006: '[MV-006] "clientContextId" is missing. Client-side functionalities may be limited.',
  MV_007:
    '[MV-007] Provide either "api.edge.contextId" or both "api.local.apiHost" and "api.local.apiKey".',
  MV_008: '[MV-008] sitecore.config reference is required to be provided.',
  MV_009: '[MV-009] "language" is required.',

  /** Generic follow-up when the user should contact support */
  CONTACT_SUPPORT: 'If the issue persists, please contact Sitecore Support.',
} as const;
