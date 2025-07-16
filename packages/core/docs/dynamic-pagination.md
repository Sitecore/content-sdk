# Stateless Pagination Utility for Dynamic many GraphQL Calls

## Overview

The Stateless Pagination Utility provides a simple, type-safe way to handle pagination for dynamic many GraphQL calls (e.g., `manyProduct`, `manyItem`) in the Content SDK. It exposes pagination metadata (cursor, hasMore) and allows developers to manage pagination externally without maintaining internal state.

## Design Constraints & Decisions

### 1. Avoid Deep Pagination
- **Do not support** paginating nested fields (e.g., `authors → books`) in a single query
- **Reason:** Inner cursors behave inconsistently and are inefficient
- **Recommended approach:** Developers should paginate the outer entity, then query nested data separately
- **Decision:** Do not explicitly block or document this yet, but avoid supporting it in the utility

### 2. Helper Design
- Accepts a GraphQL query string (cannot introspect or modify it)
- Enforces cursor presence via variable typing
- Restricts return types to include pagination-specific fields (cursor, hasMore, items)

### 3. Cursor and hasMore Handling
- The utility cannot determine what fields are requested in the query
- **Documentation requirement:** Developers must include `cursor` and `hasMore` in their query
- In the return type, `cursor` and `hasMore` are marked as nullable to account for cases where they are missing

### 4. Pagination Mode
- **Do not support** a "fetch all" mode
- **Reason:** It contradicts the GraphQL schema design of Content Services and may cause performance issues
- **Only support:** Page-by-page access

### 5. Page Numbering
- Cursor-based pagination does not support requesting a specific page number
- **Do not implement** page number-based navigation

## Quick Start

### 1. Import the Utility

```typescript
import { statelessPagination, PaginationVariables, StatelessPaginationResult } from '@sitecore-content-sdk/core';
```

### 2. Basic Usage with manyProduct

```typescript
const result = await statelessPagination(
  client,
  `query GetProducts($pageSize: Int, $after: String) {
    manyProduct(minimumPageSize: $pageSize, after: $after) {
      results { id name price }
      cursor hasMore
    }
  }`,
  { pageSize: 50 }
);

console.log(result.items); // Array of products
console.log(result.cursor); // Cursor for next page
console.log(result.hasMore); // true if more pages available
```

### 3. Fetch Next Page

```typescript
if (result.hasMore && result.cursor) {
  const nextPage = await statelessPagination(
    client,
    query,
    { pageSize: 50, after: result.cursor }
  );
}
```

### 4. Usage with manyItem

```typescript
const itemsResult = await statelessPagination(
  client,
  `query GetItems($pageSize: Int, $after: String) {
    manyItem(minimumPageSize: $pageSize, after: $after) {
      results { id name }
      cursor hasMore
    }
  }`,
  { pageSize: 25 }
);
```

## API Reference

### `statelessPagination<T>`

```typescript
function statelessPagination<T = any>(
  client: ContentClient,
  query: string,
  variables: PaginationVariables
): Promise<StatelessPaginationResult<T>>
```

#### Parameters

- `client`: The ContentClient instance
- `query`: The GraphQL query string (must include `cursor` and `hasMore` fields)
- `variables`: Query variables including pagination parameters

#### Return Value

```typescript
interface StatelessPaginationResult<T> {
  items: T[];                    // Items from the current page
  cursor?: string | null;        // Cursor for the next page (nullable)
  hasMore?: boolean | null;      // Whether more pages are available (nullable)
}
```

### `PaginationVariables`

```typescript
interface PaginationVariables {
  pageSize: number;    // Page size for the query
  after?: string;      // Cursor for pagination (optional for first page)
}
```

## Important Requirements

### GraphQL Query Requirements

1. **Must include `cursor` and `hasMore` fields** in the response
2. **Must use `$pageSize` and `$after` variables** for pagination
3. **Must have a paginated field** with the structure: `{ results: T[], cursor?: string, hasMore?: boolean }`

### Example Query Structure

```graphql
query GetData($pageSize: Int, $after: String) {
  manyProduct(minimumPageSize: $pageSize, after: $after) {
    results {
      id
      name
      price
    }
    cursor
    hasMore
  }
}
```

## Usage Examples

### Example 1: Basic Product Pagination

```typescript
import { ContentClient } from '@sitecore-content-sdk/core';
import { statelessPagination } from '@sitecore-content-sdk/core';

const client = ContentClient.createClient({
  tenant: 'your-tenant',
  environment: 'main',
  token: 'your-token',
});

const productQuery = `
  query GetProducts($pageSize: Int, $after: String) {
    manyProduct(minimumPageSize: $pageSize, after: $after) {
      results {
        id
        name
        price
        description
      }
      cursor
      hasMore
    }
  }
`;

// Fetch first page
const firstPage = await statelessPagination(client, productQuery, { pageSize: 20 });

console.log(`Found ${firstPage.items.length} products`);
console.log(`Has more: ${firstPage.hasMore}`);

// Fetch next page if available
if (firstPage.hasMore && firstPage.cursor) {
  const secondPage = await statelessPagination(client, productQuery, {
    pageSize: 20,
    after: firstPage.cursor,
  });
  
  console.log(`Found ${secondPage.items.length} more products`);
}
```

### Example 2: Item Pagination with Type Safety

```typescript
interface ContentItem {
  id: string;
  name: string;
  path: string;
  template: {
    id: string;
    name: string;
  };
}

const itemQuery = `
  query GetItems($pageSize: Int, $after: String) {
    manyItem(minimumPageSize: $pageSize, after: $after) {
      results {
        id
        name
        path
        template {
          id
          name
        }
      }
      cursor
      hasMore
    }
  }
`;

const itemsResult = await statelessPagination<ContentItem>(client, itemQuery, {
  pageSize: 50,
});

// TypeScript will provide full type safety
itemsResult.items.forEach(item => {
  console.log(`${item.name} (${item.template.name})`);
});
```

### Example 3: Taxonomy Pagination

```typescript
const taxonomyQuery = `
  query GetTaxonomies($pageSize: Int, $after: String) {
    getTaxonomies(minimumPageSize: $pageSize, after: $after) {
      results {
        id
        name
        terms {
          id
          name
        }
      }
      cursor
      hasMore
    }
  }
`;

const taxonomiesResult = await statelessPagination(client, taxonomyQuery, {
  pageSize: 10,
});
```

### Example 4: Manual Pagination Loop

```typescript
async function fetchAllProducts(client: ContentClient): Promise<any[]> {
  const query = `
    query GetProducts($pageSize: Int, $after: String) {
      manyProduct(minimumPageSize: $pageSize, after: $after) {
        results { id name price }
        cursor
        hasMore
      }
    }
  `;

  let allProducts: any[] = [];
  let cursor: string | undefined = undefined;
  let hasMore = true;

  while (hasMore) {
    const result = await statelessPagination(client, query, {
      pageSize: 50,
      after: cursor,
    });

    allProducts = allProducts.concat(result.items);
    cursor = result.cursor || undefined;
    hasMore = result.hasMore || false;
  }

  return allProducts;
}
```

## Error Handling

### Common Errors

1. **No paginated field found**
   ```typescript
   // Error: No paginated field found in response. Ensure your query includes a field with results, cursor, and hasMore.
   ```
   **Solution:** Make sure your GraphQL query includes a field with `results`, `cursor`, and `hasMore`.

2. **Missing cursor/hasMore fields**
   ```typescript
   // The utility will return undefined for cursor and hasMore
   const result = await statelessPagination(client, query, { pageSize: 50 });
   console.log(result.cursor); // undefined
   console.log(result.hasMore); // undefined
   ```
   **Solution:** Include `cursor` and `hasMore` fields in your GraphQL query.

3. **Network errors**
   ```typescript
   // Error: Stateless pagination failed: Network error
   ```
   **Solution:** Check your network connection and ContentClient configuration.

## Best Practices

1. **Always check for cursor and hasMore before paginating**
   ```typescript
   if (result.hasMore && result.cursor) {
     // Fetch next page
   }
   ```

2. **Use appropriate page sizes**
   - Small pages (10-25): For real-time UI updates
   - Medium pages (50-100): For most use cases
   - Large pages (200+): Only for bulk operations

3. **Handle empty results gracefully**
   ```typescript
   if (result.items.length === 0) {
     console.log('No items found');
     return;
   }
   ```

4. **Use TypeScript generics for type safety**
   ```typescript
   const result = await statelessPagination<YourType>(client, query, variables);
   ```

5. **Don't implement "fetch all" patterns**
   - The utility is designed for page-by-page access
   - Implement manual loops only when necessary
   - Consider performance implications for large datasets

## Comparison with Dynamic Pagination

| Feature | Stateless Pagination | Dynamic Pagination |
|---------|---------------------|-------------------|
| **Complexity** | Simple, minimal | Complex, feature-rich |
| **State Management** | Stateless | Stateless |
| **"Fetch All" Mode** | ❌ Not supported | ✅ Supported |
| **Multi-field Support** | ❌ Single field only | ✅ Multiple fields |
| **Auto-detection** | ❌ Manual field specification | ✅ Auto-detects fields |
| **Configuration** | Simple variables | Complex config object |
| **Use Case** | Simple pagination needs | Advanced pagination scenarios |

## Migration from Dynamic Pagination

If you're currently using `dynamicPagination` and want to switch to `statelessPagination`:

```typescript
// Before (Dynamic Pagination)
const result = await client.dynamicPagination(query, {
  pagination: { pageSize: 50 },
  fetchAll: false,
});

// After (Stateless Pagination)
const result = await statelessPagination(client, query, {
  pageSize: 50,
});
```

## Testing

The utility includes comprehensive tests covering:
- Basic pagination functionality
- Error handling
- Type safety
- Multiple endpoint validation (manyProduct, manyItem, getTaxonomies)
- Edge cases (empty results, null values, missing fields)

Run tests with:
```bash
npm test -- --grep "Stateless Pagination"
``` 