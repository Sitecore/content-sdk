import {
  DeepRequired,
  defineConfig as defineConfigCore,
  SitecoreConfigInput as SitecoreConfigInputCore,
} from '@sitecore-content-sdk/core/config';

/**
 * Type to be used as config input in sitecore.config
 */
export type SitecoreConfigInput = SitecoreConfigInputCore & {
  /**
   * Indicates whether SSG `getStaticPaths` pre-render any pages.
   *
   * Set the environment variable `DISABLE_SSG_FETCH=true`
   * to disable static paths generation and enable full ISR (Incremental Static Regeneration) flow.
   *
   * By default, this is set to `false`.
   *
   * This is set to `true` when the application is deployed and used as editing host in Sitecore.
   */
  disableStaticPaths?: boolean;
};

/**
 * Final sitecore config type used at runtime Every property should be populated, either from sitecore.config or built-in fallback values
 */
export type SitecoreConfig = DeepRequired<SitecoreConfigInput>;

/**
 * Accepts a SitecoreConfigInput object and returns full sitecore configuration
 * @param {SitecoreConfigInput} config override values to be written over default config settings
 * @returns {SitecoreConfig} full sitecore configuration to use in application
 */
export const defineConfig = (config: SitecoreConfigInput) => {
  config.disableStaticPaths =
    process.env.DISABLE_SSG_FETCH !== undefined
      ? process.env.DISABLE_SSG_FETCH.toLowerCase() === 'true'
      : config.disableStaticPaths ?? false;

  return defineConfigCore(config) as SitecoreConfig;
};
