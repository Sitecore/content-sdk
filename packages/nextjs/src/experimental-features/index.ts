/**
 * Re-exports shared experimental features helpers from `@sitecore-content-sdk/content/experimental`
 * for convenience in Next.js apps.
 */
export type {
  ExperimentalFeatureData,
  ExperimentalFeatureStatus,
  ExperimentalFeaturesResponse,
} from '@sitecore-content-sdk/content/experimental';
export {
  buildExperimentalFeaturesResponse,
  defaultExperimentalFeatures,
  isExperimentalEnvFlagEnabled,
  resolveExperimentalFeatureStatuses,
} from '@sitecore-content-sdk/content/experimental';
