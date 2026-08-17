/**
 * Metadata describing an experimental Content SDK feature.
 * @public
 */
export type ExperimentalFeatureData = {
  /**
   * Stable alphanumeric feature id.
   */
  idName: string;
  /**
   * User-friendly feature name.
   */
  displayName: string;
  /**
   * Environment variable used to opt into the feature (e.g. `CSDK_EXPERIMENTAL_FEATURE_NAME`).
   */
  envVarName: string;
  /**
   * Short description of the experimental feature.
   */
  description: string;
};

/**
 * Experimental feature metadata including whether it is currently enabled.
 * @public
 */
export type ExperimentalFeatureStatus = ExperimentalFeatureData & {
  /**
   * Whether the feature is currently enabled via its environment variable.
   */
  enabled: boolean;
};

/**
 * Response payload for the experimental features visibility API.
 * @public
 */
export type ExperimentalFeaturesResponse = {
  features: ExperimentalFeatureStatus[];
};
