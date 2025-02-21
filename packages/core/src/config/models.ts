import { RetryStrategy } from '../graphql-request-client';
import { SiteInfo } from '../site/models';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : Partial<T[P]>;
};

export type SitecoreConfig = {
  api: {
    // keeping both edge and local sets until component library starts using edge credentials
    edge: {
      contextId: string;
      clientContextId: string;
      edgeUrl: string;
      path?: string;
    };
    local?: {
      apiKey: string;
      apiHost: string;
      path?: string;
    };
  };
  defaultSite: string;
  defaultLanguage: string;
  editingSecret?: string;
  retries?: {
    count?: number;
    retryStrategy?: RetryStrategy;
  };
  layout?: {
    formatLayoutQuery?: (siteName: string, itemPath: string, locale?: string) => string;
  };
  dictionary?: {
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
    scope?: string;
    channel?: string;
    currency?: string;
    edgeTimeout?: number;
    cdpTimeout?: number;
  };
  redirects: {
    enabled: boolean;
    locales?: string[];
  };
  initialized?: boolean;
};

/**
 * Type to be used as config input in sitecore.config
 * All props are made optional so that config can be overriden in a flexible way
 */
export type SitecoreConfigInput = DeepPartial<SitecoreConfig>;

export type SitecoreIntializationOptions = {
  sitecoreConfig: SitecoreConfig;
  sites: SiteInfo[];
  components?: Map<string, unknown>;
};
