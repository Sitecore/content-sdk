import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_PAGE_SIZE, useSearchService } from './utils';
import { SearchParameters, SearchResponse } from '@sitecore-content-sdk/search';

export type PrimitiveType = string | number | boolean;

export interface UseInfiniteSearchOptions {
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
  sort?: SearchParameters['sort'];
  /**
   * Callback fired when search is completed.
   */
  onSuccess?: (data: {
    total: number;
    results: SearchResponse['results'];
    totalPages: number;
  }) => void;
}

/**
 * Return type for the useInfiniteSearch hook.
 * @public
 */
export interface UseInfiniteSearchReturn {
  /**
   * Array of search results. Each result is a record with string keys and primitive values.
   */
  results: Record<string, PrimitiveType>[];
  /**
   * Whether the search has no results.
   */
  isEmpty: boolean;
  /**
   * Whether a search request is currently in progress.
   */
  isLoading: boolean;
  /**
   * Whether a search request for more results is currently in progress.
   */
  isLoadingMore: boolean;
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
   * Total number of pages available based on totalResults and pageSize.
   */
  totalPages: number;
  /**
   * Error object if the last search request failed, or null if no error occurred.
   */
  error: Error | null;
}

/**
 * React hook for performing infinite search queries.
 * @param {UseInfiniteSearchOptions} options - Configuration options for the infinite search hook.
 * @returns {UseInfiniteSearchReturn} Infinite search state and handler functions.
 * @public
 */
export const useInfiniteSearch = (options: UseInfiniteSearchOptions): UseInfiniteSearchReturn => {
  const { query, searchIndexId, pageSize = DEFAULT_PAGE_SIZE, sort, onSuccess } = options;

  if (!searchIndexId) {
    throw new Error('useSearch: searchIndexId is required');
  }

  const [results, setResults] = useState<Record<string, PrimitiveType>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  // Track current offset for infinite scroll
  const [currentOffset, setCurrentOffset] = useState(0);

  // Track previous query to detect changes
  const previousQueryRef = useRef<string | undefined>(query);

  const { searchService } = useSearchService();
  const abortControllerRef = useRef<AbortController | null>(null);

  const performSearch = useCallback(
    async (offset: number, append: boolean = false) => {
      // Abort previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const searchParams: SearchParameters = {
          searchIndexId,
          keyphrase: query,
          limit: pageSize,
          offset,
          sort,
        };

        const { results: searchResults, total: totalResults } = await searchService.search(
          searchParams
        );

        // Check if request was aborted
        if (signal.aborted) {
          return;
        }

        let updatedResults: Record<string, PrimitiveType>[] = [];

        if (append) {
          // Append results for infinite scroll
          setResults((prev) => {
            updatedResults = [...prev, ...searchResults];
            return updatedResults;
          });
        } else {
          // Replace results for new search
          updatedResults = searchResults;
          setResults(searchResults);
        }

        setHasNextPage(updatedResults.length < totalResults);

        const totalPages = Math.ceil(totalResults / pageSize);

        setTotal(totalResults);
        setTotalPages(totalPages);
        onSuccess?.({
          total: totalResults,
          results: updatedResults,
          totalPages,
        });
      } catch (err) {
        // Don't set error if request was aborted
        if (signal.aborted) {
          return;
        }

        const errorMessage = err instanceof Error ? err : new Error('Search failed');
        setError(errorMessage);

        // Don't clean up existing results if appending results
        if (!append) {
          setResults([]);
          setTotal(0);
          setTotalPages(0);
        }

        setHasNextPage(false);
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [searchService, pageSize, sort, onSuccess, query, searchIndexId]
  );

  const search = useCallback(() => {
    // Reset offset and clear results for new search
    setCurrentOffset(0);
    setResults([]);

    performSearch(0, false);
  }, [performSearch]);

  // Trigger search on mount and when query changes
  useEffect(() => {
    if (!searchService) {
      return;
    }

    // Check if query has changed
    const queryChanged = previousQueryRef.current !== query;

    if (queryChanged) {
      previousQueryRef.current = query;
    }

    search();
  }, [query, search, searchService]);

  useEffect(() => {
    return () => {
      // Abort all requests when component unmounts
      abortControllerRef.current?.abort();
    };
  }, []);

  const loadMore = useCallback(() => {
    // Don't load more if already loading or no more results available
    if (isLoading || isLoadingMore || !hasNextPage) {
      return;
    }

    const nextOffset = currentOffset + pageSize;
    setCurrentOffset(nextOffset);

    performSearch(nextOffset, true);
  }, [isLoading, isLoadingMore, hasNextPage, currentOffset, pageSize, performSearch]);

  const isEmpty = useMemo(() => results.length === 0, [results]);

  return useMemo(
    () => ({
      results,
      loadMore,
      hasNextPage,
      isEmpty,
      isLoading,
      isLoadingMore,
      total,
      totalPages,
      error,
    }),
    [results, loadMore, hasNextPage, isEmpty, isLoading, isLoadingMore, total, totalPages, error]
  );
};
