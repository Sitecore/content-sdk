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
      apiKey: process.env.SITECORE_API_KEY || process.env.NEXT_PUBLIC_SITECORE_API_KEY || '',
      apiHost: process.env.SITECORE_API_HOST || process.env.NEXT_PUBLIC_SITECORE_API_HOST || '',
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
  disableCodeGeneration: false,
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

  return result;
};

const validateConfig = (config: SitecoreConfigInput): void => {
  const isBrowser = typeof window !== 'undefined';
  const hasEdgeContextId = !!config.api?.edge?.contextId;
  const hasClientContextId = !!config.api?.edge?.clientContextId;
  const hasLocalCreds = !!config.api?.local?.apiHost && !!config.api?.local?.apiKey;

  // Server-side: allow Edge OR Local; clientContextId alone is NOT sufficient
  if (!isBrowser) {
    if (!hasEdgeContextId && !hasLocalCreds) {
      throw new Error(
        'Configuration error: provide either Edge contextId (api.edge.contextId) or local credentials (api.local.apiHost + api.local.apiKey).'
      );
    }
    if (hasEdgeContextId && !hasClientContextId) {
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          'Warning: only a server-side edge contextId is provided. Client-side requests will require api.edge.clientContextId or a proxy.'
        );
      }
    }
    return; // validation complete on the server
  }

  // Browser-side warning (runs only if contextId exists but clientContextId is missing)
  if (isBrowser && !hasClientContextId) {
    // eslint-disable-next-line no-console
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `Warning: clientContextId is missing. The browser will use contextId instead.
  Client Side functionalities (like Tracking and Personalization) may be limited.`
      );
    }
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
