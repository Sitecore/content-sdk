import { RetryStrategy } from '../models';
import { GenerateMapFunction, GenerateMapArgs } from '../tools';

/**
 * Utility type to make every property in a type required
 */
export type DeepRequired<T> = Required<
  {
    [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]>;
  }
>;

/**
 * Utility type to make all properties in a type optional, recursively
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/**
 * Type to be used as config input in sitecore.config
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
       * **Server-side Edge context ID** used for SSR and API-route requests.
       * Must be provided together with `clientContextId` to support both server-
       * side and browser-side data fetching.
       */
      contextId: string;

      /**
       * **Browser-side Edge context ID** used for client-side GraphQL calls.
       * Required alongside `contextId`; supplying only this ID will cause
       * server-side requests to fail at runtime.
       */
      clientContextId?: string;

      /**
       * Custom XM Cloud endpoint the app communicates with.
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
   * Default site name. When using multisite, this is the fallback site.
   * @default empty string
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
     * Retry strategy for the client.
     * @default DefaultRetryStrategy
     */
    retryStrategy?: RetryStrategy;
  };

  /**
   * Settings for Layout Service
   */
  layout?: {
    /**
     * Override the first part of the GraphQL query for Layout Service
     * (excluding the fields part).
     * @param siteName  The site name
     * @param itemPath  Full path to the Sitecore item/route
     * @param locale    Item/route language
     */
    formatLayoutQuery?: ((siteName: string, itemPath: string, locale?: string) => string) | null;
  };

  /**
   * Settings for Dictionary Service
   */
  dictionary?: {
    /**
     * Configure local-memory caching for Dictionary Service requests
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
     * @default true
     */
    enabled?: boolean;

    /**
     * Determines if the site should be resolved from the sc_site cookie
     */
    useCookieResolution?: (req?: RequestInit, res?: ResponseInit) => boolean;
  };

  /**
   * Settings for Personalize functionality
   */
  personalize?: {
    /**
     * Enable Personalize middleware
     * @default process.env.NODE_ENV !== 'development'
     */
    enabled?: boolean;

    /**
     * Timeout for your Sitecore Experience Edge endpoint
     * @default 400ms
     */
    edgeTimeout?: number;

    /**
     * Timeout for your Sitecore CDP endpoint
     * @default 400ms
     */
    cdpTimeout?: number;

    /**
     * Optional Sitecore Personalize scope ID (to isolate data between environments)
     */
    scope?: string;

    /**
     * Sitecore CDP channel to use for events
     * @default 'WEB'
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
     * Locales supported by your application
     */
    locales?: string[];
  };
};

/**
 * Final Sitecore config type used at runtime.
 * Every property is populated, either from sitecore.config or fallback values.
 */
export type SitecoreConfig = DeepRequired<SitecoreConfigInput>;

/**
 * Type used as CLI config input in sitecore.cli.config
 */
export type SitecoreCliConfigInput = {
  /**
   * Configuration for the `sitecore-tools build` CLI command
   */
  build?: {
    /**
     * Commands to run during the build process
     */
    commands?: Array<() => Promise<void>>;
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
 */
export type SitecoreCliConfig = DeepRequired<SitecoreCliConfigInput>;

/**
 * Represents a scaffold template used for generating components
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
   * Function to generate the component file contents
   */
  generateTemplate: (componentName: string) => string;

  /**
   * Optional function to return the next steps shown after generating the component
   */
  getNextSteps?: (componentOutputPath: string) => string[];
};

/**
 * Enumeration of default component templates
 */
export enum ComponentTemplateType {
  BYOC = 'byoc',
  DEFAULT = 'default',
}
