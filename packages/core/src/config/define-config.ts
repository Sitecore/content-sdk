import { SitecoreConfig, SitecoreConfigInput } from './models';

/**
 * Provides default initial values for SitecoreConfig
 * @returns default config
 */
export const getDefaultConfig = () => ({
  api: {
    edge: {
      contextId: 'context-id-missing',
      clientContextId: 'context-id-missing',
      edgeUrl: 'https://edge-platform.sitecorecloud.io',
    },
    local: {
      apiKey: 'key-missing',
      apiHost: 'host-not-specified',
    },
  },
  defaultSite: 'sitecore-headless',
  defaultLanguage: 'en',
  editingSecret: 'editing-secret-missing',
  retries: {
    count: 3,
  },
  redirects: {
    enabled: process.env.NODE_ENV !== 'development',
    locales: ['en'],
  },
  multisite: {
    enabled: true,
  },
  personalize: {
    enabled: true,
    edgeTimeout: 300,
    cdpTimeout: 300,
  },
});

/**
 * Merges two SitecoreConfig objects
 * @param {SitecoreConfig} base base sitecore config object
 * @param {SitecoreConfig} override override sitecore config object
 * @returns merged SitecoreConfig object
 */
const deepMerge = (base: SitecoreConfigInput, override: SitecoreConfigInput) => {
  const result = {
    ...base,
    ...override,
    api: {
      edge: { ...base.api?.edge, ...override.api?.edge },
      local: { ...base.api?.local, ...override.api?.local },
    },
    retries: { ...base.retries, ...override.retries },
    layout: { ...base.layout, ...override.layout },
    multisite: { ...base.multisite, ...override.multisite },
    personalize: { ...base.personalize, ...override.personalize },
    redirects: { ...base.redirects, ...override.redirects },
    dictionary: { ...base.dictionary, ...override.dictionary },
  };
  return result;
};

/**
 * Accepts a SitecoreConfigInput object and returns full runtime sitecore configuration
 * @param {SitecoreConfigInput} config override values to be written over default config settings
 * @returns {SitecoreConfig} full runtime sitecore configuration to use in application
 */
export const defineConfig = (config: SitecoreConfigInput) => {
  return deepMerge(getDefaultConfig(), config) as SitecoreConfig;
};
