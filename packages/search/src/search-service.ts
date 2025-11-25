import { NativeDataFetcher, debug, constants } from '@sitecore-content-sdk/core';

/**
 * Options for sorting the search results.
 * @public
 */
export type SortSetting = {
  name: string;
  order: 'asc' | 'desc';
};

export type PrimitiveType = string | number | boolean;

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
interface SearchAPIResponse<Fields = GenericFields> {
  /**
   * The search results.
   */
  content: Fields[];
  /**
   * The total number of search results.
   */
  total: number;
}

export type GenericFields = Record<string, PrimitiveType>;

/**
 * Response from the Search Service.
 * @public
 */
export interface SearchResponse<Fields = GenericFields> {
  /**
   * The search results.
   */
  results: Fields[];
  /**
   * The total number of search results.
   */
  total: number;
}

/**
 * A set of request parameters for the Search Service.
 * @public
 */
export interface SearchParameters {
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
  sort?: SortSetting[] | SortSetting;
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

  async search<Fields = GenericFields>(params: SearchParameters): Promise<SearchResponse<Fields>> {
    const { searchIndexId, keyphrase = '', sort, limit = 10, offset = 0 } = params;

    const { data } = await this.fetcher.post<SearchAPIResponse<Fields>>(
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
      }
    );

    return {
      results: data.content || [],
      total: data.total || 0,
    };
  }
}
