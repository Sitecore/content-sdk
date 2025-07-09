# Pagination Utility for Content SDK

## Overview

The Content SDK now includes a generic pagination utility that abstracts GraphQL-based pagination logic for dynamic endpoints. This utility reduces boilerplate code and provides a consistent approach to handling cursor-based pagination across all auto-generated Content Services endpoints.

## Features

- **Generic Design**: Works with any GraphQL endpoint that supports cursor-based pagination
- **Type Safety**: Full TypeScript support with generic types
- **Configurable**: Customizable page size and maximum page limits
- **Error Handling**: Comprehensive error handling and validation
- **Debug Logging**: Built-in debug logging for troubleshooting
- **Memory Efficient**: Processes pages sequentially to avoid memory issues

## Quick Start

### Basic Usage

```typescript
import { ContentClient } from '@sitecore-content-sdk/core';
import { paginateAll } from '@sitecore-content-sdk/core';

// Create a content client
const client = ContentClient.createClient({
  tenant: 'your-tenant',
  token: 'your-token',
});

// Define your fetch function
const fetchProducts = async (cursor?: string) => {
  return client.get(`
    query GetManyProduct($pageSize: Int, $after: String) {
      manyProduct(minimumPageSize: $pageSize, after: $after) {
        results {
          system { id name }
          name sku price category
        }
        cursor hasMore
      }
    }
  `, { pageSize: 20, after: cursor });
};

// Fetch all products
const allProducts = await paginateAll(fetchProducts, 'manyProduct', {
  pageSize: 20
});

console.log(`Fetched ${allProducts.length} products`);
```

### Advanced Usage

```typescript
// With custom options
const allProducts = await paginateAll(fetchProducts, 'manyProduct', {
  pageSize: 50,
  maxPages: 10, // Limit to 10 pages maximum
});

// With error handling
try {
  const allProducts = await paginateAll(fetchProducts, 'manyProduct', {
    pageSize: 20
  });
  console.log(`Successfully fetched ${allProducts.length} products`);
} catch (error) {
  console.error('Failed to fetch products:', error.message);
}
```

## API Reference

### `paginateAll<T, R>(fetchFunction, responseKey, options?)`

#### Parameters

- **`fetchFunction`** `(cursor?: string) => Promise<R>`: Function that fetches a single page of data
- **`responseKey`** `string`: The key in the GraphQL response that contains the paginated data
- **`options`** `PaginationOptions` (optional): Configuration options

#### Returns

- **`Promise<T[]>`**: Array of all items from all pages

#### Options

```typescript
interface PaginationOptions {
  pageSize?: number;    // Number of items per page (default: 100)
  maxPages?: number;    // Maximum number of pages to fetch (default: unlimited)
}
```

## Response Structure

The utility expects GraphQL responses to follow this structure:

```typescript
interface PaginatedResponse<T> {
  [responseKey: string]: {
    results: T[];
    cursor?: string;
    hasMore: boolean;
  };
}
```

## Error Handling

The utility provides comprehensive error handling:

### Common Errors

1. **Invalid Response Structure**: Thrown when the response doesn't match the expected format
2. **Missing hasMore Field**: Thrown when the response is missing the `hasMore` field
3. **GraphQL Errors**: Propagated from the underlying GraphQL client
4. **Network Errors**: Propagated from the underlying fetch implementation

### Error Recovery

```typescript
try {
  const allItems = await paginateAll(fetchFunction, 'manyItems', {
    pageSize: 20,
    maxPages: 5 // Limit pages to avoid infinite loops
  });
} catch (error) {
  if (error.message.includes('Invalid response structure')) {
    console.error('API response format changed');
  } else if (error.message.includes('GraphQL Error')) {
    console.error('Authentication or permission issue');
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

## Best Practices

### 1. Choose Appropriate Page Sizes

```typescript
// Good: Reasonable page size
const allItems = await paginateAll(fetchItems, 'manyItems', {
  pageSize: 50 // Balance between performance and memory usage
});

// Avoid: Too small (many API calls)
const allItems = await paginateAll(fetchItems, 'manyItems', {
  pageSize: 5 // Too many API calls
});

// Avoid: Too large (potential timeout)
const allItems = await paginateAll(fetchItems, 'manyItems', {
  pageSize: 1000 // May cause timeouts
});
```

### 2. Use Max Pages for Safety

```typescript
// Good: Prevent infinite loops
const allItems = await paginateAll(fetchItems, 'manyItems', {
  pageSize: 50,
  maxPages: 20 // Safety limit
});
```

### 3. Handle Large Datasets

```typescript
// For very large datasets, consider processing in chunks
const processLargeDataset = async () => {
  const batchSize = 1000;
  let processed = 0;
  
  const allItems = await paginateAll(fetchItems, 'manyItems', {
    pageSize: 100
  });
  
  for (let i = 0; i < allItems.length; i += batchSize) {
    const batch = allItems.slice(i, i + batchSize);
    await processBatch(batch);
    processed += batch.length;
    console.log(`Processed ${processed}/${allItems.length} items`);
  }
};
```

### 4. Implement Proper Error Handling

```typescript
const fetchWithRetry = async (cursor?: string) => {
  try {
    return await fetchItems(cursor);
  } catch (error) {
    if (error.message.includes('429')) {
      // Rate limited - wait and retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      return await fetchItems(cursor);
    }
    throw error;
  }
};

const allItems = await paginateAll(fetchWithRetry, 'manyItems');
```

## Real-World Examples

### E-commerce Product Catalog

```typescript
interface Product {
  system: { id: string; name: string };
  name: string;
  sku: string;
  price: number;
  category: string;
}

const fetchProducts = async (cursor?: string) => {
  return client.get(`
    query GetManyProduct($pageSize: Int, $after: String) {
      manyProduct(minimumPageSize: $pageSize, after: $after) {
        results {
          system { id name }
          name sku price category
        }
        cursor hasMore
      }
    }
  `, { pageSize: 50, after: cursor });
};

const allProducts = await paginateAll<Product, any>(fetchProducts, 'manyProduct', {
  pageSize: 50
});

// Group products by category
const productsByCategory = allProducts.reduce((acc, product) => {
  const category = product.category;
  if (!acc[category]) acc[category] = [];
  acc[category].push(product);
  return acc;
}, {} as Record<string, Product[]>);
```

### Content Management System

```typescript
interface Article {
  system: { id: string; name: string; created: string };
  title: string;
  content: string;
  author: string;
  tags: string[];
}

const fetchArticles = async (cursor?: string) => {
  return client.get(`
    query GetManyArticle($pageSize: Int, $after: String) {
      manyArticle(minimumPageSize: $pageSize, after: $after) {
        results {
          system { id name created }
          title content author tags
        }
        cursor hasMore
      }
    }
  `, { pageSize: 25, after: cursor });
};

const allArticles = await paginateAll<Article, any>(fetchArticles, 'manyArticle', {
  pageSize: 25
});

// Sort by creation date
const sortedArticles = allArticles.sort((a, b) => 
  new Date(b.system.created).getTime() - new Date(a.system.created).getTime()
);
```

## Migration Guide

### From Manual Pagination

**Before (Manual Pagination):**
```typescript
const fetchAllProducts = async () => {
  const allProducts = [];
  let cursor = '';
  let hasMore = true;
  
  while (hasMore) {
    const response = await client.get(GET_PRODUCTS_QUERY, { 
      pageSize: 50, 
      after: cursor 
    });
    
    const data = response.manyProduct;
    allProducts.push(...data.results);
    cursor = data.cursor || '';
    hasMore = data.hasMore;
  }
  
  return allProducts;
};
```

**After (Using Pagination Utility):**
```typescript
const fetchAllProducts = async () => {
  const fetchProducts = async (cursor?: string) => {
    return client.get(GET_PRODUCTS_QUERY, { 
      pageSize: 50, 
      after: cursor 
    });
  };
  
  return paginateAll(fetchProducts, 'manyProduct', { pageSize: 50 });
};
```

## Performance Considerations

### Memory Usage

- The utility processes pages sequentially to minimize memory usage
- For very large datasets, consider using `maxPages` to limit the total number of pages
- Monitor memory usage when processing datasets with millions of items

### API Rate Limits

- Be mindful of API rate limits when setting page sizes
- Consider implementing exponential backoff for rate limit errors
- Use appropriate page sizes to balance between API calls and response size

### Network Performance

- Larger page sizes reduce the number of API calls but increase response time
- Smaller page sizes increase the number of API calls but reduce individual response time
- Test with your specific API to find the optimal page size

## Troubleshooting

### Common Issues

1. **"Invalid response structure" error**
   - Check that your GraphQL query returns the expected structure
   - Verify the `responseKey` parameter matches your GraphQL response

2. **"Missing hasMore field" error**
   - Ensure your GraphQL schema includes the `hasMore` field
   - Check that the endpoint supports pagination

3. **Infinite pagination loop**
   - Verify that `hasMore` is properly set to `false` on the last page
   - Use `maxPages` option to prevent infinite loops

4. **Memory issues with large datasets**
   - Reduce page size
   - Use `maxPages` to limit total pages
   - Consider processing data in chunks

### Debug Logging

Enable debug logging to troubleshoot pagination issues:

```typescript
import debug from '@sitecore-content-sdk/core/debug';

// Enable content debug logging
debug.content.enabled = true;
```

## Related Documentation

- [Content Client API Reference](../content-client.md)
- [GraphQL Request Client](../graphql-request-client.md)
- [Dynamic Endpoints Guide](./dynamic-endpoints.md)
- [Error Handling Guide](./error-handling.md) 