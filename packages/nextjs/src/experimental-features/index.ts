/**
 * Re-exports shared experimental features helpers from `@sitecore-content-sdk/content/experimental`
 * for convenience in Next.js apps. The Next.js catalog lives in `src/experimental.json`.
 */
export type {
  ExperimentalFeatureData,
  ExperimentalFeatureStatus,
  ExperimentalFeaturesResponse,
} from '@sitecore-content-sdk/content/experimental';
export {
  buildExperimentalFeaturesResponse,
  isExperimentalEnvFlagEnabled,
  resolveExperimentalFeatureStatuses,
} from '@sitecore-content-sdk/content/experimental';
