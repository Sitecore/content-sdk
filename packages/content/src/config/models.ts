import { RetryStrategy } from '@sitecore-content-sdk/core';
import { GenerateMapFunction, GenerateMapArgs } from '../tools';

/**
 * Utility type to make every property in a type required
 * @public
 */
export type DeepRequired<T> = Required<{
  [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]>;
}>;

/**
 * Utility type to make all properties in a type optional, recursively
 * @internal
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/**
 * Type to be used as config input in sitecore.config
 * @public
 */
export type SitecoreConfigInput = {
  /**
   * API settings required to connect to Sitecore.
   * Both edge and local sets can be specified; the Content SDK app will choose
   * the correct credentials (Edge or local) at runtime.
   */
  api?: {
    /**
     * Edge endpoint credentials for connecting to an XM Cloud instance.
     */
    edge?: {
      /**
       * A unified identifier used to connect and retrieve data from XM Cloud instance
       * Must be provided together with `clientContextId` to support both server-
       * side and browser-side data fetching.
       */
      contextId: string;
      /**
       * Optional identifier used to connect and retrieve data from XM Cloud instance in client-side functionality
       */
      clientContextId?: string;
      /**
       * XM Cloud endpoint that the app will communicate and retrieve data from
       * @default https://edge-platform.sitecorecloud.io
       */
      edgeUrl?: string;
    };
    /**
     * API endpoint credentials for connecting to a local Sitecore instance.
     */
    local?: {
      /**
       * Sitecore API key used to connect to the GraphQL endpoint
       */
      apiKey: string;
      /**
       * Sitecore API hostname that the app connects to
       */
      apiHost: string;
      /**
       * GraphQL endpoint path (appended to `apiHost` to form the full URL).
       * @default /sitecore/api/graph/edge
       */
      path?: string;
    };
  };

  /**
   * The default and fallback locale for your site.
   * Ensure it aligns with the framework-specific settings used in your application.
   */
  defaultLanguage?: string;
  /**
   * Your default site name. When using the multisite feature this variable defines the fallback site.
   */
  defaultSite?: string;
  /**
   * Editing secret required for Sitecore editing and preview functionality.
   * Default comes from the SITECORE_EDITING_SECRET environment variable.
   */
  editingSecret?: string;
  /**
   * Retry configuration applied to Layout, Dictionary and ErrorPages services
   */
  retries?: {
    /**
     * Number of retries for the GraphQL client.
     * @default 3
     */
    count?: number;

    /**
     * Retry strategy for the client. By default, uses exponential
     * back-off factor of 2 for codes 429, 502, 503, 504, 520, 521, 522, 523, 524.
     * @default DefaultRetryStrategy
     */
    retryStrategy?: RetryStrategy;
  };

  /**
   * Settings for Layout Service
   */
  layout?: {
    /**
     * Override the first part of graphQL query for Layout Service (excluding the fields part)
     * @param {string} siteName your site name
     * @param {string} itemPath full path to Sitecore item/route
     * @param {string} [locale] item/route language
     * @returns {string} custom layout query
     * @default 'layout(site:"${siteName}", routePath:"${itemPath}", language:"${language}")'
     */
    formatLayoutQuery?: ((siteName: string, itemPath: string, locale?: string) => string) | null;
  };

  /**
   * Settings for Dictionary Service
   */
  dictionary?: {
    /**
     * Configure local memory caching for Dictionary Service requests
     */
    caching?: {
      enabled?: boolean;
      timeout?: number;
    };
  };

  /**
   * Settings for multisite functionality
   */
  multisite?: {
    /**
     * Enable multisite
     *
     * **WARNING: Do NOT disable multisite in App Router applications.**
     *
     * The App Router route structure requires the `[site]` segment in the path (`/[site]/[locale]/[[...path]]`).
     * Disabling this will break routing and cause 404 errors for regular requests.
     *
     * Preview and Editing modes will still work (they bypass this check), but regular page requests will fail.
     *
     * **For single-site setups**: Keep `enabled: true` and configure only one site in your sites configuration.
     * The middleware will always use that single site, achieving the desired single-site behavior.
     * @default true
     */
    enabled?: boolean;
    /**
     * Function used to determine if site should be resolved from sc_site cookie when present
     */
    useCookieResolution?: (req?: RequestInit, res?: ResponseInit) => boolean;
  };

  /**
   * Settings for Personalize functionality
   */
  personalize?: {
    /**
     * Enable personalize proxy
     * @default process.env.NODE_ENV !== 'development'
     */
    enabled?: boolean;
    /**
     * Configuration for your Sitecore Experience Edge endpoint
     * by default set by the PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT environment variable (for personalize proxy)
     * if not set, will use the default value of 400ms
     */
    edgeTimeout?: number;
    /**
     * Configuration for your Sitecore CDP endpoint
     * by default set by the PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT environment variable (for personalize proxy)
     * if not set, will use the default value of 400ms
     */
    cdpTimeout?: number;
    /**
     * Optional Sitecore Personalize scope ID (to isolate data between environments)
     */
    scope?: string;
    /**
     * The Sitecore CDP channel to use for events. Uses 'WEB' by default.
     */
    channel?: string;
    /**
     * Currency for CDP requests
     * @default 'USA'
     */
    currency?: string;
  };
  /**
   * Settings for redirects functionality
   */
  redirects?: {
    /**
     * Enable redirects middleware
     * @default process.env.NODE_ENV !== 'development'
     */
    enabled?: boolean;
    /**
     * These are all the locales you support in your application.
     * These should match those in framework-specific configuration of your app.
     */
    locales?: string[];
  };
  /**
   * Opt-in: rewrite URLs in layout content (media fields, rich text with img/src, href, etc.)
   * to use the custom hostname. When true, uses the default rewriter (Edge host -> custom host)
   * or contentRewrite if provided. Off by default to avoid unintended rewrites.
   */
  rewriteContentUrls?: boolean;
  /**
   * Optional custom content rewriter. When rewriteContentUrls is true and this is set,
   * it is used instead of the default. Use for custom rules (e.g. only certain fields or URL shapes).
   * @param layout - Layout service data
   * @returns Rewritten layout (do not mutate input)
   */
  contentRewrite?: (layout: unknown) => unknown;
  /**
   * Opt-out setting for code generation feature
   * Disables code extraction procedure
   */
  disableCodeGeneration?: boolean;
};

/**
 * Final Sitecore config type used at runtime.
 * Every property is populated, either from sitecore.config or fallback values.
 * @public
 */
export type SitecoreConfig = DeepRequired<SitecoreConfigInput>;

/**
 * Type used as CLI config input in sitecore.cli.config
 * @public
 */
export type SitecoreCliConfigInput = {
  /**
   * Sitecore configuration (`sitecore.config` file)
   */
  config: SitecoreConfig;
  /**
   * Configuration for the `sitecore-tools build` CLI command
   */
  build?: {
    /**
     * Commands to run during the build process
     */
    commands?: Array<(args?: { scConfig: SitecoreConfig }) => Promise<void>>;
  };
  /**
   * Configuration for the `sitecore-tools scaffold` CLI command
   */
  scaffold?: {
    /**
     * Scaffold templates available for generating components
     */
    templates?: ScaffoldTemplate[];
  };
  /**
   * Configuration for the `sitecore-tools component generate-map` CLI command
   */
  componentMap?: GenerateMapArgs & {
    /**
     * Function implementation for generating a component map
     */
    generator?: GenerateMapFunction;
  };
};

/**
 * Final Sitecore CLI config type required by the CLI
 * @public
 */
export type SitecoreCliConfig = DeepRequired<SitecoreCliConfigInput>;

/**
 * Represents a scaffold template used for generating components
 * @public
 */
export type ScaffoldTemplate = {
  /**
   * Name of the template
   */
  name: string;
  /**
   * File extension for the generated component
   */
  fileExtension: string;
  /**
   * Function to generate the component file contents based on the component name.
   * @param componentName - The name of the component.
   * @returns The generated content as a string.
   */
  generateTemplate: (componentName: string) => string;
  /**
   * Optional function to get the next steps to be shown by the cli after generating the component.
   * @param componentOutputPath - The output path of the generated component.
   * @returns An array of strings representing the next steps.
   */
  getNextSteps?: (componentOutputPath: string) => string[];
};

/**
 * Enumeration of default component templates
 * @internal
 */
export enum ComponentTemplateType {
  BYOC = 'byoc',
  DEFAULT = 'default',
}
