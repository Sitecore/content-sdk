import {
  DeepRequired,
  defineConfig as defineConfigCore,
  SitecoreConfigInput as SitecoreConfigInputCore,
} from '@sitecore-content-sdk/content/config';
import { resolveEdgeUrl } from '@sitecore-content-sdk/core/tools';

/** Next.js env var for Edge hostname; exposed to the browser so client code can use it. */
const NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME_ENV =
  'NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME';

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
        contextId: config?.api?.edge?.contextId || '',
        clientContextId:
          config?.api?.edge?.clientContextId || process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID,
        edgeUrl: resolveEdgeUrl(
          config?.api?.edge?.edgeUrl ?? process.env[NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME_ENV]
        ),
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
    sitecoreInternalEditingHostUrl:
      config?.sitecoreInternalEditingHostUrl || process.env.SITECORE_INTERNAL_EDITING_HOST_URL,
  };
};

/**
 * Locale prefix strategy for App Router redirect targets, mirroring next-intl's `localePrefix`.
 * - `always`: every locale is prefixed (`/[locale]/...`), including the default.
 * - `as-needed`: only non-default locales are prefixed; the default locale stays bare.
 * - `never`: no locale prefix is applied.
 * When left `undefined`, RedirectsProxy behaves as `as-needed` and falls back to
 * `x-sc-locale` header detection (Pages Router when the header is absent).
 * @public
 */
export type AppLocalePrefix = 'always' | 'as-needed' | 'never';

/**
 * Type to be used as config input in sitecore.config
 * @public
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

  /**
   * The internal host URL for the Next.js application, used for server-side requests for page rendering during editing.
   * This should be the base URL where the Next.js app is accessible from the server side (e.g., "http://localhost:3000").
   */
  sitecoreInternalEditingHostUrl?: string;

  /**
   * Next.js-specific redirects settings (App Router vs Pages Router locale shaping).
   */
  redirects?: SitecoreConfigInputCore['redirects'] & {
    /**
     * Controls whether App Router redirect targets carry a locale path prefix (`/[locale]/...`).
     * Mirrors next-intl's `localePrefix` strategy. Only relevant for App Router applications.
     * @default undefined (treated as `as-needed` with `x-sc-locale` header fallback)
     */
    appLocalePrefix?: AppLocalePrefix;
  };
};

/**
 * Final sitecore config type used at runtime Every property should be populated, either from sitecore.config or built-in fallback values
 * @public
 */
export type SitecoreConfig = DeepRequired<SitecoreConfigInput>;

/**
 * Accepts a SitecoreConfigInput object and returns full sitecore configuration
 * @param {SitecoreConfigInput} config override values to be written over default config settings
 * @returns {SitecoreConfig} full sitecore configuration to use in application
 * @public
 */
export const defineConfig = (config?: SitecoreConfigInput): SitecoreConfig => {
  return defineConfigCore(getNextFallbackConfig(config)) as SitecoreConfig;
};
