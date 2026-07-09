/* eslint-disable jsdoc/require-param */

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
    `[IV-007] Site "${siteName}" does not exist or site item tree is missing.`,
  IV_008: (lockSide: string, currentSide: string) =>
    `[IV-008] Catalog version mismatch: lock file has ${lockSide}, current is ${currentSide}.`,
  IV_009: (name: string, lockSide: string, currentSide: string) =>
    `[IV-009] Atom "${name}" version mismatch: lock file has ${lockSide}, current is ${currentSide}.`,
  IV_010: (name: string) => `[IV-010] Atom "${name}" schema has changed.`,

  /** IE errors are related to incorrect execution */
  IE_001: (pluginName: string, dependency: string) =>
    `[IE-001] "${pluginName}" also requires "${dependency}". Add the missing dependency.`,
  IE_002:
    '[IE-002] SDK not initialized. You must first initialize the SDK using "initContentSdk()".',
  IE_003: '[IE-003] Timeout exceeded. The server did not respond within the allotted time.',
  IE_004: (pluginName: string) =>
    `[IE-004] Plugin not registered. You must first add "${pluginName}" to the "initContentSdk()" "plugins" array.`,
  IE_005:
    '[IE-005] Unable to set the "sc_cid" cookie because the client ID could not be retrieved from the server. Make sure to set the correct values for "contextId" and "siteName". If the issue persists, try again later or use try-catch blocks to handle this error.',
  IE_006:
    '[IE-006] Unable to set the "sc_cid_personalize" cookie because the visitor ID could not be retrieved from the server. Make sure to set the correct values for "contextId" and "siteName". If the issue persists, try again later or use try-catch blocks to handle this error.',
  IE_007: (hostName: string) => `[IE-007] Could not resolve site for host "${hostName}".`,
  IE_008: '[IE-008] Lock file validation failed:',
  IE_009:
    '[IE-009] Atom validation failed. See issues above. You see this error because `breakOnError` is enabled in your CLI config.',

  /** MV errors are related to missing values */
  MV_001: '[MV-001] "contextId" is required.',
  MV_002: '[MV-002] "siteName" is required.',
  MV_003: '[MV-003] "identifiers" is required.',
  MV_004: '[MV-004] "friendlyId" is required.',
  MV_005: (property: string) =>
    `[MV-005] The "sitecore.cli.config" file is missing a "${property}". Please add it to use this command.`,
  MV_006: '[MV-006] "clientContextId" is missing. Client-side functionalities may be limited.',
  MV_007: '[MV-007] Provide either "contextId" or both "apiHost" and "apiKey".',
  MV_008: '[MV-008] Verify that sitecore.config is properly imported and correctly referenced.',
  MV_009: '[MV-009] "language" is required.',
  MV_010: (modulePath: string) =>
    `[MV-010] Atoms module not found at ${modulePath}.{ts,tsx}. Ensure your atoms are defined in src/atoms/index.{ts,tsx} and export a catalog.`,
  MV_011: (modulePath: string) =>
    `[MV-011] Atoms module at ${modulePath} does not export "catalog". Export the result of defineAtomsCatalog as "catalog".`,
  MV_012: '[MV-012] Lock file not found. Run `sitecore-tools project atoms update` to generate it.',
  MV_013: (name: string) =>
    `[MV-013] Atom "${name}" is in the lock file but not found in current definitions.`,
  MV_014: (name: string) =>
    `[MV-014] Atom "${name}" is new and not in the lock file. Run \`sitecore-tools project atoms update\` to add it.`,

  /** Generic follow-up when the user should contact support */
  CONTACT_SUPPORT: 'If the issue persists, please contact Sitecore Support.',
} as const;
