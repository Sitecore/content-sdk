import {
  DeepRequired,
  defineConfig as defineConfigCore,
  SitecoreConfigInput as SitecoreConfigInputCore,
} from '@sitecore-content-sdk/core/config';

/**
 * Provides default NextJs initial values from env variables for SitecoreConfig
 * @param {SitecoreConfigInput} config optional override values to be written over default config settings
 * @returns default nextjs input config
 */
export const getNextFallbackConfig = (config?: SitecoreConfigInput): SitecoreConfigInput => {
  return {
    ...config,
    api: {
      ...config?.api,
      edge: {
        ...config?.api?.edge,
        contextId:
          config?.api?.edge?.contextId || process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID || '',
        clientContextId:
          config?.api?.edge?.clientContextId || process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID,
        edgeUrl: config?.api?.edge?.edgeUrl || process.env.NEXT_PUBLIC_SITECORE_EDGE_URL,
      },
      local: {
        ...config?.api?.local,
        apiKey: config?.api?.local?.apiKey || process.env.NEXT_PUBLIC_SITECORE_API_KEY || '',
        apiHost: config?.api?.local?.apiHost || process.env.NEXT_PUBLIC_SITECORE_API_HOST || '',
      },
    },
    defaultSite: config?.defaultSite || process.env.NEXT_PUBLIC_SITECORE_SITE_NAME || '',
    defaultLanguage: config?.defaultLanguage || process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
    multisite: {
      ...config?.multisite,
      useCookieResolution:
        config?.multisite?.useCookieResolution ?? (() => process.env.VERCEL_ENV === 'preview'),
    },
    personalize: {
      ...config?.personalize,
      scope: config?.personalize?.scope || process.env.NEXT_PUBLIC_PERSONALIZE_SCOPE,
    },
    disableStaticPaths:
      process.env.DISABLE_SSG_FETCH !== undefined
        ? process.env.DISABLE_SSG_FETCH.toLowerCase() === 'true'
        : (config?.disableStaticPaths ?? false),
  };
};

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
export const defineConfig = (config?: SitecoreConfigInput): SitecoreConfig => {
  return defineConfigCore(getNextFallbackConfig(config)) as SitecoreConfig;
};
