import experimentalFeaturesCatalog from '../experimental.json';
import {
  ExperimentalFeatureData,
  ExperimentalFeatureStatus,
  ExperimentalFeaturesResponse,
} from './types';

/**
 * Returns true when an experimental feature env flag is opted in.
 * Accepts `true` / `1` (case-insensitive, trimmed).
 * @param {string | undefined} value - Environment variable value.
 * @returns {boolean} Whether the flag is enabled.
 * @public
 */
export const isExperimentalEnvFlagEnabled = (value: string | undefined): boolean => {
  if (!value) {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === 'true' || normalized === '1';
};

/**
 * Default experimental features catalog shipped with the Next.js package
 * (`src/experimental.json`).
 *
 * Production default should be `[]`. Dummy entries may be present temporarily for
 * display/testing of the visibility API.
 * @public
 */
export const defaultExperimentalFeatures =
  experimentalFeaturesCatalog as ExperimentalFeatureData[];

/**
 * Resolves experimental feature metadata with current enabled status from env vars.
 * @param {ExperimentalFeatureData[]} features - Experimental features catalog.
 * @returns {ExperimentalFeatureStatus[]} Features with enabled status.
 * @public
 */
export const resolveExperimentalFeatureStatuses = (
  features: ExperimentalFeatureData[]
): ExperimentalFeatureStatus[] => {
  return features.map((feature) => ({
    ...feature,
    enabled: isExperimentalEnvFlagEnabled(process.env[feature.envVarName]),
  }));
};

/**
 * Builds the experimental features API response payload.
 * @param {ExperimentalFeatureData[]} [features] - Optional catalog override. Defaults to package catalog.
 * @returns {ExperimentalFeaturesResponse} Response payload.
 * @public
 */
export const buildExperimentalFeaturesResponse = (
  features: ExperimentalFeatureData[] = defaultExperimentalFeatures
): ExperimentalFeaturesResponse => {
  return {
    features: resolveExperimentalFeatureStatuses(features),
  };
};
