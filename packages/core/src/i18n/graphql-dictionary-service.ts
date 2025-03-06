import { GraphQLClient, GraphQLRequestClientFactory } from '../graphql-request-client';
import { CacheClient, CacheOptions, MemoryCacheClient } from '../cache-client';
import { PageInfo } from '../client';
import { siteNameError, languageError } from '../client/app-root-query';
import debug from '../debug';
import { SitecoreConfig } from '../config';
// TODO: refactor more
/** @private */
export const queryError =
  'Valid value for rootItemId not provided and failed to auto-resolve app root item.';

/** @default */
const siteQuery = /* GraphQL */ `
  query DictionarySiteQuery(
    $siteName: String!
    $language: String!
    $pageSize: Int = 500
    $after: String
  ) {
    site {
      siteInfo(site: $siteName) {
        dictionary(language: $language, first: $pageSize, after: $after) {
          pageInfo {
            endCursor
            hasNext
          }
          results {
            key
            value
          }
        }
      }
    }
  }
`;

/**
 * Object model for Sitecore dictionary phrases
 */
export interface DictionaryPhrases {
  [k: string]: string;
}

/**
 * Service that fetches dictionary data using Sitecore's GraphQL API.
 */
export interface DictionaryService {
  /**
   * Fetch dictionary data for a language.
   * @param {string} language the language to be used to fetch the dictionary
   * @param {string} site site name to fetch data for.
   */
  fetchDictionaryData(language: string, site?: string): Promise<DictionaryPhrases>;
}

/**
 * Configuration options for @see GraphQLDictionaryService instances
 */
export interface GraphQLDictionaryServiceConfig
  extends CacheOptions,
    Pick<SitecoreConfig, 'retries' | 'defaultSite'> {
  /**
   * A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
   * This factory function is used to create and configure GraphQL clients for making GraphQL API requests.
   */
  clientFactory: GraphQLRequestClientFactory;

  /**
   * Optional. The template ID to use when searching for dictionary entries.
   * @default '6d1cd89719364a3aa511289a94c2a7b1' (/sitecore/templates/System/Dictionary/Dictionary entry)
   */
  dictionaryEntryTemplateId?: string;

  /**
   * Optional. The template ID of a JSS App to use when searching for the appRootId.
   * @default '061cba1554744b918a0617903b102b82' (/sitecore/templates/Foundation/JavaScript Services/App)
   */
  jssAppTemplateId?: string;
  /**
   * common variable for all GraphQL queries
   * it will be used for every type of query to regulate result batch size
   * Optional. How many result items to fetch in each GraphQL call. This is needed for pagination.
   * @default 10
   */
  pageSize?: number;
}

/**
 * The schema of data returned in response to a dictionary query request.
 */
export type DictionaryQueryResult = {
  key: { value: string };
  phrase: { value: string };
};

export type DictionarySiteQueryResponse = {
  site: {
    siteInfo: {
      dictionary: {
        results: { key: string; value: string }[];
        pageInfo: PageInfo;
      };
    };
  };
};

/**
 * Service that fetch dictionary data using Sitecore's GraphQL API.
 * @augments DictionaryServiceBase
 * @mixes SearchQueryService<DictionaryQueryResult>
 */
export class GraphQLDictionaryService implements DictionaryService, CacheClient<DictionaryPhrases> {
  private graphQLClient: GraphQLClient;
  private cache: CacheClient<DictionaryPhrases>;
  /**
   * Creates an instance of graphQL dictionary service with the provided options
   * @param {GraphQLDictionaryService} options instance
   */
  constructor(public options: GraphQLDictionaryServiceConfig) {
    this.cache = this.getCacheClient();
    this.graphQLClient = this.getGraphQLClient();
  }

  /**
   * Fetches dictionary data for internalization. Uses search query by default
   * @param {string} language the language to fetch
   * @param {string} site site name to fetch data for.
   * @returns {Promise<DictionaryPhrases>} dictionary phrases
   * @throws {Error} if the app root was not found for the specified site and language.
   */
  async fetchDictionaryData(language: string, site?: string): Promise<DictionaryPhrases> {
    site = site || this.options.defaultSite;
    const cacheKey = this.options.defaultSite + language;
    const cachedValue = this.getCacheValue(cacheKey);
    if (cachedValue) {
      debug.dictionary(
        'using cached dictionary data for %s %s',
        language,
        this.options.defaultSite
      );
      return cachedValue;
    }

    const phrases = await this.fetchWithSiteQuery(site, language);

    this.setCacheValue(cacheKey, phrases);
    return phrases;
  }

  /**
   * Fetches dictionary data with site query
   * This is the default behavior for XMCloud deployments. Uses `siteQuery` to retrieve data.
   * @param {string} site  the site to fetch
   * @param {string} language the language to fetch
   * @returns {Promise<DictionaryPhrases>} dictionary phrases
   */
  async fetchWithSiteQuery(site: string, language: string): Promise<DictionaryPhrases> {
    const phrases: DictionaryPhrases = {};
    debug.dictionary('fetching dictionary data for %s %s', language, site);
    let results: { key: string; value: string }[] = [];
    let hasNext = true;
    let after = '';

    if (!site) {
      throw new RangeError(siteNameError);
    }

    if (!language) {
      throw new RangeError(languageError);
    }

    while (hasNext) {
      const fetchResponse = await this.graphQLClient.request<DictionarySiteQueryResponse>(
        siteQuery,
        {
          siteName: this.options.defaultSite,
          language,
          pageSize: this.options.pageSize,
          after,
        }
      );

      if (fetchResponse?.site?.siteInfo?.dictionary) {
        results = results.concat(fetchResponse.site.siteInfo.dictionary.results);
        after = fetchResponse.site.siteInfo.dictionary.pageInfo.endCursor;
        hasNext = fetchResponse.site.siteInfo.dictionary.pageInfo.hasNext;
      } else {
        hasNext = false;
      }
    }

    results.forEach((item) => (phrases[item.key] = item.value));

    return phrases;
  }

  /**
   * Caches a @see DictionaryPhrases value for the specified cache key.
   * @param {string} key The cache key.
   * @param {DictionaryPhrases} value The value to cache.
   * @returns The value added to the cache.
   * @mixes CacheClient<DictionaryPhrases>
   */
  setCacheValue(key: string, value: DictionaryPhrases): DictionaryPhrases {
    return this.cache.setCacheValue(key, value);
  }

  /**
   * Retrieves a @see DictionaryPhrases value from the cache.
   * @param {string} key The cache key.
   * @returns The @see DictionaryPhrases value, or null if the specified key is not found in the cache.
   */
  getCacheValue(key: string): DictionaryPhrases | null {
    return this.cache.getCacheValue(key);
  }

  /**
   * Gets a cache client that can cache data. Uses memory-cache as the default
   * library for caching (@see MemoryCacheClient). Override this method if you
   * want to use something else.
   * @returns {CacheClient} implementation
   */
  protected getCacheClient(): CacheClient<DictionaryPhrases> {
    return new MemoryCacheClient<DictionaryPhrases>(this.options);
  }

  /**
   * Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
   * library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
   * want to use something else.
   * @returns {GraphQLClient} implementation
   */
  protected getGraphQLClient(): GraphQLClient {
    if (!this.options.clientFactory) {
      throw new Error('clientFactory needs to be provided when initializing GraphQL client.');
    }
    return this.options.clientFactory({
      debugger: debug.dictionary,
      retries: this.options.retries.count,
      retryStrategy: this.options.retries.retryStrategy,
    });
  }
}
