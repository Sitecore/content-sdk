import debug from '../debug';

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
 * Options for nested pagination scenarios.
 */
export interface NestedPaginationOptions extends PaginationOptions {
  /** Options for paginating nested items (e.g., terms within taxonomies). */
  nested?: {
    /** The number of nested items to fetch per page. */
    pageSize?: number;
    /** Maximum number of nested pages to fetch. */
    maxPages?: number;
  };
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

  debug.content(
    'Pagination complete: fetched %d pages, total items: %d',
    pageCount,
    allResults.length
  );
  return allResults;
}

/**
 * Enhanced pagination utility for scenarios with nested pagination.
 * This handles cases where you need to paginate through a collection AND
 * paginate through nested items within each collection item.
 *
 * @param fetchParentPage - Function to fetch a page of parent items.
 * @param fetchNestedItems - Function to fetch nested items for a parent item.
 * @param options - Configuration for both parent and nested pagination.
 * @returns A promise that resolves to an array of parent items with all their nested items.
 *
 * @example
 * ```typescript
 * // Fetch all taxonomies with all their terms
 * const allTaxonomiesWithTerms = await paginateAllWithNested(
 *   // Fetch taxonomies
 *   (args) => contentClient.getTaxonomies(args),
 *   // Fetch terms for each taxonomy
 *   (taxonomy) => contentClient.getTaxonomyWithAllTerms({ id: taxonomy.system.id }),
 *   {
 *     pageSize: 10, // 10 taxonomies per page
 *     nested: { pageSize: 50 } // 50 terms per page
 *   }
 * );
 * ```
 */
export async function paginateAllWithNested<
  Parent,
  Nested,
  ParentArgs extends PaginationArgs = PaginationArgs
>(
  fetchParentPage: (args: ParentArgs) => Promise<PaginatedResponse<Parent>>,
  fetchNestedItems: (parent: Parent) => Promise<Nested[]>,
  options: NestedPaginationOptions = {}
): Promise<(Parent & { nestedItems: Nested[] })[]> {
  debug.content('Starting nested pagination with options: %o', options);

  // First, fetch all parent items
  const allParents = await paginateAll(fetchParentPage, options);
  debug.content('Fetched %d parent items, now fetching nested items', allParents.length);

  // Then, for each parent, fetch all its nested items
  const results: (Parent & { nestedItems: Nested[] })[] = [];

  for (let i = 0; i < allParents.length; i++) {
    const parent = allParents[i];
    debug.content('Fetching nested items for parent %d/%d', i + 1, allParents.length);

    try {
      const nestedItems = await fetchNestedItems(parent);
      results.push({
        ...parent,
        nestedItems,
      });
    } catch (error) {
      debug.content('Error fetching nested items for parent %d: %s', i + 1, error);
      // Continue with other parents even if one fails
      results.push({
        ...parent,
        nestedItems: [],
      });
    }
  }

  debug.content('Nested pagination complete: processed %d parents', results.length);
  return results;
}

/**
 * Utility for scenarios where you want to paginate through a collection
 * but only fetch nested items for specific parent items (e.g., based on a filter).
 *
 * @param fetchParentPage - Function to fetch a page of parent items.
 * @param shouldFetchNested - Predicate to determine if nested items should be fetched for a parent.
 * @param fetchNestedItems - Function to fetch nested items for a parent item.
 * @param options - Configuration for pagination.
 * @returns A promise that resolves to an array of parent items with nested items (if applicable).
 *
 * @example
 * ```typescript
 * // Fetch all taxonomies, but only get terms for taxonomies with more than 10 terms
 * const taxonomiesWithTerms = await paginateAllWithConditionalNested(
 *   (args) => contentClient.getTaxonomies(args),
 *   (taxonomy) => taxonomy.terms.results.length > 10, // Only fetch terms for large taxonomies
 *   (taxonomy) => contentClient.getTaxonomyWithAllTerms({ id: taxonomy.system.id }),
 *   { pageSize: 20 }
 * );
 * ```
 */
export async function paginateAllWithConditionalNested<
  Parent,
  Nested,
  ParentArgs extends PaginationArgs = PaginationArgs
>(
  fetchParentPage: (args: ParentArgs) => Promise<PaginatedResponse<Parent>>,
  shouldFetchNested: (parent: Parent) => boolean,
  fetchNestedItems: (parent: Parent) => Promise<Nested[]>,
  options: PaginationOptions = {}
): Promise<(Parent & { nestedItems?: Nested[] })[]> {
  debug.content('Starting conditional nested pagination with options: %o', options);

  const allParents = await paginateAll(fetchParentPage, options);
  const results: (Parent & { nestedItems?: Nested[] })[] = [];

  for (let i = 0; i < allParents.length; i++) {
    const parent = allParents[i];

    if (shouldFetchNested(parent)) {
      debug.content(
        'Fetching nested items for parent %d/%d (condition met)',
        i + 1,
        allParents.length
      );
      try {
        const nestedItems = await fetchNestedItems(parent);
        results.push({
          ...parent,
          nestedItems,
        });
      } catch (error) {
        debug.content('Error fetching nested items for parent %d: %s', i + 1, error);
        results.push({
          ...parent,
          nestedItems: [],
        });
      }
    } else {
      debug.content(
        'Skipping nested items for parent %d/%d (condition not met)',
        i + 1,
        allParents.length
      );
      results.push({
        ...parent,
        nestedItems: undefined,
      });
    }
  }

  debug.content('Conditional nested pagination complete: processed %d parents', results.length);
  return results;
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
