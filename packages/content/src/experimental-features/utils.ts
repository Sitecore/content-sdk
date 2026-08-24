import {
  ExperimentalFeatureData,
  ExperimentalFeatureStatus,
  ExperimentalFeaturesResponse,
} from './types';

/**
 * Environment variable that globally enables experimental features for an app.
 * Set to `true` to enable experimental features.
 * @public
 */
export const CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG = 'CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG';

/**
 * Returns true when an experimental feature env flag is enabled.
 * Set the env var to `true` to opt in.
 * @param {string | undefined} value - Environment variable value.
 * @returns {boolean} Whether the flag is enabled.
 * @public
 */
export const isExperimentalEnvFlagEnabled = (value: string | undefined): boolean => {
  if (!value) {
    return false;
  }

  return value.trim() === 'true';
};

/**
 * Returns true when experimental features are globally enabled for the app.
 * Set `CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG` to `true` to enable them.
 * @returns {boolean} Whether experimental features are globally enabled.
 * @public
 */
export const isExperimentalFeaturesGloballyEnabled = (): boolean =>
  isExperimentalEnvFlagEnabled(process.env[CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG]);

/**
 * Resolves experimental feature metadata with current enabled status from env vars.
 * The global switch enables all experimental features. When it is off, feature
 * status falls back to individual feature env flags.
 * @param {ExperimentalFeatureData[]} features - Experimental features catalog from a framework package.
 * @returns {ExperimentalFeatureStatus[]} Features with enabled status.
 * @public
 */
export const resolveExperimentalFeatureStatuses = (
  features: ExperimentalFeatureData[]
): ExperimentalFeatureStatus[] => {
  const experimentalFeaturesEnabled = isExperimentalFeaturesGloballyEnabled();

  return features.map((feature) => ({
    ...feature,
    enabled:
      experimentalFeaturesEnabled || isExperimentalEnvFlagEnabled(process.env[feature.envVarName]),
  }));
};

/**
 * Builds the experimental features API response payload.
 * @param {ExperimentalFeatureData[]} features - Catalog from the framework package (`experimental.json`).
 * @returns {ExperimentalFeaturesResponse} Response payload.
 * @public
 */
export const buildExperimentalFeaturesResponse = (
  features: ExperimentalFeatureData[]
): ExperimentalFeaturesResponse => {
  return {
    features: resolveExperimentalFeatureStatuses(features),
  };
};
