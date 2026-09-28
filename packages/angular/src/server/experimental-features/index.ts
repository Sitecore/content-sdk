/**
 * Experimental features catalog owned by this package, plus the shared helpers re-exported
 * from `@sitecore-content-sdk/content/experimental` for convenience in Angular apps.
 */
import type { ExperimentalFeatureData } from '@sitecore-content-sdk/content/experimental';
import experimentalFeaturesCatalogJson from '../../experimental.json';

/**
 * Experimental features shipped with this version of `@sitecore-content-sdk/angular`.
 * The catalog is owned by the package (`src/experimental.json`) and is not app-configurable.
 * Consumed by the experimental features middleware and by the Sitecore Content SDK CLI
 * (`sitecore-tools project experimental list`).
 * @public
 */
export const experimentalFeaturesCatalog =
  experimentalFeaturesCatalogJson as ExperimentalFeatureData[];

export type {
  ExperimentalFeatureData,
  ExperimentalFeatureStatus,
  ExperimentalFeaturesResponse,
} from '@sitecore-content-sdk/content/experimental';
export {
  buildExperimentalFeaturesResponse,
  CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG,
  isExperimentalEnvFlagEnabled,
  isExperimentalFeaturesGloballyEnabled,
  resolveExperimentalFeatureStatuses,
} from '@sitecore-content-sdk/content/experimental';
