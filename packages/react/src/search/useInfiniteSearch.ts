import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_PAGE_SIZE, useSearchService } from './utils';
import { GenericFields, SearchParameters } from '@sitecore-content-sdk/search';

/**
 * Options for the useInfiniteSearch hook.
 * @public
 */
export interface UseInfiniteSearchOptions<T = GenericFields> {
  /**
   * The query string to search for.
   * By default empty string is used.
   */
  query?: string;
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
 * The state of the useInfiniteSearch hook.
 * @public
 */
export interface UseInfiniteSearchState<T = GenericFields> {
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
   * Whether a search request for more results is currently in progress.
   */
  isLoadingMore: boolean;
  /**
   * Whether the search request for more results failed.
   */
  isLoadingMoreError: boolean;
  /**
   * Load more results.
   */
  loadMore: () => void;
  /**
   * Whether there are more results available.
   */
  hasNextPage: boolean;
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
 * React hook for performing infinite search queries.
 * @param {UseInfiniteSearchOptions} options - Configuration options for the infinite search hook.
 * @returns {UseInfiniteSearchState} The infinite search state.
 * @public
 */
export const useInfiniteSearch = <T = GenericFields>(
  options: UseInfiniteSearchOptions<T>
): UseInfiniteSearchState<T> => {
  const { query, searchIndexId, pageSize = DEFAULT_PAGE_SIZE, sort } = options;

  if (!searchIndexId) {
    throw new Error('useInfiniteSearch: searchIndexId is required');
  }

  const [state, setState] = useState<{
    results: T[];
    isLoading: boolean;
    isLoadingMore: boolean;
    total: number;
    totalPages: number;
    error: Error | null;
    hasNextPage: boolean;
    currentOffset: number;
    isSuccess: boolean;
    isError: boolean;
    isLoadingMoreError: boolean;
  }>({
    results: [],
    isLoading: true,
    isLoadingMore: false,
    total: 0,
    totalPages: 0,
    error: null,
    hasNextPage: false,
    currentOffset: 0,
    isSuccess: false,
    isError: false,
    isLoadingMoreError: false,
  });

  const searchService = useSearchService();
  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(
    async (offset: number, isLoadingMore: boolean = false) => {
      // Abort previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      if (isLoadingMore) {
        setState((prev) => ({
          ...prev,
          isLoadingMore: true,
          error: null,
          isLoadingMoreError: false,
          currentOffset: offset,
        }));
      } else {
        setState({
          results: [],
          isLoading: true,
          isLoadingMore: false,
          total: 0,
          totalPages: 0,
          error: null,
          hasNextPage: false,
          currentOffset: 0,
          isSuccess: false,
          isError: false,
          isLoadingMoreError: false,
        });
      }

      try {
        const searchParams: SearchParameters<T> = {
          searchIndexId,
          keyphrase: query,
          limit: pageSize,
          offset,
          sort,
        };

        const { results: searchResults, total: totalResults } = await searchService.search<T>(
          searchParams,
          { signal }
        );

        if (signal.aborted) {
          return;
        }

        setState((prev) => {
          const results = isLoadingMore ? [...prev.results, ...searchResults] : searchResults;
          const totalPages = Math.ceil(totalResults / pageSize);
          const hasNextPage = results.length < totalResults;

          return {
            results,
            isLoading: false,
            error: null,
            currentOffset: prev.currentOffset,
            total: totalResults,
            totalPages,
            hasNextPage: hasNextPage,
            isSuccess: true,
            isError: false,
            isLoadingMore: false,
            isLoadingMoreError: false,
          };
        });
      } catch (err) {
        // Don't set error if request was aborted
        if (signal.aborted) {
          return;
        }

        const errorMessage = err instanceof Error ? err : new Error('Search failed');

        // Don't clean up existing results if appending results
        if (isLoadingMore) {
          setState((prev) => ({
            ...prev,
            isLoadingMoreError: true,
            isLoadingMore: false,
            error: errorMessage,
          }));
        } else {
          setState({
            results: [],
            isLoading: false,
            isLoadingMore: false,
            total: 0,
            totalPages: 0,
            error: errorMessage,
            hasNextPage: false,
            currentOffset: 0,
            isSuccess: false,
            isError: true,
            isLoadingMoreError: false,
          });
        }
      }
    },
    [searchService, pageSize, sort, query, searchIndexId]
  );

  useEffect(() => {
    search(0, false);

    return () => {
      // Abort all requests when component unmounts
      abortControllerRef.current?.abort();
    };
  }, [search]);

  const loadMore = useCallback(() => {
    const nextOffset = state.currentOffset + pageSize;

    search(nextOffset, true);
  }, [state.currentOffset, pageSize, search]);

  return useMemo(
    () => ({
      results: state.results,
      loadMore,
      hasNextPage: state.hasNextPage,
      isLoading: state.isLoading,
      isLoadingMore: state.isLoadingMore,
      isSuccess: state.isSuccess,
      isError: state.isError,
      isLoadingMoreError: state.isLoadingMoreError,
      total: state.total,
      totalPages: state.totalPages,
      error: state.error,
    }),
    [state, loadMore]
  );
};
