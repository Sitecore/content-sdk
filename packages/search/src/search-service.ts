import { NativeDataFetcher, debug, constants } from '@sitecore-content-sdk/core';
import { GenericFields, PathsToStringProps } from './models';

/**
 * Options for sorting the search results.
 * @public
 */
export type SortSetting<T extends GenericFields = GenericFields> = {
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
interface SearchAPIResponse<T extends GenericFields = GenericFields> {
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
export interface SearchResponse<T extends GenericFields = GenericFields> {
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
export interface SearchParameters<T extends GenericFields = GenericFields> {
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
}

/**
 * Service that fetches search results from Sitecore.
 * @public
 */
export class SearchService {
  private fetcher: NativeDataFetcher;

  constructor(private config: SearchServiceConfig) {
    this.config.edgeUrl = this.config.edgeUrl || constants.SITECORE_EDGE_URL_DEFAULT;

    this.fetcher = new NativeDataFetcher({
      debugger: debug.search,
    });
  }

  /**
   * Search for items in the search index.
   * @param {SearchParameters<T>} params - The search parameters.
   * @param {RequestInit} [fetchOptions] - The fetch options.
   * @returns {Promise<SearchResponse<T>>} The search response.
   */
  async search<T extends GenericFields = GenericFields>(
    params: SearchParameters<T>,
    fetchOptions?: RequestInit
  ): Promise<SearchResponse<T>> {
    const { searchIndexId, keyphrase = '', sort, limit = 10, offset = 0 } = params;

    this.validateParameters<T>({
      searchIndexId,
      keyphrase,
      sort,
      limit,
      offset,
    });

    const { data } = await this.fetcher.post<SearchAPIResponse<T>>(
      `${this.config.edgeUrl}/v1/search?sitecoreContextId=${this.config.contextId}`,
      {
        config: {
          id: searchIndexId,
        },
        limit,
        offset,
        query: {
          keyphrase,
        },
        facet: {
          fields: [],
          all: true,
        },
        sort,
      },
      fetchOptions
    );

    return {
      results: data.content || [],
      total: data.total || 0,
    };
  }

  private validateParameters<T extends GenericFields = GenericFields>(params: SearchParameters<T>) {
    const { limit, offset, searchIndexId, sort } = params;

    if (limit && limit < 0) {
      throw new Error('Limit must be a positive number');
    }

    if (offset && offset < 0) {
      throw new Error('Offset must be a positive number');
    }

    if (!searchIndexId) {
      throw new Error('Search index ID is required');
    }

    if (sort && !Array.isArray(sort) && typeof sort !== 'object') {
      throw new Error('Sort must be an array or an object');
    }
  }
}
