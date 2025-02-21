import { SitecoreConfig, SitecoreConfigInput } from './models';

/**
 * Provides default initial values for SitecoreConfig
 * @returns default config
 */
export const getDefaultConfig = () => ({
  api: {
    edge: {
      contextId: process.env.SITECORE_EDGE_CONTEXT_ID || 'context-id-missing',
      clientContextId: process.env.SITECORE_EDGE_CONTEXT_ID || 'context-id-missing',
      edgeUrl: process.env.SITECORE_EDGE_URL || 'https://edge-platform.sitecorecloud.io',
    },
    local: {
      apiKey: process.env.SITECORE_API_KEY || 'key-missing',
      apiHost: process.env.SITECORE_API_HOST || 'host-not-specified',
    },
  },
  defaultSite: process.env.SITECORE_SITE_NAME || 'sitecore-headless',
  defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',
  editingSecret: process.env.JSS_EDITING_SECRET || 'editing-secret-missing',
  retries: {
    count: 3,
  },
  redirects: {
    enabled: process.env.NODE_ENV !== 'development',
    locales: ['en'],
  },
  multisite: {
    enabled: true,
    useCookieResolution: () => process.env.VERCEL_ENV === 'preview',
  },
  personalize: {
    enabled: true,
    scope: process.env.NEXT_PUBLIC_PERSONALIZE_SCOPE || undefined,
    edgeTimeout:
      (process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT &&
        parseInt(process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT, 10)) ||
      300,
    cdpTimeout:
      (process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT &&
        parseInt(process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT, 10)) ||
      300,
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
