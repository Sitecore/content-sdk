/**
 * Error messages for initialization.
 * @internal
 */
export const InitErrorMessages = {
  /** Configuration is required */
  INIT_001: '[INIT-001] Configuration is required. Please provide a valid config object.',
  /** Already initialized */
  INIT_002: '[INIT-002] SDK is already initialized. Call reset() before re-initializing.',
  /** Not initialized */
  INIT_003: '[INIT-003] SDK is not initialized. Call initSitecore() first.',
  /** Plugin dependency not found */
  INIT_004: (pluginName: string, depName: string) =>
    `[INIT-004] Plugin "${pluginName}" requires "${depName}" which is not registered.`,
  /** Plugin validation failed */
  INIT_005: (pluginName: string, error: string) =>
    `[INIT-005] Plugin "${pluginName}" validation failed: ${error}`,
  /** Duplicate plugin */
  INIT_006: (pluginName: string) =>
    `[INIT-006] Plugin "${pluginName}" is already registered. Each plugin can only be added once.`,
  /** Invalid Edge Context ID */
  INIT_007: '[INIT-007] Invalid or missing Edge Context ID (api.edge.contextId).',
  /** Invalid site name */
  INIT_008: '[INIT-008] Invalid or missing default site name (defaultSite).',
  /** Invalid Edge URL */
  INIT_009: '[INIT-009] Invalid Edge URL format (sitecoreEdgeUrl).',
  /** Missing context ID */
  INIT_010:
    '[INIT-010] sitecoreContextId is required. Please provide a valid Sitecore Edge context ID.',
  /** Plugin not found for update */
  INIT_011: (pluginName: string) =>
    `[INIT-011] Plugin "${pluginName}" is not registered. Cannot update settings for unregistered plugin.`,
  /** Plugin has no deferred init */
  INIT_012: (pluginName: string) =>
    `[INIT-012] Plugin "${pluginName}" does not have a deferredInit function. Ensure the plugin is properly configured.`,
  /** Group validation failed */
  INIT_013: (groupName: string, error: string) =>
    `[INIT-013] Group "${groupName}" validation failed: ${error}`,
  /** Group init failed */
  INIT_014: (groupName: string, error: string) =>
    `[INIT-014] Group "${groupName}" initialization failed: ${error}`,
  /** Group deferred init failed */
  INIT_015: (groupName: string, error: string) =>
    `[INIT-015] Group "${groupName}" deferred initialization failed: ${error}`,
  /** Group not registered */
  INIT_016: (groupName: string) =>
    `[INIT-016] Group "${groupName}" is not registered. Cannot update settings for unregistered group.`,
} as const;

