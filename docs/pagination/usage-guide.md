# Pagination Utility - Usage Guide

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [Advanced Configuration](#advanced-configuration)
3. [Working with Different Endpoints](#working-with-different-endpoints)
4. [Error Handling](#error-handling)
5. [Performance Best Practices](#performance-best-practices)
6. [TypeScript Examples](#typescript-examples)
7. [Common Patterns](#common-patterns)

## Basic Usage

### Simple Pagination

The most basic usage fetches all results from a paginated endpoint:

```typescript
import { paginateAll } from '@sitecore/content-sdk';

// Fetch all taxonomies
const allTaxonomies = await paginateAll(
  (args) => contentClient.getTaxonomies(args)
);

console.log(`Fetched ${allTaxonomies.length} taxonomies`);
```

### With Configuration Options

Configure pagination behavior with optional parameters:

```typescript
// Fetch with custom page size and maximum pages
const taxonomies = await paginateAll(
  (args) => contentClient.getTaxonomies(args),
  {
    pageSize: 50,    // Fetch 50 items per page
    maxPages: 10     // Limit to 10 pages maximum
  }
);
```

## Advanced Configuration

### Page Size Optimization

Choose the optimal page size based on your use case:

```typescript
// For small datasets (fast response)
const smallBatch = await paginateAll(
  (args) => contentClient.getTaxonomies(args),
  { pageSize: 10 }
);

// For large datasets (memory efficient)
const largeBatch = await paginateAll(
  (args) => contentClient.getTaxonomies(args),
  { pageSize: 100 }
);

// For API rate limit compliance
const rateLimited = await paginateAll(
  (args) => contentClient.getTaxonomies(args),
  { pageSize: 25, maxPages: 5 }
);
```

### Memory Management

For very large datasets, consider processing in chunks:

```typescript
// Process in smaller chunks to manage memory
const processInChunks = async () => {
  const chunkSize = 1000;
  let processed = 0;
  
  const allItems = await paginateAll(
    (args) => contentClient.getManyStoreItem(args),
    { pageSize: 100 }
  );
  
  for (let i = 0; i < allItems.length; i += chunkSize) {
    const chunk = allItems.slice(i, i + chunkSize);
    await processChunk(chunk);
    processed += chunk.length;
    console.log(`Processed ${processed}/${allItems.length} items`);
  }
};
```

## Working with Different Endpoints

### Static Endpoints (getLocales)

**Note**: `getLocales` does not support pagination, so the utility cannot be used with it.

```typescript
// ❌ This won't work - getLocales doesn't support pagination
const locales = await paginateAll(
  (args) => contentClient.getLocales(args) // Error: getLocales doesn't accept pagination args
);

// ✅ Use the direct method instead
const locales = await contentClient.getLocales();
```

### Paginated Endpoints (getTaxonomies)

```typescript
// ✅ Works perfectly with getTaxonomies
const allTaxonomies = await paginateAll(
  (args) => contentClient.getTaxonomies(args)
);

// Access taxonomy data
allTaxonomies.forEach(taxonomy => {
  console.log(`Taxonomy: ${taxonomy.system.name}`);
  console.log(`Terms: ${taxonomy.terms.length}`);
});
```

### Dynamic Endpoints (manyStoreItem)

```typescript
// ✅ Works with any dynamic endpoint that supports pagination
const allStoreItems = await paginateAll(
  (args) => contentClient.getManyStoreItem(args),
  { pageSize: 50 }
);

// Process store items
allStoreItems.forEach(item => {
  console.log(`Store Item: ${item.system.name}`);
  console.log(`Price: ${item.price}`);
});
```

### Custom Endpoints

Create custom fetch functions for specialized use cases:

```typescript
// Custom fetch function with filtering
const fetchFilteredTaxonomies = async (args: PaginationArgs) => {
  const response = await contentClient.getTaxonomies({
    ...args,
    filter: { publishStatus: 'PUBLISHED' }
  });
  return response;
};

const publishedTaxonomies = await paginateAll(fetchFilteredTaxonomies);
```

## Error Handling

### Basic Error Handling

```typescript
try {
  const results = await paginateAll(
    (args) => contentClient.getTaxonomies(args)
  );
  console.log(`Successfully fetched ${results.length} items`);
} catch (error) {
  console.error('Pagination failed:', error.message);
  
  if (error.message.includes('Invalid response')) {
    console.error('The endpoint may not support pagination');
  }
}
```

### Retry Logic

```typescript
const paginateWithRetry = async (fetchFn: (args: PaginationArgs) => Promise<PaginatedResponse<any>>) => {
  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await paginateAll(fetchFn, { pageSize: 50 });
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      console.log(`Attempt ${attempt} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

const results = await paginateWithRetry(
  (args) => contentClient.getTaxonomies(args)
);
```

### Validation

```typescript
import { isPaginatedResponse } from '@sitecore/content-sdk';

// Validate response structure before pagination
const validateAndPaginate = async (fetchFn: (args: PaginationArgs) => Promise<any>) => {
  // Test the first call to validate response structure
  const testResponse = await fetchFn({ after: undefined, pageSize: 1 });
  
  if (!isPaginatedResponse(testResponse)) {
    throw new Error('Endpoint does not support pagination');
  }
  
  // Proceed with pagination
  return paginateAll(fetchFn);
};
```

## Performance Best Practices

### 1. Choose Optimal Page Size

```typescript
// For most use cases, 50-100 items per page works well
const optimalPageSize = 50;

// For large datasets, consider larger page sizes
const largeDatasetPageSize = 200;

// For rate-limited APIs, use smaller page sizes
const rateLimitedPageSize = 25;
```

### 2. Set Reasonable Limits

```typescript
// Prevent excessive API calls
const safePagination = await paginateAll(
  (args) => contentClient.getTaxonomies(args),
  {
    pageSize: 50,
    maxPages: 20 // Maximum 1000 items
  }
);
```

### 3. Monitor Performance

```typescript
const paginateWithMetrics = async (fetchFn: (args: PaginationArgs) => Promise<PaginatedResponse<any>>) => {
  const startTime = Date.now();
  const startMemory = process.memoryUsage().heapUsed;
  
  const results = await paginateAll(fetchFn, { pageSize: 50 });
  
  const endTime = Date.now();
  const endMemory = process.memoryUsage().heapUsed;
  
  console.log(`Pagination completed in ${endTime - startTime}ms`);
  console.log(`Memory used: ${(endMemory - startMemory) / 1024 / 1024}MB`);
  console.log(`Items fetched: ${results.length}`);
  
  return results;
};
```

### 4. Parallel Processing

```typescript
// Process multiple endpoints in parallel
const fetchAllData = async () => {
  const [taxonomies, storeItems, categories] = await Promise.all([
    paginateAll((args) => contentClient.getTaxonomies(args)),
    paginateAll((args) => contentClient.getManyStoreItem(args)),
    paginateAll((args) => contentClient.getManyCategory(args))
  ]);
  
  return { taxonomies, storeItems, categories };
};
```

## TypeScript Examples

### Strongly Typed Usage

```typescript
import { Taxonomy, StoreItem } from '@sitecore/content-sdk';

// Type-safe pagination
const taxonomies: Taxonomy[] = await paginateAll<Taxonomy>(
  (args) => contentClient.getTaxonomies(args)
);

const storeItems: StoreItem[] = await paginateAll<StoreItem>(
  (args) => contentClient.getManyStoreItem(args)
);
```

### Custom Types

```typescript
interface CustomItem {
  id: string;
  name: string;
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
}

interface CustomPaginatedResponse {
  results: CustomItem[];
  cursor?: string;
  hasMore: boolean;
  totalCount: number; // Additional field
}

// Custom fetch function with additional parameters
const fetchCustomItems = async (args: PaginationArgs & { filter?: string }) => {
  const response = await contentClient.getCustomItems(args);
  return response as CustomPaginatedResponse;
};

const customItems = await paginateAll<CustomItem, PaginationArgs & { filter?: string }>(
  fetchCustomItems
);
```

### Generic Wrapper

```typescript
// Create a generic wrapper for common pagination patterns
class PaginationHelper {
  constructor(private contentClient: ContentClient) {}
  
  async getAllTaxonomies(pageSize = 50) {
    return paginateAll<Taxonomy>(
      (args) => this.contentClient.getTaxonomies(args),
      { pageSize }
    );
  }
  
  async getAllStoreItems(pageSize = 100) {
    return paginateAll<StoreItem>(
      (args) => this.contentClient.getManyStoreItem(args),
      { pageSize }
    );
  }
  
  async getAllWithFilter<T>(
    fetchFn: (args: PaginationArgs & { filter: string }) => Promise<PaginatedResponse<T>>,
    filter: string,
    pageSize = 50
  ) {
    return paginateAll<T, PaginationArgs & { filter: string }>(
      (args) => fetchFn({ ...args, filter }),
      { pageSize }
    );
  }
}

const helper = new PaginationHelper(contentClient);
const publishedTaxonomies = await helper.getAllTaxonomies(25);
```

## Common Patterns

### 1. Data Processing Pipeline

```typescript
const processAllData = async () => {
  // Fetch all data
  const allItems = await paginateAll(
    (args) => contentClient.getManyStoreItem(args),
    { pageSize: 100 }
  );
  
  // Transform data
  const processedItems = allItems.map(item => ({
    id: item.system.id,
    name: item.system.name,
    price: item.price,
    category: item.category?.name || 'Uncategorized'
  }));
  
  // Filter data
  const expensiveItems = processedItems.filter(item => item.price > 100);
  
  // Group data
  const groupedByCategory = processedItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof processedItems>);
  
  return { allItems: processedItems, expensiveItems, groupedByCategory };
};
```

### 2. Incremental Processing

```typescript
const processIncrementally = async () => {
  let processedCount = 0;
  const batchSize = 1000;
  
  const allItems = await paginateAll(
    (args) => contentClient.getManyStoreItem(args),
    { pageSize: 100 }
  );
  
  for (let i = 0; i < allItems.length; i += batchSize) {
    const batch = allItems.slice(i, i + batchSize);
    
    // Process batch
    await processBatch(batch);
    
    processedCount += batch.length;
    console.log(`Processed ${processedCount}/${allItems.length} items`);
    
    // Optional: Add delay to prevent overwhelming the system
    if (i + batchSize < allItems.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
};
```

### 3. Conditional Pagination

```typescript
const fetchConditionally = async (shouldFetchAll: boolean) => {
  if (shouldFetchAll) {
    // Fetch all items
    return await paginateAll(
      (args) => contentClient.getManyStoreItem(args),
      { pageSize: 50 }
    );
  } else {
    // Fetch only first page
    const firstPage = await contentClient.getManyStoreItem({
      pageSize: 50
    });
    return firstPage.results;
  }
};
```

## Troubleshooting

### Common Issues

1. **"Invalid response" errors**: The endpoint may not support pagination
2. **Memory issues**: Reduce page size or implement streaming
3. **Rate limiting**: Add delays between requests or reduce page size
4. **Type errors**: Ensure your fetch function returns the correct type

### Debug Mode

```typescript
// Enable debug logging to see pagination progress
const debugPagination = async () => {
  const results = await paginateAll(
    (args) => contentClient.getTaxonomies(args),
    { pageSize: 10 } // Small page size for debugging
  );
  
  console.log('Pagination completed successfully');
  return results;
};
```

This usage guide covers the most common scenarios and best practices for using the pagination utility. For more advanced use cases, refer to the technical strategy document. 