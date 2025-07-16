/**
 * Dynamic Pagination Utility for many GraphQL Calls
 *
 * This utility provides a simple, stateless way to handle pagination for dynamic many calls
 * (e.g., manyProduct, manyItem) in the Content SDK. It exposes pagination metadata (cursor, hasMore)
 * and allows developers to manage pagination externally without maintaining internal state.
 *
 * Design Constraints:
 * - Avoids deep pagination (nested fields)
 * - Accepts GraphQL query string (cannot introspect or modify it)
 * - Enforces cursor presence via variable typing
 * - Restricts return types to include pagination-specific fields
 * - No "fetch all" mode - only page-by-page access
 * - No page number-based navigation (cursor-based only)
 */

import { ContentClient } from './content-client';

export interface DynamicPaginationVariables {
  pageSize: number;
  after?: string;
}

export interface DynamicPaginationResult<T = any> {
  items: T[];
  cursor?: string | null;
  hasMore?: boolean | null;
}

export async function dynamicPagination<T = any>(
  client: ContentClient,
  query: string,
  variables: DynamicPaginationVariables
): Promise<DynamicPaginationResult<T>> {
  try {
    const response = await client.get(query, (variables as unknown) as Record<string, unknown>);
    const paginatedField = findPaginatedField(response);
    if (!paginatedField) {
      throw new Error(
        'No paginated field found in response. Ensure your query includes a field with results, cursor, and hasMore.'
      );
    }
    const { results, cursor, hasMore } = paginatedField;
    return {
      items: Array.isArray(results) ? results : [],
      cursor: cursor,
      hasMore: hasMore,
    };
  } catch (error) {
    throw new Error(
      `Dynamic pagination failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

function findPaginatedField(
  response: any
): { results: any[]; cursor?: string | null; hasMore?: boolean | null } | null {
  if (!response || typeof response !== 'object') {
    return null;
  }
  for (const [key, value] of Object.entries(response)) {
    if (value && typeof value === 'object' && 'results' in value) {
      const field = value as any;
      if (Array.isArray(field.results)) {
        return {
          results: field.results,
          cursor: 'cursor' in field ? field.cursor : undefined,
          hasMore: 'hasMore' in field ? field.hasMore : undefined,
        };
      } else if (field.results !== undefined) {
        return {
          results: [],
          cursor: 'cursor' in field ? field.cursor : undefined,
          hasMore: 'hasMore' in field ? field.hasMore : undefined,
        };
      }
    }
  }
  return null;
}
