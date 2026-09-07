/**
 * Shared experimental features helpers and types.
 *
 * Framework packages own their catalogs (`src/experimental.json` in nextjs/angular)
 * and pass them into {@link buildExperimentalFeaturesResponse}.
 */
export type {
  ExperimentalFeatureData,
  ExperimentalFeatureStatus,
  ExperimentalFeaturesResponse,
} from './types';
export {
  buildExperimentalFeaturesResponse,
  CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG,
  isExperimentalEnvFlagEnabled,
  isExperimentalFeaturesGloballyEnabled,
  resolveExperimentalFeatureStatuses,
} from './utils';
