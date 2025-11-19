import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SearchService, SearchParameters } from '@sitecore-content-sdk/search';
import { useSitecore } from '../enhancers/withSitecore';
import { useDebouncedCallback } from './useDebouncedCallback';

type PrimitiveType = string | number | boolean;

export interface SearchResponse {
  content: Record<string, PrimitiveType>[];
  total: number;
}

export interface UseSearchOptions {
  /**
   * The initial query string used to trigger the first search.
   * If not provided, the search will not be triggered on mount.
   */
  initialQuery?: string;
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
   * Delay in milliseconds before triggering search.
   * @default 300
   */
  debounceDelay?: number;
  /**
   * Additional search parameters (facets, filters, sort).
   */
  searchParams?: Omit<SearchParameters, 'searchIndexId' | 'keyphrase' | 'limit' | 'offset'>;
  /**
   * Callback fired when search completes.
   */
  onSearchComplete?: (data: { totalResults: number; keyword: string }) => void;
}

/**
 * Return type for the useSearch hook.
 * @public
 */
export interface UseSearchReturn {
  /**
   * Current page number (1-indexed).
   */
  currentPage: number;
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
  loading: boolean;
  /**
   * Total number of results across all pages.
   */
  totalResults: number;
  /**
   * Total number of pages available based on totalResults and pageSize.
   */
  totalPages: number;
  /**
   * Error object if the last search request failed, or null if no error occurred.
   */
  error: Error | null;
  /**
   * Handler function for search input changes. Debounced based on debounceDelay option.
   * Call this when the user types in a search input field.
   * @param {string} searchTerm - The search query string.
   */
  handleSearchChange: (searchTerm: string) => void;
  /**
   * Handler function for pagination. Executes immediately (not debounced).
   * Call this when the user navigates to a different page.
   * @param {string} searchTerm - The current search query.
   * @param {number} page - The page number to navigate to (1-indexed).
   */
  handlePageChange: (searchTerm: string, page: number) => void;
  /**
   * Direct search function. Executes immediately (not debounced).
   * Use this for programmatic searches or when debouncing is not desired.
   * @param {string} query - The search query string.
   * @param {number} [page=1] - The page number to fetch (1-indexed).
   * @returns {Promise<void>}
   */
  search: (query: string, page?: number) => Promise<void>;
  /**
   * Reset the search state to the initial values.
   * @returns {void}
   */
  reset: () => void;
}

/**
 * React hook for performing search queries with pagination and debouncing support.
 * @param {UseSearchOptions} options - Configuration options for the search hook.
 * @returns {UseSearchReturn} Search state and handler functions.
 * @example
 *
 * const SearchComponent = () => {
 *   const { results, loading, handleSearchChange } = useSearch({
 *     searchIndexId: 'your-index-id',
 *     debounceDelay: 300,
 *   });
 *
 *   return (
 *     <div>
 *       <input onChange={(e) => handleSearchChange(e.target.value)} />
 *       {loading && <p>Loading...</p>}
 *       {results.map((result, i) => (
 *         <div key={i}>{result.title}</div>
 *       ))}
 *     </div>
 *   );
 * };
 * @public
 */
export const useSearch = (options: UseSearchOptions): UseSearchReturn => {
  const { api } = useSitecore();

  const {
    initialQuery,
    searchIndexId,
    pageSize = 10,
    debounceDelay = 300,
    searchParams,
    onSearchComplete,
  } = options;

  if (!searchIndexId) {
    throw new Error('useSearch: searchIndexId is required');
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState<Record<string, PrimitiveType>[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  // Use refs to avoid recreating SearchService on every render
  const searchServiceRef = useRef<SearchService | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchIndexRef = useRef(searchIndexId);
  const pageSizeRef = useRef(pageSize);
  const searchParamsRef = useRef(searchParams);
  const onSearchCompleteRef = useRef(onSearchComplete);

  useEffect(() => {
    searchServiceRef.current = new SearchService({
      contextId: api.edge.clientContextId,
      edgeUrl: api.edge.edgeUrl,
    });

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [api.edge.clientContextId, api.edge.edgeUrl]);

  useEffect(() => {
    searchIndexRef.current = searchIndexId;
    pageSizeRef.current = pageSize;
    searchParamsRef.current = searchParams;
    onSearchCompleteRef.current = onSearchComplete;
  }, [searchIndexId, pageSize, searchParams, onSearchComplete]);

  const search = useCallback(async (query: string, page: number = 1) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const offset = page === 1 ? 0 : pageSizeRef.current * (page - 1);

      const searchParams: SearchParameters = {
        searchIndexId: searchIndexRef.current,
        keyphrase: query,
        limit: pageSizeRef.current,
        offset,
        ...searchParamsRef.current, // Merge in facets, filters, sort, etc.
      };

      const { content, total } = await searchServiceRef.current.search(searchParams);

      // Check if request was aborted
      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      setResults(content);
      setTotalResults(total);
      setTotalPages(Math.ceil(total / pageSizeRef.current));
      onSearchCompleteRef.current?.({ totalResults: total, keyword: query });
    } catch (err) {
      // Don't set error if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const errorMessage = err instanceof Error ? err : new Error('Search failed');
      setError(errorMessage);
      setResults([]);
      setTotalResults(0);
      setTotalPages(0);
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (initialQuery !== undefined) {
      search(initialQuery, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedSearch = useDebouncedCallback(search, debounceDelay);

  const handleSearchChange = useCallback(
    (searchTerm: string) => {
      setCurrentPage(1);
      debouncedSearch(searchTerm, 1);
    },
    [debouncedSearch]
  );

  const handlePageChange = useCallback(
    (searchTerm: string, page: number) => {
      // Prevent rapid clicks
      if (loading) return;

      setCurrentPage(page);
      search(searchTerm, page);
    },
    [search, loading]
  );

  const reset = useCallback(() => {
    setCurrentPage(1);
    setResults([]);
    setTotalResults(0);
    setTotalPages(0);
    setError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const isEmpty = useMemo(() => results.length === 0, [results]);

  return useMemo(
    () => ({
      currentPage,
      results,
      isEmpty,
      loading,
      totalResults,
      totalPages,
      error,
      handleSearchChange,
      handlePageChange,
      search,
      reset,
    }),
    [
      currentPage,
      results,
      isEmpty,
      loading,
      totalResults,
      totalPages,
      error,
      handleSearchChange,
      handlePageChange,
      search,
      reset,
    ]
  );
};
