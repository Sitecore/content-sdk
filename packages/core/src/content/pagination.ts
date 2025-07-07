import { debug } from '../debug';

/**
 * Options for configuring pagination behavior.
 */
export interface PaginationOptions {
  /** The number of items to fetch per page. If not provided, uses the API's default. */
  pageSize?: number;
  /** Maximum number of pages to fetch. If not provided, fetches all available pages. */
  maxPages?: number;
}

/**
 * Standard pagination response structure that many endpoints return.
 */
export interface PaginatedResponse<T> {
  /** The list of items in the current page. */
  results: T[];
  /** The cursor for fetching the next page, if available. */
  cursor?: string;
  /** Indicates whether more items are available after the current page. */
  hasMore: boolean;
}

/**
 * Arguments that can be passed to a paginated fetch function.
 */
export interface PaginationArgs {
  /** The cursor for fetching the next page. */
  after?: string;
  /** The number of items to fetch per page. */
  pageSize?: number;
}

/**
 * Generic pagination utility that handles cursor-based pagination for any endpoint
 * that follows the standard pagination pattern (results, cursor, hasMore).
 * 
 * This function abstracts away the pagination loop and returns all results
 * from all available pages.
 * 
 * @param fetchPage - A function that fetches a single page of results.
 *                    Must return a PaginatedResponse with results, cursor, and hasMore.
 * @param options - Optional configuration for pagination behavior.
 * @returns A promise that resolves to an array of all results from all pages.
 * 
 * @example
 * ```typescript
 * // Fetch all taxonomies
 * const allTaxonomies = await paginateAll(
 *   (args) => contentClient.getTaxonomies(args),
 *   { pageSize: 50 }
 * );
 * 
 * // Fetch all items from a dynamic endpoint
 * const allStoreItems = await paginateAll(
 *   (args) => contentClient.getManyStoreItem(args),
 *   { pageSize: 100, maxPages: 10 }
 * );
 * ```
 */
export async function paginateAll<T, Args extends PaginationArgs = PaginationArgs>(
  fetchPage: (args: Args) => Promise<PaginatedResponse<T>>,
  options: PaginationOptions = {}
): Promise<T[]> {
  const { pageSize, maxPages } = options;
  const allResults: T[] = [];
  let currentCursor: string | undefined;
  let pageCount = 0;
  let hasMore = true;

  debug.content('Starting pagination with options: %o', { pageSize, maxPages });

  while (hasMore) {
    // Check if we've reached the maximum number of pages
    if (maxPages && pageCount >= maxPages) {
      debug.content('Reached maximum pages limit: %d', maxPages);
      break;
    }

    pageCount++;
    debug.content('Fetching page %d (cursor: %s)', pageCount, currentCursor || 'none');

    try {
      // Prepare arguments for the fetch function
      const args = {
        after: currentCursor,
        pageSize,
      } as Args;

      // Fetch the current page
      const response = await fetchPage(args);

      // Validate the response structure
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response: expected an object with results, cursor, and hasMore');
      }

      if (!Array.isArray(response.results)) {
        throw new Error('Invalid response: expected results to be an array');
      }

      if (typeof response.hasMore !== 'boolean') {
        throw new Error('Invalid response: expected hasMore to be a boolean');
      }

      // Add results from this page to our collection
      allResults.push(...response.results);

      debug.content(
        'Page %d: received %d items, hasMore: %s, cursor: %s',
        pageCount,
        response.results.length,
        response.hasMore,
        response.cursor || 'none'
      );

      // Update pagination state for the next iteration
      hasMore = response.hasMore;
      currentCursor = response.cursor;

      // If we received fewer items than requested, we've reached the end
      if (pageSize && response.results.length < pageSize) {
        debug.content('Received fewer items than pageSize, assuming end of data');
        hasMore = false;
      }

    } catch (error) {
      debug.content('Error fetching page %d: %s', pageCount, error);
      throw new Error(`Failed to fetch page ${pageCount}: ${error}`);
    }
  }

  debug.content('Pagination complete: fetched %d pages, total items: %d', pageCount, allResults.length);
  return allResults;
}

/**
 * Type guard to check if a response follows the standard pagination pattern.
 * 
 * @param response - The response to check.
 * @returns True if the response has the expected pagination structure.
 */
export function isPaginatedResponse<T>(response: unknown): response is PaginatedResponse<T> {
  return (
    response !== null &&
    typeof response === 'object' &&
    'results' in response &&
    'hasMore' in response &&
    Array.isArray((response as any).results) &&
    typeof (response as any).hasMore === 'boolean'
  );
} 