import { Debugger } from 'debug';
import { SitecoreConfig, SitecoreConfigInput } from '../config';
import { DictionaryPhrases } from '../i18n';
import { LayoutServiceData } from '../layout';
import { HTMLLink, RetryStrategy } from '../models';
import { SiteInfo } from '../site';

export type FetchOptions = Partial<Pick<SitecoreConfigInput, 'api'>> & {
  /**
   * Number of retries GraphQL client will attempt on request error
   */
  retries?: number;
  /**
   * Retry strategy instance
   */
  retryStrategy?: RetryStrategy;
  /**
   * Override to replace default nodeJS fetch implementation
   */
  fetch?: typeof fetch;
  /**
   * Custom headers to be sent with each request.
   */
  headers?: Record<string, string>;
  /**
   * Override debugger for logging. Uses 'core:http' by default.
   */
  debugger?: Debugger;
};

// The same type returned from getPage and getPreviewPage
// represent a Page model returned from edge
export type Page = {
  layout: LayoutServiceData;
  site?: SiteInfo;
  locale: string;
  dictionary?: DictionaryPhrases;
  headLinks: HTMLLink[];
};

export type SitecoreClientInit = Omit<SitecoreConfig, 'multisite' | 'redirects' | 'personalize'> & {
  sites: SiteInfo[];
};

/**
 * Data needed to paginate results in graphql
 */
export interface PageInfo {
  /**
   * string token that can be used to fetch the next page of results
   */
  endCursor: string;
  /**
   * a value that indicates whether more pages of results are available
   */
  hasNext: boolean;
}

export interface DictionaryQueryVariables {
  /**
   * Optional. The ID of the search root item. Fetch items that have this item as an ancestor.
   */
  rootItemId?: string;

  /**
   * Optional. Sitecore template ID(s). Fetch items that inherit from this template(s).
   */
  templates?: string;

  /**
   * common variable for all GraphQL queries
   * it will be used for every type of query to regulate result batch size
   * Optional. How many result items to fetch in each GraphQL call. This is needed for pagination.
   * @default 10
   */
  pageSize?: number;
}
