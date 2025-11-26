import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GenericFields, SearchParameters } from '@sitecore-content-sdk/search';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, getOffset, useSearchService } from './utils';

/**
 * Options for the useSearch hook.
 * @public
 */
export interface UseSearchOptions<T extends GenericFields = GenericFields> {
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
}

/**
 * The state of the useSearch hook.
 * @public
 */
export interface UseSearchState<T extends GenericFields = GenericFields> {
  /**
   * The search results.
   */
  results: T[];
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
   * Total number of results across all pages.
   */
  total: number;
  /**
   * Total number of pages available based on `total` and `pageSize`.
   */
  totalPages: number;
  /**
   * The error object if the last search request failed, or null if no error occurred.
   */
  error: Error | null;
}

/**
 * React hook for performing search queries with pagination.
 * @param {UseSearchOptions} options - Configuration options for the search hook.
 * @returns {UseSearchState} The search state.
 * @public
 */
export const useSearch = <T extends GenericFields = GenericFields>(
  options: UseSearchOptions<T>
): UseSearchState<T> => {
  const { query, page = DEFAULT_PAGE, searchIndexId, pageSize = DEFAULT_PAGE_SIZE, sort } = options;

  if (!searchIndexId) {
    throw new Error('useSearch: searchIndexId is required');
  }

  const [state, setState] = useState<{
    results: T[];
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    total: number;
    totalPages: number;
    error: Error | null;
  }>({
    results: [],
    isLoading: true,
    isSuccess: false,
    isError: false,
    total: 0,
    totalPages: 0,
    error: null,
  });

  const searchService = useSearchService();
  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setState({
      results: [],
      isLoading: true,
      isSuccess: false,
      isError: false,
      total: 0,
      totalPages: 0,
      error: null,
    });

    try {
      const offset = getOffset(page, pageSize);

      const searchParams: SearchParameters<T> = {
        searchIndexId,
        keyphrase: query,
        limit: pageSize,
        offset,
        sort,
      };

      if (signal.aborted) {
        return;
      }

      const { results: searchResults, total } = await searchService.search<T>(searchParams);

      if (signal.aborted) {
        return;
      }

      const totalPages = Math.ceil(total / pageSize);

      setState({
        results: searchResults,
        total,
        totalPages,
        isSuccess: true,
        isError: false,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      // Don't set error if request was aborted
      if (signal.aborted) {
        return;
      }

      const errorMessage = err instanceof Error ? err : new Error('Search failed');
      setState({
        results: [],
        total: 0,
        totalPages: 0,
        isSuccess: false,
        isError: true,
        isLoading: false,
        error: errorMessage,
      });
    }
  }, [searchService, searchIndexId, page, pageSize, sort, query]);

  useEffect(() => {
    search();
  }, [search]);

  useEffect(() => {
    return () => {
      // Abort all requests when component unmounts
      abortControllerRef.current?.abort();
    };
  }, []);

  return useMemo(
    () => ({
      results: state.results,
      isLoading: state.isLoading,
      isSuccess: state.isSuccess,
      isError: state.isError,
      total: state.total,
      totalPages: state.totalPages,
      error: state.error,
    }),
    [state]
  );
};
