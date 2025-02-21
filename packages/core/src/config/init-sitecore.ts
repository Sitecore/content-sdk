import { SitecoreIntializationOptions, SitecoreRuntimeConfig } from './models';

/**
 * Configuration with all relevant runtime properties
 * Expected to be be initialized via `initSitecore` in app bootstrap
 */
export let sitecoreRuntimeConfig: SitecoreRuntimeConfig = {
  initialized: false,
};

// this function is strictly for unit testing
// alternative is getter/setter for sitecoreRuntimeConfig - but we only want to export getter
// eslint-disable-next-line
export function setTestSitecoreRuntimeConfig(
  input: Partial<SitecoreIntializationOptions>,
  initialized: boolean
) {
  sitecoreRuntimeConfig = {
    ...input.sitecoreConfig,
    sites: input.sites,
    components: input.components,
    initialized,
  };
}

/**
 * Retrieves runtime Sitecore configuration after it was initialized
 * @returns {SitecoreIntializationOptions} configured sites, components and config values
 */
export const getSitecoreConfig = () => {
  if (!sitecoreRuntimeConfig.initialized) {
    throw new Error(
      'Sitecore runtime config not initialized. Ensure initSitecore() call was performed.'
    );
  }
  return sitecoreRuntimeConfig;
};

/**
 * Initialize app with initial data and ensures runtime settings (configuration, sites, components)
 * are available within package scope via sitecoreConfig export
 * @param {SitecoreIntializationOptions} options initial config, site, component and other data for app initialization
 */
export const initSitecore = (options: SitecoreIntializationOptions) => {
  sitecoreRuntimeConfig = {
    ...options.sitecoreConfig,
    sites: options.sites,
    components: options.components,
    initialized: true,
  };
};
