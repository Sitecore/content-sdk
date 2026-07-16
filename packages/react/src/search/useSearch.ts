import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SearchDocument, SearchParameters, FacetRequest, FacetResult } from '@sitecore-content-sdk/search';
import { DEFAULT_PAGE_SIZE, getOffset, SearchStatus, useSearchService } from './utils';

/**
 * Options for the useSearch hook.
 * @public
 */
export interface UseSearchOptions<T extends SearchDocument = SearchDocument> {
  /**
   * The query string to search for.
   * By default empty string is used.
   */
  query?: string;
  /**
   * The current page number (1-indexed).
   * If not provided, the search will start on page 1.
   */
  page?: number;
  /**
   * The ID of the search index to use.
   */
  searchIndexId: string;
  /**
   * Number of results per page.
   * @default 10
   */
  pageSize?: number;
  /**
   * Specifies the sorting of the search results.
   */
  sort?: SearchParameters<T>['sort'];
  /**
   * Specifies whether the search should automatically run.
   * @default true
   */
  enabled?: boolean;
  /**
   * Specifies whether the previous search results should be kept when fetching new results.
   * @default false
   */
  keepPreviousData?: boolean;
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

type InternalState<T extends SearchDocument = SearchDocument> = {
  /**
   * The search results.
   */
  results: T[];
  /**
   * Total number of results across all pages.
   */
  total: number;
  /**
   * Total number of pages available based on `total` and `pageSize`.
   */
  totalPages: number;
  /**
   * Facet results, present only when facets were requested.
   */
  facets?: FacetResult[];
  /**
   * The error object if the last search request failed, or null if no error occurred.
   */
  error: Error | null;
  /**
   * The status of the search.
   * It will be set to:
   * - 'idle' if no search request has been made yet.
   * - 'loading' if a search request is currently in progress.
   * - 'success' if a search request was successful.
   * - 'error' if a search request failed.
   * @default 'idle'
   */
  status: SearchStatus;
  /**
   * The status of the previous search request.
   * @default 'idle'
   */
  previousStatus: SearchStatus;
};

/**
 * The state of the useSearch hook.
 * @public
 */
export type UseSearchState<T extends SearchDocument = SearchDocument> = Omit<
  InternalState<T>,
  'previousStatus'
> & {
  /**
   * Whether a search request is currently in progress.
   */
  isLoading: boolean;
  /**
   * Whether the search request was successful.
   */
  isSuccess: boolean;
  /**
   * Whether the search request failed.
   */
  isError: boolean;
  /**
   * Whether the search results from the previous query are returned.
   * Will be `true` if `keepPreviousData` is set.
   */
  isPreviousData: boolean;
};

/**
 * React hook for performing search queries with pagination.
 * @param {UseSearchOptions} options - Configuration options for the search hook.
 * @returns {UseSearchState} The search state.
 * @throws {Error} if the search index ID is not provided.
 * @public
 */
export const useSearch = <T extends SearchDocument = SearchDocument>(
  options: UseSearchOptions<T>
): UseSearchState<T> => {
  const {
    query,
    page = 1,
    searchIndexId,
    pageSize = DEFAULT_PAGE_SIZE,
    sort,
    enabled = true,
    keepPreviousData = false,
    locale,
    facet,
  } = options;

  const [state, setState] = useState<InternalState<T>>(() => {
    const error = !searchIndexId
      ? new Error('useSearch: searchIndexId is required when initializing the hook')
      : null;

    const status = !searchIndexId ? 'error' : 'idle';

    return {
      results: [],
      total: 0,
      totalPages: 0,
      facets: undefined,
      error,
      status,
      previousStatus: 'idle',
    };
  });

  const searchService = useSearchService();
  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(async () => {
    if (!searchService || !searchIndexId) {
      return;
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setState((prev) => ({
      results: keepPreviousData ? prev.results : [],
      status: 'loading',
      total: keepPreviousData ? prev.total : 0,
      totalPages: keepPreviousData ? prev.totalPages : 0,
      facets: keepPreviousData ? prev.facets : undefined,
      error: null,
      previousStatus: prev.status,
    }));

    try {
      const offset = getOffset(page, pageSize);

      const searchParams: SearchParameters<T> = {
        searchIndexId,
        keyphrase: query,
        limit: pageSize,
        offset,
        sort,
        locale,
        facet,
      };

      const { results: searchResults, total, facets } = await searchService.search<T>(searchParams, {
        signal,
      });

      if (signal.aborted) {
        return;
      }

      const totalPages = Math.ceil(total / pageSize);

      setState({
        results: searchResults,
        total,
        totalPages,
        facets,
        status: 'success',
        error: null,
        previousStatus: 'success',
      });
    } catch (err) {
      // Don't set error if request was aborted
      if (signal.aborted) {
        return;
      }

      const errorMessage = err instanceof Error ? err : new Error(JSON.stringify(err));
      setState({
        results: [],
        total: 0,
        totalPages: 0,
        facets: undefined,
        status: 'error',
        error: errorMessage,
        previousStatus: 'error',
      });
    }
  }, [searchService, searchIndexId, page, pageSize, sort, query, keepPreviousData, locale, facet]);

  useEffect(() => {
    if (enabled) {
      search();
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [search, enabled]);

  return useMemo(
    (): UseSearchState<T> => ({
      error: state.error,
      results: state.results,
      total: state.total,
      totalPages: state.totalPages,
      facets: state.facets,
      status: state.status,
      isLoading: state.status === 'loading',
      isSuccess: state.status === 'success',
      isError: state.status === 'error',
      isPreviousData:
        keepPreviousData && state.previousStatus === 'success' && state.status === 'loading',
    }),
    [state, keepPreviousData]
  );
};
