import { RetryStrategy } from '../models';

/**
 * Utility type to make every property in a type required
 */
export type DeepRequired<T> = Required<
  {
    [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]>;
  }
>;

/**
 * Type to be used as config input in sitecore.config
 */
export type SitecoreConfigInput = {
  /**
   * API settings required to connect to Sitecore.
   * Both edge and local set can be specified as JSS app will use API Key for component library
   */
  api: {
    /**
     * Edge endpoint credentials for Sitecore connection. Will be used to connect to SaaS XMCloud instance
     */
    edge?: {
      // for now contextID will take the role of both server and client IDs
      /**
       * A unified identifier used to connect and retrieve data from XM Cloud instance
       */
      contextId: string;
      // clientContextId will be utilized when we know more specifics about it
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
     * API endpoint credentials for connection to local Sitecore instance
     */
    local?: {
      /**
       * Sitecore API key identifier used to connect to the GraphQL endpoint
       */
      apiKey: string;
      /**
       * Sitecore API hostname that the app will connect and retrieve data from
       */
      apiHost: string;
      /**
       * GraphQL endpoint path, will be appended to apiHost to form full enpoint URL ($apiHost/$path)
       * @default /sitecore/api/graph/edge
       */
      path?: string;
    };
  };
  /**
   * The default and fallback locale for your site.
   * Ensure it aligns with the framework-specific settings used in your application.
   */
  defaultLanguage: string;
  /**
   * Your default site name. When using the multisite feature this variable defines the fallback site.
   */
  defaultSite?: string;
  /**
   * Editing secret required to support Sitecore editing and preview functionality.
   */
  editingSecret?: string;
  /**
   * Retry configuration applied to Layout, Dictionary and ErrorPages services out of the box
   */
  retries?: {
    /**
     * Number of retries for graphql client. Will use the specified `retryStrategy`.
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
     * configure local memory caching for Dictionary Service requests
     */
    caching?: {
      enabled?: boolean;
      timeout?: number;
    };
  };
  /**
   * Settings for multisite functionaliry
   */
  multisite?: {
    /**
     * Enable multisite
     * @default true
     */
    enabled?: boolean;
    /**
     * Fallback hostname in case `host` header is not present
     * @default localhost
     */
    defaultHostname?: string;
    /**
     * Function used to determine if site should be resolved from sc_site cookie when present
     */
    useCookieResolution?: (req?: RequestInit, res?: ResponseInit) => boolean;
  };
  /**
   * Setting for personalize functionality
   */
  personalize?: {
    /**
     * Enable personalize middleware
     * @default process.env.NODE_ENV !== 'development'
     */
    enabled?: boolean;
    /**
     * Configuration for your Sitecore Experience Edge endpoint
     */
    edgeTimeout?: number;
    /**
     * Configuration for your Sitecore CDP endpoint
     */
    cdpTimeout?: number;
    /**
     * Optional Sitecore Personalize scope identifier allowing you to isolate your personalization data between XM Cloud environments
     */
    scope?: string;
    /**
     * The Sitecore CDP channel to use for events. Uses 'WEB' by default.
     */
    channel?: string;
    /**
     * Currency for CDP request. Uses 'USA' as default.
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
};

/**
 * Final sitecore config type used at runtime
 * Every property should be populated, either from sitecore.config or built-in fallback values
 */
export type SitecoreConfig = DeepRequired<SitecoreConfigInput>;

/**
 * Type to be used as cli config input in sitecore.cli.config
 */
export type SitecoreCliConfigInput = {
  /**
   * Configuration for the build cli command
   */
  build?: {
    /**
     * List of commands to run during the build process
     */
    commands?: Array<() => Promise<void>>;
  };
  /**
   * Configuration for the scaffold cli command
   */
  scaffold?: {
    /**
     * List of scaffold templates that can be used for generating components
     */
    templates?: ScaffoldTemplate[];
  };
};

/**
 * Final sitecore cli config type used required by the cli
 */
export type SitecoreCliConfig = DeepRequired<SitecoreCliConfigInput>;

/**
 * Scaffold template type
 */
/**
 * Represents a scaffold template used for generating components.
 */
export type ScaffoldTemplate = {
  /**
   * Name of the template.
   */
  name: string;
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
