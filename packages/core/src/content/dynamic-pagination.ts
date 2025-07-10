/**
 * Dynamic Pagination Utilities for Content SDK
 *
 * This module provides truly dynamic pagination capabilities that auto-detect
 * paginated fields in any GraphQL response and provide cursor-based control.
 */

import debug from '../debug';
import { ContentClient } from './content-client';

/**
 * Pagination result with cursor-based control
 */
export interface PaginationResult<T = any> {
  /** Items from the current page */
  items: T[];
  /** Cursor for the next page */
  cursor?: string;
  /** Whether more pages are available */
  hasMore: boolean;
}

/**
 * Multi-field pagination result for queries with multiple paginated fields
 */
export interface MultiFieldPaginationResult {
  /** All items from all paginated fields */
  items: any[];
  /** Cursors for each field */
  cursors: Record<string, string | undefined>;
  /** Whether any field has more pages */
  hasMore: boolean;
}

/**
 * Configuration for dynamic pagination
 */
export interface DynamicPaginationConfig {
  /** Query variables */
  variables?: Record<string, any>;
  /** Pagination options */
  pagination?: {
    pageSize?: number;
    after?: string;
  };
  /** Whether to auto-fetch all pages */
  fetchAll?: boolean;
  /** Maximum pages to fetch when using fetchAll */
  maxPages?: number;
  /** Whether to handle multiple paginated fields */
  multiField?: boolean;
}

/**
 * Truly dynamic pagination that auto-detects paginated fields
 *
 * @param client - The ContentClient instance
 * @param query - The GraphQL query string
 * @param config - Configuration for pagination
 * @returns Promise that resolves to pagination result with cursor control
 *
 * @example
 * ```typescript
 * // Single page with manual control
 * const result = await client.dynamicPagination(
 *   `query GetProducts($pageSize: Int, $after: String) {
 *     manyProduct(minimumPageSize: $pageSize, after: $after) {
 *       results { id name price }
 *       cursor hasMore
 *     }
 *   }`,
 *   { pageSize: 50 }
 * );
 *
 * // Manual next page
 * if (result.hasMore) {
 *   const nextPage = await client.dynamicPagination(
 *     query,
 *     { pageSize: 50, after: result.cursor }
 *   );
 * }
 *
 * // Auto-fetch all pages
 * const allProducts = await client.dynamicPagination(
 *   query,
 *   { pageSize: 50, fetchAll: true }
 * );
 *
 * // Multiple paginated fields
 * const multiResult = await client.dynamicPagination(
 *   `query GetData($pageSize: Int, $after: String) {
 *     manyProduct(minimumPageSize: $pageSize, after: $after) {
 *       results { id name }
 *       cursor hasMore
 *     }
 *     manyItem(minimumPageSize: $pageSize, after: $after) {
 *       results { id name }
 *       cursor hasMore
 *     }
 *   }`,
 *   { pageSize: 50, multiField: true }
 * );
 * ```
 */
export async function dynamicPagination<T = any>(
  client: ContentClient,
  query: string,
  config: DynamicPaginationConfig = {}
): Promise<PaginationResult<T> | MultiFieldPaginationResult> {
  const {
    variables = {},
    pagination = {},
    fetchAll = false,
    maxPages,
    multiField = false,
  } = config;

  debug.content('Starting dynamic pagination with config: %o', config);

  try {
    // Execute the query
    const pageVariables = {
      ...variables,
      pageSize: pagination.pageSize,
      after: pagination.after,
    };

    const response = await client.get(query, pageVariables);

    // Auto-detect paginated fields
    const paginatedFields = findPaginatedFields(response);

    if (paginatedFields.length === 0) {
      throw new Error('No paginated fields found in response');
    }

    // Handle multiple paginated fields
    if (multiField && paginatedFields.length > 1) {
      return handleMultiFieldPagination(client, query, response, paginatedFields, config);
    }

    // Single field pagination
    const fieldData = getFirstPaginatedField(response);

    if (!fieldData) {
      throw new Error('No valid paginated field data found in response');
    }

    const result: PaginationResult<T> = {
      items: fieldData.results || [],
      cursor: fieldData.cursor,
      hasMore: fieldData.hasMore || false,
    };

    // If fetchAll is requested, continue paginating
    if (fetchAll && result.hasMore) {
      const allItems = [...result.items];
      let currentCursor = result.cursor;
      let pageCount = 1;

      while (result.hasMore && (!maxPages || pageCount < maxPages)) {
        pageCount++;

        const nextPage = (await dynamicPagination(client, query, {
          ...config,
          pagination: { ...pagination, after: currentCursor },
          fetchAll: false, // Prevent infinite recursion
        })) as PaginationResult<T>;

        allItems.push(...nextPage.items);
        currentCursor = nextPage.cursor;
        result.hasMore = nextPage.hasMore;
      }

      result.items = allItems;
      result.cursor = currentCursor;
    }

    return result;
  } catch (error) {
    debug.content('Dynamic pagination failed: %s', error);
    throw new Error(`Dynamic pagination failed: ${error}`);
  }
}

/**
 * Handle pagination for multiple fields in the same query
 */
async function handleMultiFieldPagination(
  client: ContentClient,
  query: string,
  response: any,
  paginatedFields: string[],
  config: DynamicPaginationConfig
): Promise<MultiFieldPaginationResult> {
  const { pagination = {}, fetchAll = false, maxPages } = config;

  debug.content('Handling multi-field pagination for fields: %o', paginatedFields);

  const allItems: any[] = [];
  const cursors: Record<string, string | undefined> = {};
  let hasMore = false;

  // Process each paginated field
  for (const fieldPath of paginatedFields) {
    const fieldData = getValueByPath(response, fieldPath);
    const fieldName = fieldPath.split('.').pop() || fieldPath;

    if (!fieldData || typeof fieldData !== 'object') {
      debug.content('Invalid field data for %s, skipping', fieldPath);
      continue;
    }

    const items = Array.isArray(fieldData.results) ? fieldData.results : [];
    const cursor = fieldData.cursor;
    const fieldHasMore = Boolean(fieldData.hasMore);

    allItems.push(...items);
    cursors[fieldName] = cursor;
    hasMore = hasMore || fieldHasMore;
  }

  const result: MultiFieldPaginationResult = {
    items: allItems,
    cursors,
    hasMore,
  };

  // If fetchAll is requested, continue paginating all fields
  if (fetchAll && hasMore) {
    const allFieldItems: Record<string, any[]> = {};
    let pageCount = 1;

    // Initialize with current items
    for (const fieldPath of paginatedFields) {
      const fieldName = fieldPath.split('.').pop() || fieldPath;
      const fieldData = getValueByPath(response, fieldPath);
      allFieldItems[fieldName] = Array.isArray(fieldData?.results) ? [...fieldData.results] : [];
    }

    while (hasMore && (!maxPages || pageCount < maxPages)) {
      pageCount++;

      // Create a new query with updated cursors for each field
      const nextPageQuery = updateQueryWithCursors(query, cursors);

      const nextResponse = await client.get(nextPageQuery, {
        ...config.variables,
        pageSize: pagination.pageSize,
      });

      const nextPaginatedFields = findPaginatedFields(nextResponse);
      let nextHasMore = false;

      // Process each field's next page
      for (const fieldPath of nextPaginatedFields) {
        const fieldData = getValueByPath(nextResponse, fieldPath);
        const fieldName = fieldPath.split('.').pop() || fieldPath;

        if (fieldData && Array.isArray(fieldData.results)) {
          allFieldItems[fieldName].push(...fieldData.results);
          cursors[fieldName] = fieldData.cursor;
          nextHasMore = nextHasMore || Boolean(fieldData.hasMore);
        }
      }

      hasMore = nextHasMore;
    }

    // Update final result
    result.items = Object.values(allFieldItems).flat();
    result.cursors = cursors;
    result.hasMore = hasMore;
  }

  return result;
}

/**
 * Update GraphQL query with current cursors for each field
 */
function updateQueryWithCursors(
  query: string,
  cursors: Record<string, string | undefined>
): string {
  let updatedQuery = query;

  for (const [fieldName, cursor] of Object.entries(cursors)) {
    if (cursor) {
      // Replace the cursor variable for this specific field
      const fieldPattern = new RegExp(
        '(' + fieldName + '\\s*\\([^)]*after:\\s*\\$after[^)]*\\))',
        'g'
      );
      updatedQuery = updatedQuery.replace(fieldPattern, '$1');
    }
  }

  return updatedQuery;
}

/**
 * Get the first paginated field data from response
 */
function getFirstPaginatedField(response: any): any {
  const paginatedFields = findPaginatedFields(response);
  if (paginatedFields.length === 0) {
    return null;
  }
  return getValueByPath(response, paginatedFields[0]);
}

/**
 * Utility function to get object values by dot notation path
 */
function getValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

/**
 * Find all paginated fields in a GraphQL response
 */
function findPaginatedFields(obj: any, path = ''): string[] {
  const fields: string[] = [];

  if (!obj || typeof obj !== 'object') {
    return fields;
  }

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (value && typeof value === 'object') {
      // Check if this field has pagination structure
      if ('results' in value && 'hasMore' in value && 'cursor' in value) {
        fields.push(currentPath);
      } else {
        // Recursively search nested objects
        fields.push(...findPaginatedFields(value, currentPath));
      }
    }
  }

  return fields;
}
