import { SITECORE_EDGE_URL_DEFAULT } from '../constants';
import { DefaultRetryStrategy } from '../retries';
import { SitecoreConfig, SitecoreConfigInput } from './models';

/**
 * Provides default initial values for SitecoreConfig
 * @returns default config
 */
export const getFallbackConfig = (): SitecoreConfig => ({
  api: {
    edge: {
      contextId: '',
      clientContextId: '',
      edgeUrl: SITECORE_EDGE_URL_DEFAULT,
    },
    local: {
      apiKey: '',
      apiHost: '',
      path: '/sitecore/api/graph/edge',
    },
  },
  editingSecret: 'editing-secret-missing',
  retries: {
    count: 3,
    retryStrategy: new DefaultRetryStrategy({
      statusCodes: [429, 502, 503, 504, 520, 521, 522, 523, 524],
    }),
  },
  redirects: {
    enabled: process.env.NODE_ENV !== 'development',
    locales: ['en'],
  },
  multisite: {
    enabled: true,
    defaultHostname: '',
    useCookieResolution: () => false,
  },
  personalize: {
    enabled: true,
    edgeTimeout: 400,
    cdpTimeout: 400,
    scope: undefined,
    channel: 'WEB',
    currency: 'USD',
  },
  defaultSite: 'sitecore-headless',
  defaultLanguage: 'en',
  layout: {
    formatLayoutQuery: null,
  },
  dictionary: {
    caching: {
      enabled: true,
      timeout: 60,
    },
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
  // fallback in case only one context provided
  if (result.api.edge?.clientContextId && !result.api.edge.contextId) {
    result.api.edge.contextId = result.api.edge.clientContextId;
  }

  return result;
};

const validateConfig = (config: SitecoreConfigInput) => {
  if (
    !config.api?.edge?.contextId &&
    (!config?.api?.local?.apiHost || !config?.api?.local?.apiKey)
  ) {
    // consider client-side usecase
    if (!config.api?.edge?.clientContextId) {
      throw new Error(
        'Configuration error: either context ID or API key and host must be specified in sitecore.config'
      );
    }
  }
  if (!config.defaultSite) {
    throw new Error('Configuration error: defaultSite value should be defined in sitecore.config');
  }
};

/**
 * Accepts a SitecoreConfigInput object and returns full sitecore configuration
 * @param {SitecoreConfigInput} config override values to be written over default config settings
 * @returns {SitecoreConfig} full sitecore configuration to use in application
 */
export const defineConfig = (config: SitecoreConfigInput) => {
  validateConfig(config);
  return deepMerge(getFallbackConfig(), config) as SitecoreConfig;
};
