import { NativeDataFetcher } from '@sitecore-content-sdk/core';
import { resolveEdgeUrl } from '@sitecore-content-sdk/core/tools';
import { getClientId } from '@sitecore-content-sdk/analytics-core';
import {
  SearchDocument,
  SearchQuery,
  PathsToStringProps,
  FacetRequest,
  FacetResult,
  QuerySuggestionItem,
} from './models';
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
  /**
   * Facet results, present only when facets were requested.
   */
  facet?: FacetResult[];
}

/**
 * Response from the Search Service.
 * Keyword search and More Like This (MLT) queries share this mapped shape,
 * so MLT widget consumers can read `results` without additional patching.
 * @public
 */
export interface SearchResponse<T extends SearchDocument = SearchDocument> {
  /**
   * The search results. For MLT queries, these are items similar to the seed item.
   */
  results: T[];
  /**
   * The total number of search results.
   */
  total: number;
  /**
   * Facet results, present only when facets were requested.
   */
  facets?: FacetResult[];
}

/**
 * A set of request parameters for the Search Service.
 * Query fields `keyphrase`, `seedItemId`, and `seedItemUrl` are mutually exclusive.
 * Provide at most one. Omitting all three returns unfiltered results.
 * Use `seedItemId` or `seedItemUrl` for More Like This (MLT) widget queries.
 * These seed fields are sent only to `/v1/search`, not `/v1/search/suggest`.
 * @public
 */
export interface SearchParameters<T extends SearchDocument = SearchDocument> {
  /**
   * The ID of the search index to use.
   */
  searchIndexId: string;
  /**
   * Text value to search for. If not provided, the search will return all results.
   * Mutually exclusive with `seedItemId` and `seedItemUrl`.
   */
  keyphrase?: string;
  /**
   * Item ID used as the seed for More Like This (MLT) results.
   * Mutually exclusive with `keyphrase` and `seedItemUrl`.
   * Used only by `/v1/search`, not `/v1/search/suggest`.
   */
  seedItemId?: string;
  /**
   * Item URL used as the seed for More Like This (MLT) results.
   * Mutually exclusive with `keyphrase` and `seedItemId`.
   * Used only by `/v1/search`, not `/v1/search/suggest`.
   */
  seedItemUrl?: string;
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
  /**
   * Facet configuration. Use 'all: true' to retrieve counts for all enabled facets.
   * Use 'fields' to filter results by specific facet values. Both can be combined.
   */
  facet?: FacetRequest;
}

/**
 * Fetch options for the Search Service.
 * @public
 */
export type SearchServiceFetchOptions = Omit<RequestInit, 'method' | 'body' | 'mode'>;

/**
 * A set of request parameters for the Suggest Service.
 * `/v1/search/suggest` accepts only `keyphrase` in the query payload.
 * `seedItemId` and `seedItemUrl` are not supported.
 * @public
 */
export interface SuggestParameters {
  /**
   * The ID of the search index to use.
   */
  searchIndexId: string;
  /**
   * Partial text used for typeahead suggestions. Must be a non-empty string.
   */
  keyphrase: string;
  /**
   * The locale to use for the suggest request. Required for multi-locale index configurations.
   * Format: letters and hyphens only (e.g. 'en', 'fr-FR', 'el-GR').
   * Omit for single-locale indexes.
   */
  locale?: string;
}

/**
 * Response from the Suggest API.
 * @internal
 */
interface SuggestAPIResponse<T extends SearchDocument = SearchDocument> {
  /**
   * Autocomplete completions from query suggestion mode.
   */
  querySuggestions: QuerySuggestionItem[];
  /**
   * Document previews from preview results mode.
   */
  previewResults: T[];
}

/**
 * Response from the Suggest Service.
 * @public
 */
export interface SuggestResponse<T extends SearchDocument = SearchDocument> {
  /**
   * Autocomplete completions from query suggestion mode.
   */
  querySuggestions: QuerySuggestionItem[];
  /**
   * Document previews from preview results mode.
   */
  previewResults: T[];
}

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
   * For keyword search, pass `keyphrase`. For More Like This (MLT) widget queries,
   * pass `seedItemId` or `seedItemUrl` instead. These query fields are mutually exclusive.
   * MLT responses are mapped to the same `results` / `total` / `facets` shape as keyword search.
   * @param {SearchParameters<T>} params - The search parameters.
   * @param {SearchServiceFetchOptions} [fetchOptions] - The fetch options.
   * @returns {Promise<SearchResponse<T>>} The search response.
   * @throws {NativeDataFetcherError} if the request fails.
   * @throws {RangeError} If limit is not a positive number.
   * @throws {RangeError} If limit is greater than 500.
   * @throws {RangeError} If offset is not a positive number.
   * @throws {TypeError} If search index ID is not provided.
   * @throws {TypeError} If sort is not an array or an object.
   * @throws {TypeError} If more than one of keyphrase, seedItemId, or seedItemUrl is provided.
   * @throws {TypeError} If seedItemId or seedItemUrl is empty or whitespace only.
   */
  async search<T extends SearchDocument = SearchDocument>(
    params: SearchParameters<T>,
    fetchOptions?: SearchServiceFetchOptions
  ): Promise<SearchResponse<T>> {
    const { searchIndexId, sort, limit = 10, offset = 0, locale, facet } = params;

    this.validateParameters<T>({
      ...params,
      searchIndexId,
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
        query: this.buildSearchQuery(params),
        sessionId,
        sort: {
          fields: sortFields,
        },
        ...(locale !== undefined && { locale }),
        ...(facet !== undefined && { facet }),
      },
      options
    );

    return {
      results: data.content || [],
      total: data.total || 0,
      facets: data.facet,
    };
  }

  /**
   * Retrieve typeahead suggestions for a keyphrase.
   * @param {SuggestParameters} params - The suggest parameters.
   * @param {SearchServiceFetchOptions} [fetchOptions] - The fetch options.
   * @returns {Promise<SuggestResponse<T>>} The suggest response.
   * @throws {NativeDataFetcherError} if the request fails.
   * @throws {TypeError} If search index ID is not provided.
   * @throws {TypeError} If keyphrase is not provided or is empty.
   */
  async suggest<T extends SearchDocument = SearchDocument>(
    params: SuggestParameters,
    fetchOptions?: SearchServiceFetchOptions
  ): Promise<SuggestResponse<T>> {
    const { searchIndexId, keyphrase, locale } = params;
    const trimmedKeyphrase = typeof keyphrase === 'string' ? keyphrase.trim() : '';

    this.validateSuggestParameters({
      searchIndexId,
      keyphrase: trimmedKeyphrase,
    });

    const url = new URL('/v1/search/suggest', this.config.edgeUrl);

    const options = {
      ...fetchOptions,
      headers: {
        ...fetchOptions?.headers,
        'x-sitecore-contextid': this.config.contextId,
      },
    };

    const { data } = await this.fetcher.post<SuggestAPIResponse<T>>(
      url.toString(),
      {
        config: {
          id: searchIndexId,
        },
        query: {
          keyphrase: trimmedKeyphrase,
        },
        ...(locale !== undefined && { locale }),
      },
      options
    );

    return {
      querySuggestions: data.querySuggestions || [],
      previewResults: data.previewResults || [],
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

    this.validateQueryExclusivity(params);
  }

  private validateQueryExclusivity<T extends SearchDocument = SearchDocument>(
    params: SearchParameters<T>
  ) {
    const provided: string[] = [];
    const keyphrase = typeof params.keyphrase === 'string' ? params.keyphrase.trim() : '';
    const seedItemId = typeof params.seedItemId === 'string' ? params.seedItemId.trim() : '';
    const seedItemUrl = typeof params.seedItemUrl === 'string' ? params.seedItemUrl.trim() : '';

    if (params.seedItemId !== undefined && !seedItemId) {
      throw new TypeError('seedItemId must be a non-empty string');
    }

    if (params.seedItemUrl !== undefined && !seedItemUrl) {
      throw new TypeError('seedItemUrl must be a non-empty string');
    }

    if (keyphrase) {
      provided.push('keyphrase');
    }

    if (seedItemId) {
      provided.push('seedItemId');
    }

    if (seedItemUrl) {
      provided.push('seedItemUrl');
    }

    if (provided.length > 1) {
      throw new TypeError(
        `Query fields are mutually exclusive. Provide only one of: keyphrase, seedItemId, seedItemUrl. Received: ${provided.join(
          ', '
        )}`
      );
    }
  }

  private buildSearchQuery<T extends SearchDocument = SearchDocument>(
    params: SearchParameters<T>
  ): SearchQuery {
    const seedItemId = typeof params.seedItemId === 'string' ? params.seedItemId.trim() : '';
    const seedItemUrl = typeof params.seedItemUrl === 'string' ? params.seedItemUrl.trim() : '';

    if (seedItemId) {
      return { seedItemId };
    }

    if (seedItemUrl) {
      return { seedItemUrl };
    }

    return { keyphrase: params.keyphrase ?? '' };
  }

  private validateSuggestParameters(params: SuggestParameters) {
    const { searchIndexId, keyphrase } = params;

    if (!searchIndexId) {
      throw new TypeError('Search index ID is required');
    }

    if (!keyphrase) {
      throw new TypeError('Keyphrase is required');
    }
  }
}
