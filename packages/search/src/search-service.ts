import { NativeDataFetcher } from '@sitecore-content-sdk/core';
import { resolveEdgeUrl } from '@sitecore-content-sdk/core/tools';
import { getClientId } from '@sitecore-content-sdk/analytics-core';
import { SearchDocument, PathsToStringProps } from './models';
import { debug } from './debug';

/**
 * Options for sorting the search results.
 * @public
 */
export type SortSetting<T extends SearchDocument = SearchDocument> = {
  name: PathsToStringProps<T>;
  order: 'asc' | 'desc';
};

/**
 * Configuration for the Search Service.
 * @public
 */
export interface SearchServiceConfig {
  /**
   * XM Cloud endpoint that the app will communicate and retrieve data from.
   * @default https://edge-platform.sitecorecloud.io
   */
  edgeUrl?: string;
  /**
   * A unified identifier used to connect and retrieve data.
   */
  contextId: string;
}

/**
 * Response from the Search API.
 * @internal
 */
interface SearchAPIResponse<T extends SearchDocument = SearchDocument> {
  /**
   * The search results.
   */
  content: T[];
  /**
   * The total number of search results.
   */
  total: number;
}

/**
 * Response from the Search Service.
 * @public
 */
export interface SearchResponse<T extends SearchDocument = SearchDocument> {
  /**
   * The search results.
   */
  results: T[];
  /**
   * The total number of search results.
   */
  total: number;
}

/**
 * A set of request parameters for the Search Service.
 * @public
 */
export interface SearchParameters<T extends SearchDocument = SearchDocument> {
  /**
   * The ID of the search index to use.
   */
  searchIndexId: string;
  /**
   * Text value to search for. If not provided, the search will return all results.
   */
  keyphrase?: string;
  /**
   * Specifies the sorting of the search results.
   */
  sort?: SortSetting<T>[] | SortSetting<T>;
  /**
   * Specifies the maximum number of items to return. Maximum value 500.
   * @default 10
   */
  limit?: number;
  /**
   * Specifies how many items to skip before starting to collect the result set.
   * @default 0
   */
  offset?: number;
  /**
   * The locale to use for the search. Required for multi-locale index configurations.
   * Format: letters and hyphens only (e.g. 'en', 'fr-FR', 'el-GR').
   * Omit for single-locale indexes.
   */
  locale?: string;
}

/**
 * Fetch options for the Search Service.
 * @public
 */
export type SearchServiceFetchOptions = Omit<RequestInit, 'method' | 'body' | 'mode'>;

/**
 * Service that fetches search results from Sitecore.
 * @public
 */
export class SearchService {
  private fetcher: NativeDataFetcher;

  constructor(private config: SearchServiceConfig) {
    this.config.edgeUrl = this.config.edgeUrl ?? resolveEdgeUrl();

    this.fetcher = new NativeDataFetcher({
      debugger: debug,
    });
  }

  /**
   * Search for items in the search index.
   * @param {SearchParameters<T>} params - The search parameters.
   * @param {SearchServiceFetchOptions} [fetchOptions] - The fetch options.
   * @returns {Promise<SearchResponse<T>>} The search response.
   * @throws {NativeDataFetcherError} if the request fails.
   * @throws {RangeError} If limit is not a positive number.
   * @throws {RangeError} If limit is greater than 500.
   * @throws {RangeError} If offset is not a positive number.
   * @throws {TypeError} If search index ID is not provided.
   * @throws {TypeError} If sort is not an array or an object.
   */
  async search<T extends SearchDocument = SearchDocument>(
    params: SearchParameters<T>,
    fetchOptions?: SearchServiceFetchOptions
  ): Promise<SearchResponse<T>> {
    const { searchIndexId, keyphrase = '', sort, limit = 10, offset = 0, locale } = params;

    this.validateParameters<T>({
      searchIndexId,
      keyphrase,
      sort,
      limit,
      offset,
    });

    const url = new URL('/v1/search', this.config.edgeUrl);

    let sessionId = '';
    try {
      sessionId = getClientId();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // We don't have to treat errors in a special way since we use an empty string as the fallback value
    }

    const sortFields = sort ? (Array.isArray(sort) ? sort : [sort]) : [];

    const options = {
      ...fetchOptions,
      headers: {
        ...fetchOptions?.headers,
        'x-sitecore-contextid': this.config.contextId,
      },
    };

    const { data } = await this.fetcher.post<SearchAPIResponse<T>>(
      url.toString(),
      {
        config: {
          id: searchIndexId,
        },
        limit,
        offset,
        query: {
          keyphrase,
        },
        sessionId,
        sort: {
          fields: sortFields,
        },
        ...(locale !== undefined && { locale }),
      },
      options
    );

    return {
      results: data.content || [],
      total: data.total || 0,
    };
  }

  private validateParameters<T extends SearchDocument = SearchDocument>(
    params: SearchParameters<T>
  ) {
    const { limit, offset, searchIndexId, sort } = params;

    if (limit && limit < 0) {
      throw new RangeError('Limit must be a positive number');
    }

    if (limit && limit > 500) {
      throw new RangeError('Limit must be less than or equal to 500');
    }

    if (offset && offset < 0) {
      throw new RangeError('Offset must be a positive number');
    }

    if (!searchIndexId) {
      throw new TypeError('Search index ID is required');
    }

    if (sort && !Array.isArray(sort) && typeof sort !== 'object') {
      throw new TypeError('Sort must be an array or an object');
    }
  }
}
