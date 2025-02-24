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
     * Edge endpoint credentials for Sitecore connection. Can be used for XMCloud deploy
     */
    edge?: {
      contextId?: string;
      clientContextId?: string;
      edgeUrl?: string;
      path?: string;
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
   * Editing secret required for Pages editing and preview integration
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
     * configure local memory caching for DIctionary Service requests
     */
    caching?: {
      enabled?: boolean;
      timeout?: number;
    };
  };
  multisite: {
    enabled: boolean;
    defaultHostname?: string;
    useCookieResolution?: () => boolean;
  };
  personalize: {
    enabled: boolean;
    edgeTimeout: number;
    cdpTimeout: number;
    scope: string | undefined;
    channel?: string;
    currency?: string;
  };
  redirects: {
    enabled: boolean;
    locales?: string[];
  };
};

/**
 * Final sitecore config type used at runtime
 * Every property should be populated, either from sitecore.config or built-in fallback values
 */
export type SitecoreConfig = DeepRequired<SitecoreConfigInput>;
