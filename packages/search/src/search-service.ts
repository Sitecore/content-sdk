import { NativeDataFetcher, debug } from '@sitecore-content-sdk/core';
import { FacetFilter } from './facet-filter';

type SortSetting = {
  name: string;
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

type Facet = {
  fields: {
    /**
     * The name of the facet field to filter on.
     */
    name: string;
    /**
     * Array of filters to apply to this facet field.
     *
     */
    filters?: FacetFilter[];
  }[];
};

export interface SearchResponse {
  content: Record<string, string | number | boolean>[];
  total: number;
  facet: Facet[];
}

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
   * Specifies the facets to apply to the search results.
   */
  facet?: Facet[];
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
    this.config = config;

    this.fetcher = new NativeDataFetcher({
      debugger: debug.search,
    });
  }

  async search(params: SearchParameters): Promise<SearchResponse> {
    const { searchIndexId, keyphrase = '', facet, sort, limit = 10, offset = 0 } = params;

    const { data } = await this.fetcher.post<SearchResponse>(
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
        facet,
        sort,
      }
    );

    return {
      content: data.content || [],
      facet: data.facet,
      total: data.total || 0,
    };
  }
}
