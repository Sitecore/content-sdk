import { SearchService } from '@sitecore-content-sdk/search';
import { useEffect, useState } from 'react';
import { useSitecore } from '../enhancers/withSitecore';

/** Hook related utilities */

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_PAGE = 1;

/**
 * Hook to initialize and manage SearchService lifecycle.
 * @internal
 */
export function useSearchService(): SearchService | null {
  const { api } = useSitecore();
  const [searchService, setSearchService] = useState<SearchService | null>(null);

  useEffect(() => {
    if (!api.edge.clientContextId || !api.edge.edgeUrl) return;

    setSearchService(new SearchService({
      contextId: api.edge.clientContextId,
      edgeUrl: api.edge.edgeUrl,
    }));
  }, [api.edge.clientContextId, api.edge.edgeUrl]);

  return searchService;
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
