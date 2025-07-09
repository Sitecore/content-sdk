/**
 * Dynamic Pagination Utilities for Content SDK
 * 
 * This module provides flexible pagination capabilities for any GraphQL query,
 * including support for nested properties that need pagination.
 */

import debug from '../debug';
import { ContentClient } from './content-client';

/**
 * Configuration for dynamic pagination
 */
export interface DynamicPaginationConfig {
  /** The GraphQL query string */
  query: string;
  /** Query variables */
  variables?: Record<string, any>;
  /** Path to the paginated field in the response (e.g., 'data.manyProduct') */
  paginatedFieldPath: string;
  /** Options for pagination behavior */
  pagination?: {
    pageSize?: number;
    maxPages?: number;
  };
  /** Configuration for nested pagination */
  nested?: {
    /** Path to nested paginated field (e.g., 'products') */
    fieldPath: string;
    /** Function to extract parent ID for nested queries */
    getParentId: (parent: any) => string;
    /** Nested query template */
    nestedQuery: string;
    /** Nested query variables template */
    nestedVariables?: (parentId: string, args: any) => Record<string, any>;
    /** Nested pagination options */
    pagination?: {
      pageSize?: number;
      maxPages?: number;
    };
  };
}

/**
 * Result of dynamic pagination
 */
export interface DynamicPaginationResult<T = any> {
  /** All items from all pages */
  items: T[];
  /** Total number of pages fetched */
  totalPages: number;
  /** Total number of items fetched */
  totalItems: number;
  /** Whether all available pages were fetched */
  hasMore: boolean;
  /** Metadata about the pagination process */
  metadata: {
    /** Time taken for pagination */
    duration: number;
    /** Number of API calls made */
    apiCalls: number;
    /** Any errors that occurred during pagination */
    errors: string[];
  };
}

/**
 * Dynamic pagination utility that can handle any GraphQL query with pagination
 * 
 * @param client - The ContentClient instance
 * @param config - Configuration for the dynamic pagination
 * @returns Promise that resolves to paginated results
 * 
 * @example
 * ```typescript
 * // Simple pagination for any query
 * const result = await executeDynamicPagination(client, {
 *   query: `
 *     query GetProducts($pageSize: Int, $after: String) {
 *       manyProduct(minimumPageSize: $pageSize, after: $after) {
 *         results { id name price }
 *         cursor hasMore
 *       }
 *     }
 *   `,
 *   paginatedFieldPath: 'manyProduct',
 *   pagination: { pageSize: 50 }
 * });
 * 
 * // Nested pagination
 * const result = await executeDynamicPagination(client, {
 *   query: `
 *     query GetCategories($pageSize: Int, $after: String) {
 *       manyCategory(minimumPageSize: $pageSize, after: $after) {
 *         results { id name }
 *         cursor hasMore
 *       }
 *     }
 *   `,
 *   paginatedFieldPath: 'manyCategory',
 *   nested: {
 *     fieldPath: 'products',
 *     getParentId: (category) => category.id,
 *     nestedQuery: `
 *       query GetProductsInCategory($categoryId: ID!, $pageSize: Int, $after: String) {
 *         manyProduct(categoryId: $categoryId, minimumPageSize: $pageSize, after: $after) {
 *           results { id name price }
 *           cursor hasMore
 *         }
 *       }
 *     `,
 *     nestedVariables: (categoryId, args) => ({
 *       categoryId,
 *       pageSize: args.pageSize,
 *       after: args.after
 *     })
 *   }
 * });
 * ```
 */
export async function executeDynamicPagination<T = any>(
  client: ContentClient,
  config: DynamicPaginationConfig
): Promise<DynamicPaginationResult<T>> {
  const startTime = Date.now();
  let apiCalls = 0;
  const errors: string[] = [];

  debug.content('Starting dynamic pagination with config: %o', config);

  try {
    // Execute the main pagination
    const mainResult = await executePaginationForField(
      client,
      config.query,
      config.variables || {},
      config.paginatedFieldPath,
      config.pagination,
      () => { apiCalls++; }
    );

    // Handle nested pagination if configured
    if (config.nested) {
      const nestedResult = await executeNestedPagination(
        client,
        mainResult.items,
        config.nested,
        () => { apiCalls++; },
        errors
      );

      return {
        items: nestedResult,
        totalPages: mainResult.totalPages,
        totalItems: nestedResult.length,
        hasMore: mainResult.hasMore,
        metadata: {
          duration: Date.now() - startTime,
          apiCalls,
          errors
        }
      };
    }

    return {
      items: mainResult.items,
      totalPages: mainResult.totalPages,
      totalItems: mainResult.items.length,
      hasMore: mainResult.hasMore,
      metadata: {
        duration: Date.now() - startTime,
        apiCalls,
        errors
      }
    };

  } catch (error) {
    errors.push(`Pagination failed: ${error}`);
    throw new Error(`Dynamic pagination failed: ${error}`);
  }
}

/**
 * Execute pagination for a specific field in a GraphQL response
 */
async function executePaginationForField<T = any>(
  client: ContentClient,
  query: string,
  variables: Record<string, any>,
  fieldPath: string,
  pagination?: { pageSize?: number; maxPages?: number },
  onApiCall?: () => void
): Promise<{ items: T[]; totalPages: number; hasMore: boolean }> {
  const allItems: T[] = [];
  let currentCursor: string | undefined;
  let pageCount = 0;
  let hasMore = true;

  while (hasMore) {
    if (pagination?.maxPages && pageCount >= pagination.maxPages) {
      debug.content('Reached maximum pages limit: %d', pagination.maxPages);
      break;
    }

    pageCount++;
    debug.content('Fetching page %d for field %s', pageCount, fieldPath);

    try {
      const pageVariables = {
        ...variables,
        pageSize: pagination?.pageSize,
        after: currentCursor,
      };

      onApiCall?.();
      const response = await client.get(query, pageVariables);

      // Navigate to the paginated field using the path
      const fieldData = getNestedValue(response, fieldPath);
      
      if (!fieldData || typeof fieldData !== 'object') {
        throw new Error(`Invalid response structure for field path: ${fieldPath}`);
      }

      if (!Array.isArray(fieldData.results)) {
        throw new Error(`Expected results array at field path: ${fieldPath}`);
      }

      if (typeof fieldData.hasMore !== 'boolean') {
        throw new Error(`Expected hasMore boolean at field path: ${fieldPath}`);
      }

      allItems.push(...fieldData.results);
      hasMore = fieldData.hasMore;
      currentCursor = fieldData.cursor;

      debug.content(
        'Page %d: received %d items, hasMore: %s',
        pageCount,
        fieldData.results.length,
        hasMore
      );

    } catch (error) {
      debug.content('Error fetching page %d: %s', pageCount, error);
      throw error;
    }
  }

  return {
    items: allItems,
    totalPages: pageCount,
    hasMore
  };
}

/**
 * Execute nested pagination for parent items
 */
async function executeNestedPagination<T = any>(
  client: ContentClient,
  parentItems: T[],
  nestedConfig: DynamicPaginationConfig['nested'],
  onApiCall?: () => void,
  errors: string[] = []
): Promise<(T & { [key: string]: any[] })[]> {
  if (!nestedConfig) {
    return parentItems as (T & { [key: string]: any[] })[];
  }

  const results: (T & { [key: string]: any[] })[] = [];

  for (let i = 0; i < parentItems.length; i++) {
    const parent = parentItems[i];
    
    try {
      debug.content('Fetching nested items for parent %d/%d', i + 1, parentItems.length);
      
      const parentId = nestedConfig.getParentId(parent);
      const nestedVariables = nestedConfig.nestedVariables 
        ? nestedConfig.nestedVariables(parentId, { pageSize: nestedConfig.pagination?.pageSize })
        : { parentId };

      const nestedResult = await executePaginationForField(
        client,
        nestedConfig.nestedQuery,
        nestedVariables,
        'results', // Assuming nested query returns results directly
        nestedConfig.pagination,
        onApiCall
      );

      results.push({
        ...parent,
        [nestedConfig.fieldPath]: nestedResult.items
      });

    } catch (error) {
      debug.content('Error fetching nested items for parent %d: %s', i + 1, error);
      errors.push(`Nested pagination failed for parent ${i + 1}: ${error}`);
      
      // Continue with other parents even if one fails
      results.push({
        ...parent,
        [nestedConfig.fieldPath]: []
      });
    }
  }

  return results;
}

/**
 * Utility function to get nested object values by path
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

/**
 * Simplified dynamic pagination for common use cases
 * 
 * @param client - The ContentClient instance
 * @param query - The GraphQL query string
 * @param fieldPath - Path to the paginated field
 * @param options - Pagination options
 * @returns Promise that resolves to all items
 * 
 * @example
 * ```typescript
 * // Simple usage
 * const products = await simpleDynamicPagination(
 *   client,
 *   `query GetProducts($pageSize: Int, $after: String) {
 *     manyProduct(minimumPageSize: $pageSize, after: $after) {
 *       results { id name }
 *       cursor hasMore
 *     }
 *   }`,
 *   'manyProduct',
 *   { pageSize: 50 }
 * );
 * ```
 */
export async function simpleDynamicPagination<T = any>(
  client: ContentClient,
  query: string,
  fieldPath: string,
  options: { pageSize?: number; maxPages?: number } = {}
): Promise<T[]> {
  const result = await executeDynamicPagination(client, {
    query,
    paginatedFieldPath: fieldPath,
    pagination: options
  });

  return result.items;
}

/**
 * Dynamic pagination with automatic field detection
 * 
 * This function attempts to automatically detect paginated fields in the response
 * and paginate through them. Useful for exploratory queries.
 * 
 * @param client - The ContentClient instance
 * @param query - The GraphQL query string
 * @param variables - Query variables
 * @param options - Pagination options
 * @returns Promise that resolves to paginated results
 */
export async function autoDetectPagination<T = any>(
  client: ContentClient,
  query: string,
  variables: Record<string, any> = {},
  options: { pageSize?: number; maxPages?: number } = {}
): Promise<DynamicPaginationResult<T>> {
  debug.content('Attempting to auto-detect pagination for query');

  // First, execute the query once to detect structure
  const response = await client.get(query, variables);
  
  // Look for fields that have pagination structure
  const paginatedFields = findPaginatedFields(response);
  
  if (paginatedFields.length === 0) {
    throw new Error('No paginated fields detected in the response');
  }

  if (paginatedFields.length > 1) {
    debug.content('Multiple paginated fields detected: %o', paginatedFields);
  }

  // Use the first detected field
  const fieldPath = paginatedFields[0];
  debug.content('Using detected field path: %s', fieldPath);

  return executeDynamicPagination(client, {
    query,
    variables,
    paginatedFieldPath: fieldPath,
    pagination: options
  });
}

/**
 * Find fields in a response that have pagination structure
 */
function findPaginatedFields(obj: any, path = ''): string[] {
  const fields: string[] = [];

  if (obj && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      // Check if this field has pagination structure
      if (value && typeof value === 'object' && 
          'results' in value && 'hasMore' in value && 'cursor' in value) {
        fields.push(currentPath);
      }
      
      // Recursively search nested objects
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        fields.push(...findPaginatedFields(value, currentPath));
      }
    }
  }

  return fields;
} 