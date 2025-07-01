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
          config?.api?.edge?.contextId || '',
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
    defaultSite: config?.defaultSite || process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME || '',
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
    generateStaticPaths:
      process.env.GENERATE_STATIC_PATHS !== undefined
        ? process.env.GENERATE_STATIC_PATHS.toLowerCase() === 'true'
        : config?.generateStaticPaths ?? true,
  };
};

/**
 * Type to be used as config input in sitecore.config
 */
export type SitecoreConfigInput = SitecoreConfigInputCore & {
  /**
   * Indicates whether SSG `getStaticPaths` pre-render any pages.
   *
   * Set the environment variable `GENERATE_STATIC_PATHS=true`
   * to enable static paths generation.
   *
   * By default, this is set to `true`.
   *
   * This is set to `false` when the application is deployed and used as editing host in Sitecore.
   */
  generateStaticPaths?: boolean;
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
