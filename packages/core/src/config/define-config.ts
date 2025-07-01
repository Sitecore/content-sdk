import { SITECORE_EDGE_URL_DEFAULT } from '../constants';
import { DefaultRetryStrategy } from '../retries';
import { DeepPartial, SitecoreConfig, SitecoreConfigInput } from './models';

/**
 * Provides default initial values for SitecoreConfig
 * @returns default config
 */
export const getFallbackConfig = (): SitecoreConfig => ({
  api: {
    edge: {
      contextId: process.env.SITECORE_EDGE_CONTEXT_ID || '',
      clientContextId: '',
      edgeUrl: process.env.SITECORE_EDGE_URL || SITECORE_EDGE_URL_DEFAULT,
    },
    local: {
      apiKey: '',
      apiHost: '',
      path: '/sitecore/api/graph/edge',
    },
  },
  editingSecret: process.env.SITECORE_EDITING_SECRET || 'editing-secret-missing',
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
    useCookieResolution: () => false,
  },
  personalize: {
    enabled: process.env.NODE_ENV !== 'development',
    edgeTimeout: parseInt(process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT!, 10) || 400,
    cdpTimeout: parseInt(process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT!, 10) || 400,
    scope: '',
    channel: 'WEB',
    currency: 'USD',
  },
  defaultSite: '',
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
 * Deep merge utility that skips undefined or empty string values in the override.
 * @param {T} base base value
 * @param {DeepPartial<T>} [override] override value
 */
export function deepMerge<T>(base: T, override?: DeepPartial<T>): T {
  if (!override) return base;

  const result: T = { ...base };

  for (const key in override) {
    if (!Object.prototype.hasOwnProperty.call(override, key)) continue;

    const typedKey = key as keyof T;
    const baseValue = base[typedKey];
    const overrideValue = override[typedKey];

    // Skip undefined and empty string overrides
    if (overrideValue === undefined || overrideValue === '') {
      continue;
    }

    if (
      typeof overrideValue === 'object' &&
      overrideValue !== null &&
      !Array.isArray(overrideValue) &&
      Object.getPrototypeOf(overrideValue) === Object.prototype
    ) {
      result[typedKey] = deepMerge(baseValue, overrideValue);
    } else {
      result[typedKey] = overrideValue as T[typeof typedKey];
    }
  }

  return result;
}

/**
 * Resolves sitecore config based on base config and overrides
 * @param {SitecoreConfig} base base sitecore config object
 * @param {SitecoreConfig} override override sitecore config object
 * @returns resolved SitecoreConfig object
 */
const resolveConfig = (base: SitecoreConfig, override: SitecoreConfigInput): SitecoreConfig => {
  const result: SitecoreConfig = deepMerge(base, override);

  if (Number.isNaN(result.personalize.cdpTimeout) || !result.personalize.cdpTimeout) {
    result.personalize.cdpTimeout = base.personalize.cdpTimeout;
  }
  if (Number.isNaN(result.personalize.edgeTimeout) || !result.personalize.edgeTimeout) {
    result.personalize.edgeTimeout = base.personalize.edgeTimeout;
  }
  // fallback in case only one context provided
  if (result.api.edge?.clientContextId && !result.api.edge.contextId) {
    result.api.edge.contextId = result.api.edge.clientContextId;
  }

  return result;
};

const validateConfig = (config: SitecoreConfigInput) => {
  // Skip validation in browser - only validate on server side
  if (typeof window !== 'undefined') {
    return; // We're in the browser, skip validation
  }

  const hasEdgeContextId = !!config.api?.edge?.contextId;
  const hasLocalApi = !!(config?.api?.local?.apiHost && config?.api?.local?.apiKey);
  const hasClientContextId = !!config.api?.edge?.clientContextId;

  // Only validate on server-side where we have access to server env vars
  if (!hasEdgeContextId && !hasLocalApi && !hasClientContextId) {
    throw new Error(
      'Configuration error: at least one API configuration must be specified: ' +
        'contextId (server-side), clientContextId (client-side), or local API settings (apiHost + apiKey)'
    );
  }

  // Warn if middleware features might not work
  if (!hasEdgeContextId && !hasClientContextId && hasLocalApi) {
    console.warn(
      'Warning: Redirects and Personalization middleware require Edge API configuration. ' +
        'Please ensure that either an Edge context ID (for server-side) or a client context ID (for client-side) is provided in your configuration'
    );
  }
};

/**
 * Accepts a SitecoreConfigInput object and returns full sitecore configuration
 * @param {SitecoreConfigInput} config override values to be written over default config settings
 * @returns {SitecoreConfig} full sitecore configuration to use in application
 */
export const defineConfig = (config: SitecoreConfigInput): SitecoreConfig => {
  const resolvedConfig = resolveConfig(getFallbackConfig(), config);

  validateConfig(resolvedConfig);

  return resolvedConfig;
};
