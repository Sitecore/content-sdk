import { RetryStrategy } from '../models';

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
      contextId?: string;
      // clientContextId will be utilized when we know more specifics about it
      clientContextId?: string;
      edgeUrl?: string;
    };
    /**
     * API endpoint (legacy) credentials for Sitecore connection. Can be used for local deploy
     */
    local?: {
      apiKey?: string;
      apiHost?: string;
      path?: string;
    };
  };
  defaultSite: string;
  defaultLanguage: string;
  /**
   * Editing secret required to support Sitecore editing and preview functionality.
   */
  editingSecret?: string;
  retries?: {
    /**
     * Number of retries for graphql client. Will use the specified `retryStrategy`.
     */
    count?: number;
    /**
     * Retry strategy for the client. Uses `DefaultRetryStrategy` by default with exponential
     * back-off factor of 2 for codes 429, 502, 503, 504, 520, 521, 522, 523, 524.
     */
    retryStrategy?: RetryStrategy;
  };
  layout?: {
    /**
     * Customize GraphQL Layout Service request query
     * Default: layout(site:"${siteName}", routePath:"${itemPath}", language:"${locale}"`
     */
    formatLayoutQuery?: (siteName: string, itemPath: string, locale?: string) => string;
  };
  dictionary?: {
    /**
     * configure local memory caching for Dictionary Service requests
     */
    caching?: {
      enabled?: boolean;
      timeout?: number;
    };
  };
  multisite: {
    enabled: boolean;
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
  personalize: {
    enabled: boolean;
    /**
     * Configuration for your Sitecore Experience Edge endpoint
     */
    edgeTimeout: number;
    /**
     * Configuration for your Sitecore CDP endpoint
     */
    cdpTimeout: number;
    /**
     * Optional Sitecore Personalize scope identifier allowing you to isolate your personalization data between XM Cloud environments
     */
    scope: string | undefined;
    /**
     * The Sitecore CDP channel to use for events. Uses 'WEB' by default.
     */
    channel?: string | undefined;
    /**
     * Currency for CDP request. Uses 'USA' as default.
     */
    currency?: string | undefined;
  };
  redirects: {
    enabled: boolean;
    /**
     * These are all the locales you support in your application.
     * These should match those in your next.config.js (i18n.locales).
     */
    locales?: string[];
  };
};

/**
 * Final sitecore config type used at runtime
 * Every property should be populated, either from sitecore.config or built-in fallback values
 */
export type SitecoreConfig = DeepRequired<SitecoreConfigInput>;
