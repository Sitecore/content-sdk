/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_PAGE_SIZE, SearchStatus, useSearchService } from './utils';
import { SearchDocument, SearchParameters } from '@sitecore-content-sdk/search';

/**
 * Options for the useInfiniteSearch hook.
 * @public
 */
export interface UseInfiniteSearchOptions<T extends SearchDocument = SearchDocument> {
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
  /**
   * Specifies whether the search should automatically run.
   * @default true
   */
  enabled?: boolean;
}

/**
 * The state of the useInfiniteSearch hook.
 * @public
 */
export type UseInfiniteSearchState<T extends SearchDocument = SearchDocument> = Omit<
  InternalInfiniteSearchState<T>,
  'offset'
> & {
  /**
   * Load the next page of results.
   */
  loadMore: () => void;
  /**
   * Whether there are more results available.
   */
  hasNextPage: boolean;
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
};

type InternalInfiniteSearchState<T extends SearchDocument = SearchDocument> = {
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
   * The error object if the last search request failed, or null if no error occurred.
   */
  error: Error | null;
  /**
   * The current offset of the search results.
   */
  offset: number;
  /**
   * The status of the initial search request.
   * It will be set to:
   * - 'idle' if no search request has been made yet.
   * - 'loading' if a search request is currently in progress.
   * - 'success' if a search request was successful.
   * - 'error' if a search request failed.
   * @default 'idle'
   */
  status: SearchStatus;
  /**
   * The status of the "load more" request.
   * It will be set to:
   * - 'idle' if no "load more" request has been made yet.
   * - 'loading' if a "load more" request is currently in progress.
   * - 'error' if a "load more" request failed.
   * @default 'idle'
   */
  loadMoreStatus: Omit<SearchStatus, 'success'>;
};

/**
 * React hook for performing infinite search queries.
 * @param {UseInfiniteSearchOptions} options - Configuration options for the infinite search hook.
 * @returns {UseInfiniteSearchState} The infinite search state.
 * @throws {Error} if the search index ID is not provided.
 * @public
 */
export const useInfiniteSearch = <T extends SearchDocument = SearchDocument>(
  options: UseInfiniteSearchOptions<T>
): UseInfiniteSearchState<T> => {
  const { query, searchIndexId, pageSize = DEFAULT_PAGE_SIZE, sort, enabled = true } = options;

  if (!searchIndexId) {
    throw new Error('useInfiniteSearch: searchIndexId is required');
  }

  const [state, setState] = useState<InternalInfiniteSearchState<T>>({
    results: [],
    total: 0,
    totalPages: 0,
    error: null,
    offset: 0,
    status: 'idle',
    loadMoreStatus: 'idle',
  });

  const hasNextPage = useMemo(
    () => state.results.length < state.total,
    [state.results.length, state.total]
  );

  const searchService = useSearchService();
  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(
    async (offset: number, isLoadingMore: boolean = false) => {
      if (!searchService) {
        return;
      }

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      if (isLoadingMore) {
        setState((prev) => ({
          ...prev,
          error: null,
          loadMoreStatus: 'loading',
        }));
      } else {
        setState({
          results: [],
          total: 0,
          totalPages: 0,
          error: null,
          offset: 0,
          status: 'loading',
          loadMoreStatus: 'idle',
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
          return {
            results,
            error: null,
            offset,
            status: 'success',
            loadMoreStatus: 'idle',
            total: totalResults,
            totalPages,
          };
        });
      } catch (err) {
        // Don't set error if request was aborted
        if (signal.aborted) {
          return;
        }

        const errorMessage = err instanceof Error ? err : new Error(JSON.stringify(err));

        // Don't clean up existing results if appending results
        if (isLoadingMore) {
          setState((prev) => ({
            ...prev,
            error: errorMessage,
            loadMoreStatus: 'error',
          }));
        } else {
          setState({
            results: [],
            total: 0,
            totalPages: 0,
            error: errorMessage,
            offset: 0,
            status: 'error',
            loadMoreStatus: 'idle',
          });
        }
      }
    },
    [searchService, pageSize, sort, query, searchIndexId]
  );

  useEffect(() => {
    if (enabled) {
      search(0, false);
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [search, enabled]);

  const loadMore = useCallback(() => {
    // Don't load more if already loading or no more pages
    if (state.loadMoreStatus === 'loading' || !hasNextPage) {
      return;
    }

    const nextOffset = state.offset + pageSize;

    search(nextOffset, true);
  }, [search, pageSize, state.offset, hasNextPage, state.loadMoreStatus]);

  return useMemo(
    (): UseInfiniteSearchState<T> => ({
      results: state.results,
      status: state.status,
      loadMoreStatus: state.loadMoreStatus,
      total: state.total,
      totalPages: state.totalPages,
      error: state.error,
      loadMore,
      hasNextPage,
      isLoading: state.status === 'loading',
      isSuccess: state.status === 'success',
      isError: state.status === 'error',
      isLoadingMore: state.loadMoreStatus === 'loading',
      isLoadingMoreError: state.loadMoreStatus === 'error',
    }),
    [state, loadMore, hasNextPage]
  );
};
