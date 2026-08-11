/**
 * Experimental features catalog helpers and types.
 *
 * Source of truth for the catalog is `src/experimental.json` (package root `src/`).
 * That file should default to an empty array (`[]`) in production. It currently
 * contains dummy entries for display/testing of the visibility API only — remove
 * them (or replace with real features) before shipping a real experimental feature.
 */
export type {
  ExperimentalFeatureData,
  ExperimentalFeatureStatus,
  ExperimentalFeaturesResponse,
} from './types';
export {
  buildExperimentalFeaturesResponse,
  defaultExperimentalFeatures,
  isExperimentalEnvFlagEnabled,
  resolveExperimentalFeatureStatuses,
} from './utils';
