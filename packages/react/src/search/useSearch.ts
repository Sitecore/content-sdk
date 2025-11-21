import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SearchParameters, SearchResponse } from '@sitecore-content-sdk/search';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, getOffset, useSearchService } from './utils';

export type PrimitiveType = string | number | boolean;

export interface UseSearchOptions {
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
 * Return type for the useSearch hook.
 * @public
 */
export interface UseSearchReturn {
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
 * React hook for performing search queries with pagination.
 * @param {UseSearchOptions} options - Configuration options for the search hook.
 * @returns {UseSearchReturn} Search state and handler functions.
 * @public
 */
export const useSearch = (options: UseSearchOptions): UseSearchReturn => {
  const {
    query,
    page = DEFAULT_PAGE,
    searchIndexId,
    pageSize = DEFAULT_PAGE_SIZE,
    sort,
    onSuccess,
  } = options;

  if (!searchIndexId) {
    throw new Error('useSearch: searchIndexId is required');
  }

  const [results, setResults] = useState<Record<string, PrimitiveType>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const { searchService } = useSearchService();
  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(async () => {
    if (!searchService) {
      return;
    }

    // Abort previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);
    setError(null);

    try {
      const offset = getOffset(page, pageSize);

      const searchParams: SearchParameters = {
        searchIndexId,
        keyphrase: query,
        limit: pageSize,
        offset,
        sort,
      };

      const { results: searchResults, total } = await searchService.search(searchParams);

      // Check if request was aborted
      if (signal.aborted) {
        return;
      }

      const totalPages = Math.ceil(total / pageSize);

      setResults(searchResults);
      setTotal(total);
      setTotalPages(totalPages);
      onSuccess?.({ total, results: searchResults, totalPages });
    } catch (err) {
      // Don't set error if request was aborted
      if (signal.aborted) {
        return;
      }

      const errorMessage = err instanceof Error ? err : new Error('Search failed');
      setError(errorMessage);
      setResults([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [searchService, page, pageSize, sort, onSuccess, query, searchIndexId]);

  useEffect(() => {
    search();
  }, [search]);

  useEffect(() => {
    return () => {
      // Abort all requests when component unmounts
      abortControllerRef.current?.abort();
    };
  }, []);

  const isEmpty = useMemo(() => results.length === 0, [results]);

  return useMemo(
    () => ({
      results,
      isEmpty,
      isLoading,
      total,
      totalPages,
      error,
    }),
    [results, isEmpty, isLoading, total, totalPages, error]
  );
};
