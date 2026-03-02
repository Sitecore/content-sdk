import { SearchService } from '@sitecore-content-sdk/search';
import { useMemo } from 'react';
import { useSitecore } from '../components/SitecoreProvider';

export const DEFAULT_PAGE_SIZE = 10;

/**
 * The status of a search request.
 * @public
 */
export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Hook to initialize and manage SearchService.
 */
export function useSearchService() {
  const { api } = useSitecore();

  return useMemo(() => {
    if (!api?.edge?.clientContextId) {
      return null;
    }

    return new SearchService({
      contextId: api.edge.clientContextId,
      edgeUrl: api.edge.edgeUrl,
    });
  }, [api?.edge?.clientContextId, api?.edge?.edgeUrl]);
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
