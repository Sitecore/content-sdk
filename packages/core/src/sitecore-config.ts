import type { RetryStrategy } from './models';

/**
 * Utility type to make every property in a type required.
 * @public
 */
export type DeepRequired<T> = Required<{
  [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]>;
}>;

/**
 * Type to be used as config input in sitecore.config.
 * @public
 */
export type SitecoreConfigInput = {
  /**
   * API settings required to connect to Sitecore.
   * Both edge and local sets can be specified; the Content SDK app will choose
   * the correct credentials (Edge or local) at runtime.
   */
  api?: {
    /** Edge endpoint credentials for connecting to an XM Cloud instance. */
    edge?: {
      /**
       * A unified identifier used to connect and retrieve data from XM Cloud instance.
       * Must be provided together with `clientContextId` to support both server-
       * side and browser-side data fetching.
       */
      contextId: string;
      /** Optional identifier used for client-side functionality. */
      clientContextId?: string;
      /**
       * XM Cloud endpoint that the app will communicate with.
       * @default https://edge-platform.sitecorecloud.io
       */
      edgeUrl?: string;
    };
    /** API endpoint credentials for connecting to a local Sitecore instance. */
    local?: {
      /** Sitecore API key used to connect to the GraphQL endpoint. */
      apiKey: string;
      /** Sitecore API hostname that the app connects to. */
      apiHost: string;
      /**
       * GraphQL endpoint path appended to `apiHost`.
       * @default /sitecore/api/graph/edge
       */
      path?: string;
    };
  };

  /** The default and fallback locale for your site. */
  defaultLanguage?: string;
  /** The fallback site name. */
  defaultSite?: string;
  /** Editing secret required for Sitecore editing and preview functionality. */
  editingSecret?: string;

  /** Retry configuration applied to Layout, Dictionary and ErrorPages services. */
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

  /** Settings for Layout Service. */
  layout?: {
    /**
     * Override the first part of the GraphQL query for Layout Service.
     * @param {string} siteName site name
     * @param {string} itemPath full item or route path
     * @param {string} [locale] item or route language
     * @returns {string} custom layout query
     */
    formatLayoutQuery?: ((siteName: string, itemPath: string, locale?: string) => string) | null;
  };

  /** Settings for Dictionary Service. */
  dictionary?: {
    /** Configure local memory caching for Dictionary Service requests. */
    caching?: {
      enabled?: boolean;
      timeout?: number;
    };
  };

  /** Settings for multisite functionality. */
  multisite?: {
    /**
     * Enable multisite.
     * @default true
     */
    enabled?: boolean;
    /** Determines if the site should be resolved from the sc_site cookie. */
    useCookieResolution?: (req?: RequestInit, res?: ResponseInit) => boolean;
  };

  /** Settings for Personalize functionality. */
  personalize?: {
    /**
     * Enable personalize proxy.
     * @default process.env.NODE_ENV !== 'development'
     */
    enabled?: boolean;
    /**
     * Sitecore Experience Edge timeout in milliseconds.
     * @default 400
     */
    edgeTimeout?: number;
    /**
     * Sitecore CDP timeout in milliseconds.
     * @default 400
     */
    cdpTimeout?: number;
    /** Optional Sitecore Personalize scope ID. */
    scope?: string;
    /**
     * Sitecore CDP channel used for events.
     * @default WEB
     */
    channel?: string;
    /**
     * Currency for CDP requests.
     * @default USA
     */
    currency?: string;
  };

  /** Settings for redirects functionality. */
  redirects?: {
    /**
     * Enable redirects middleware.
     * @default process.env.NODE_ENV !== 'development'
     */
    enabled?: boolean;
    /** Locales supported by the application. */
    locales?: string[];
  };

  /**
   * Rewrite media/content URLs in Layout Service data and `SitecoreClient.getData` results.
   * @default false
   */
  rewriteMediaUrls?: boolean | ((value: string) => string);

  /** Disable application code extraction and generation. */
  disableCodeGeneration?: boolean;
};

/**
 * Final Sitecore config type used at runtime.
 * Every property is populated by application configuration or fallback values.
 * @public
 */
export type SitecoreConfig = DeepRequired<SitecoreConfigInput>;
