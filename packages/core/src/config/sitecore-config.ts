import { RetryStrategy } from '../graphql-request-client';

export type SitecoreConfig = {
  api: {
    // keeping both edge and local sets until component library starts using edge credentials
    edge: {
      contextId: string;
      edgeUrl: string;
      path?: string;
    };
    local: {
      apiKey: string;
      apiHost: string;
      path?: string;
    };
  };
  defaultSite: string;
  defaultLanguage: string;
  editingSecret: string;
  retries?: {
    count?: number;
    retryStrategy?: RetryStrategy;
  };
  layout?: {
    formatLayoutQuery?: (siteName: string, itemPath: string, locale?: string) => string;
  };
  dictionary?: {
    caching?: {
      enabled?: boolean;
      timeout?: number;
    };
  };
  multisite?: {
    enabled?: boolean;
    defaultHostname?: string;
    useCookieResolution?: () => boolean;
  };
  personalize?: {
    enabled?: boolean;
    scope?: string;
    channel?: string;
    currency?: string;
    edgeTimeout?: number;
    cdpTimeout?: number;
  };
  redirects?: {
    enabled?: boolean;
    locales?: string[];
  };
};

/**
 * Provides default initial values for SitecoreConfig
 * @returns default config
 */
export const getDefaultConfig = () => ({
  api: {
    edge: {
      contextId: process.env.SITECORE_EDGE_CONTEXT_ID || '',
      edgeUrl: process.env.SITECORE_EDGE_URL || 'https://edge-platform.sitecorecloud.io',
    },
    local: {
      apiKey: process.env.SITECORE_API_KEY || '',
      apiHost: process.env.SITECORE_API_HOST || '',
    },
  },
  defaultSite: process.env.SITECORE_SITE_NAME || 'jss',
  defaultLanguage: 'en',
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
    scope: process.env.NEXT_PUBLIC_PERSONALIZE_SCOPE || '',
    edgeTimeout:
      (process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT &&
        parseInt(process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT, 10)) ||
      100,
    cdpTimeout:
      (process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT &&
        parseInt(process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT, 10)) ||
      100,
  },
});

/**
 * Merges two SitecoreConfig objects
 * @param {SitecoreConfig} base base sitecore config object
 * @param {SitecoreConfig} override override sitecore config object
 * @returns merged SitecoreConfig object
 */
const deepMerge = (base: SitecoreConfig, override: SitecoreConfig) => {
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
 * Loads a runtime config value
 * @param {SitecoreConfig} frameworkDefaults optional framework-specifc default values
 * @param {string} dirname path to config file folder. Defaults to app root
 * @returns runtime config object
 */
export const loadConfig = (frameworkDefaults?: SitecoreConfig, dirname?: string) => {
  /* TODO: use this imports approach when switching project to ESM
  const configBaseName = 'sitecore.config';
  configImport = import(configBaseName).then((module) => {
    runtimeConfigEsm = module.default || module;
  });
  */
  // we only provide dirname in tests, otherwise just use default config location
  const configImport = dirname ? require(`${dirname}/sitecore.config`) : require('sitecore.config');
  const config = configImport.default || configImport;
  const defaultConfig = frameworkDefaults
    ? deepMerge(getDefaultConfig(), frameworkDefaults)
    : getDefaultConfig();
  return deepMerge(defaultConfig, config);
};
