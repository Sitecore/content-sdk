import { SearchService } from '@sitecore-content-sdk/search';
import { useEffect, useRef } from 'react';
import { useSitecore } from '../enhancers/withSitecore';

/** Hook related utilities */

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_PAGE = 1;

/**
 * Hook to initialize and manage SearchService lifecycle.
 * @internal
 */
export function useSearchService() {
  const { api } = useSitecore();
  const searchServiceRef = useRef<SearchService | null>(null);

  useEffect(() => {
    searchServiceRef.current = new SearchService({
      contextId: api.edge.clientContextId,
      edgeUrl: api.edge.edgeUrl,
    });
  }, [api.edge.clientContextId, api.edge.edgeUrl]);

  return {
    searchService: searchServiceRef.current,
  };
}

/**
 * Hook to create and manage an AbortController.
 * @internal
 */
export function useAbortController() {
  const abortControllerRef = useRef<AbortController | null>(null);
  const isAbortedRef = useRef(false);

  useEffect(() => {
    abortControllerRef.current = new AbortController();

    return () => {
      abortControllerRef.current?.abort();
      isAbortedRef.current = true;
    };
  }, []);

  return {
    abortController: abortControllerRef,
    isAborted: isAbortedRef,
  };
}

/**
 * Calculates the number of items to skip before returning results.
 * @param {number} page - The current page number (1-indexed).
 * @param {number} pageSize - The number of results per page.
 * @returns The number of items to skip before returning results.
 */
export const getOffset = (page: number, pageSize: number) => {
  return page === 1 ? 0 : pageSize * (page - 1);
};
