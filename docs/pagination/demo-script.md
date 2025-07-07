# Pagination Utility - Demo Script

## Overview

This demo script demonstrates how the generic pagination utility simplifies pagination logic compared to manual implementation. We'll show before/after examples using the `getTaxonomies` endpoint.

## Demo Setup

### Prerequisites
```bash
# Install dependencies
npm install @sitecore/content-sdk

# Set up environment variables
export SITECORE_CS_TENANT="your-tenant"
export SITECORE_CS_TOKEN="your-token"
export SITECORE_CS_ENVIRONMENT="main"
```

### Demo Code
```typescript
import { ContentClient, paginateAll } from '@sitecore/content-sdk';

// Initialize ContentClient
const contentClient = ContentClient.createClient();
```

---

## Demo 1: Manual Pagination vs Utility

### ❌ Manual Implementation (Before)

```typescript
// Manual pagination - complex and error-prone
async function getAllTaxonomiesManual() {
  const allTaxonomies = [];
  let hasMore = true;
  let cursor: string | undefined;
  let pageCount = 0;
  const maxPages = 10; // Safety limit

  console.log('Starting manual pagination...');

  while (hasMore && pageCount < maxPages) {
    pageCount++;
    console.log(`Fetching page ${pageCount}...`);

    try {
      const response = await contentClient.getTaxonomies({
        pageSize: 50,
        after: cursor
      });

      // Validate response
      if (!response || !Array.isArray(response.results)) {
        throw new Error('Invalid response structure');
      }

      // Add results to collection
      allTaxonomies.push(...response.results);

      // Update pagination state
      hasMore = response.hasMore;
      cursor = response.cursor;

      console.log(`Page ${pageCount}: ${response.results.length} items, hasMore: ${hasMore}`);

      // Safety check - if we got fewer items than requested, we're done
      if (response.results.length < 50) {
        hasMore = false;
      }

    } catch (error) {
      console.error(`Error fetching page ${pageCount}:`, error);
      throw error;
    }
  }

  console.log(`Manual pagination complete: ${allTaxonomies.length} total items`);
  return allTaxonomies;
}

// Usage
try {
  const taxonomies = await getAllTaxonomiesManual();
  console.log(`Successfully fetched ${taxonomies.length} taxonomies`);
} catch (error) {
  console.error('Manual pagination failed:', error);
}
```

**Problems with Manual Implementation:**
- ❌ 40+ lines of boilerplate code
- ❌ Manual cursor management
- ❌ Error handling in every iteration
- ❌ Response validation required
- ❌ Safety limits and edge cases
- ❌ Debugging complexity
- ❌ Code duplication across endpoints

### ✅ Utility Implementation (After)

```typescript
// Utility pagination - simple and reliable
async function getAllTaxonomiesWithUtility() {
  console.log('Starting utility pagination...');

  const allTaxonomies = await paginateAll(
    (args) => contentClient.getTaxonomies(args),
    {
      pageSize: 50,
      maxPages: 10
    }
  );

  console.log(`Utility pagination complete: ${allTaxonomies.length} total items`);
  return allTaxonomies;
}

// Usage
try {
  const taxonomies = await getAllTaxonomiesWithUtility();
  console.log(`Successfully fetched ${taxonomies.length} taxonomies`);
} catch (error) {
  console.error('Utility pagination failed:', error);
}
```

**Benefits of Utility Implementation:**
- ✅ 3 lines of core logic
- ✅ Automatic cursor management
- ✅ Built-in error handling
- ✅ Response validation included
- ✅ Configurable safety limits
- ✅ Debug logging included
- ✅ Reusable across all endpoints

---

## Demo 2: Dynamic Endpoint Integration

### ❌ Manual Dynamic Endpoint (Before)

```typescript
// Manual implementation for dynamic endpoint
async function getAllStoreItemsManual() {
  const allItems = [];
  let hasMore = true;
  let cursor: string | undefined;
  let pageCount = 0;
  const maxPages = 20;

  console.log('Starting manual store items pagination...');

  while (hasMore && pageCount < maxPages) {
    pageCount++;
    console.log(`Fetching store items page ${pageCount}...`);

    try {
      // Custom GraphQL query for dynamic endpoint
      const query = `
        query GetManyStoreItem($pageSize: Int, $after: String) {
          manyStoreItem(minimumPageSize: $pageSize, after: $after) {
            results {
              system {
                id
                name
              }
              price
              category
            }
            cursor
            hasMore
          }
        }
      `;

      const response = await contentClient.get(query, {
        pageSize: 100,
        after: cursor
      });

      const data = response.manyStoreItem;

      // Validate response structure
      if (!data || !Array.isArray(data.results)) {
        throw new Error('Invalid store items response');
      }

      allItems.push(...data.results);
      hasMore = data.hasMore;
      cursor = data.cursor;

      console.log(`Page ${pageCount}: ${data.results.length} items, hasMore: ${hasMore}`);

    } catch (error) {
      console.error(`Error fetching store items page ${pageCount}:`, error);
      throw error;
    }
  }

  console.log(`Manual store items pagination complete: ${allItems.length} total items`);
  return allItems;
}
```

### ✅ Utility Dynamic Endpoint (After)

```typescript
// Utility implementation for dynamic endpoint
async function getAllStoreItemsWithUtility() {
  console.log('Starting utility store items pagination...');

  // Create a fetch function for the dynamic endpoint
  const fetchStoreItems = async (args: PaginationArgs) => {
    const query = `
      query GetManyStoreItem($pageSize: Int, $after: String) {
        manyStoreItem(minimumPageSize: $pageSize, after: $after) {
          results {
            system {
              id
              name
            }
            price
            category
          }
          cursor
          hasMore
        }
      }
    `;

    const response = await contentClient.get(query, args);
    return response.manyStoreItem;
  };

  const allItems = await paginateAll(fetchStoreItems, {
    pageSize: 100,
    maxPages: 20
  });

  console.log(`Utility store items pagination complete: ${allItems.length} total items`);
  return allItems;
}
```

---

## Demo 3: Error Handling Comparison

### ❌ Manual Error Handling (Before)

```typescript
async function getAllTaxonomiesWithManualErrorHandling() {
  const allTaxonomies = [];
  let hasMore = true;
  let cursor: string | undefined;
  let pageCount = 0;
  const maxPages = 10;
  const maxRetries = 3;

  while (hasMore && pageCount < maxPages) {
    pageCount++;
    let retryCount = 0;
    let success = false;

    while (!success && retryCount < maxRetries) {
      try {
        const response = await contentClient.getTaxonomies({
          pageSize: 50,
          after: cursor
        });

        // Validate response structure
        if (!response) {
          throw new Error('Empty response received');
        }

        if (!Array.isArray(response.results)) {
          throw new Error('Invalid results array');
        }

        if (typeof response.hasMore !== 'boolean') {
          throw new Error('Invalid hasMore field');
        }

        allTaxonomies.push(...response.results);
        hasMore = response.hasMore;
        cursor = response.cursor;
        success = true;

      } catch (error) {
        retryCount++;
        console.error(`Page ${pageCount}, attempt ${retryCount} failed:`, error);

        if (retryCount >= maxRetries) {
          throw new Error(`Failed to fetch page ${pageCount} after ${maxRetries} attempts`);
        }

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
      }
    }
  }

  return allTaxonomies;
}
```

### ✅ Utility Error Handling (After)

```typescript
async function getAllTaxonomiesWithUtilityErrorHandling() {
  try {
    const allTaxonomies = await paginateAll(
      (args) => contentClient.getTaxonomies(args),
      {
        pageSize: 50,
        maxPages: 10
      }
    );

    return allTaxonomies;
  } catch (error) {
    console.error('Pagination failed:', error.message);
    
    if (error.message.includes('Invalid response')) {
      console.error('The endpoint may not support pagination');
    }
    
    throw error;
  }
}
```

---

## Demo 4: Performance Monitoring

### ❌ Manual Performance Monitoring (Before)

```typescript
async function getAllTaxonomiesWithManualMonitoring() {
  const startTime = Date.now();
  const startMemory = process.memoryUsage().heapUsed;
  
  const allTaxonomies = [];
  let hasMore = true;
  let cursor: string | undefined;
  let pageCount = 0;
  const maxPages = 10;

  console.log('Starting manual pagination with monitoring...');

  while (hasMore && pageCount < maxPages) {
    const pageStartTime = Date.now();
    pageCount++;

    const response = await contentClient.getTaxonomies({
      pageSize: 50,
      after: cursor
    });

    allTaxonomies.push(...response.results);
    hasMore = response.hasMore;
    cursor = response.cursor;

    const pageTime = Date.now() - pageStartTime;
    const currentMemory = process.memoryUsage().heapUsed;
    
    console.log(`Page ${pageCount}: ${response.results.length} items, ${pageTime}ms, ${(currentMemory - startMemory) / 1024 / 1024}MB`);
  }

  const totalTime = Date.now() - startTime;
  const totalMemory = process.memoryUsage().heapUsed;
  
  console.log(`Manual pagination complete: ${allTaxonomies.length} items, ${totalTime}ms, ${(totalMemory - startMemory) / 1024 / 1024}MB`);
  
  return allTaxonomies;
}
```

### ✅ Utility Performance Monitoring (After)

```typescript
async function getAllTaxonomiesWithUtilityMonitoring() {
  const startTime = Date.now();
  const startMemory = process.memoryUsage().heapUsed;

  console.log('Starting utility pagination with monitoring...');

  const allTaxonomies = await paginateAll(
    (args) => contentClient.getTaxonomies(args),
    {
      pageSize: 50,
      maxPages: 10
    }
  );

  const totalTime = Date.now() - startTime;
  const totalMemory = process.memoryUsage().heapUsed;
  
  console.log(`Utility pagination complete: ${allTaxonomies.length} items, ${totalTime}ms, ${(totalMemory - startMemory) / 1024 / 1024}MB`);
  
  return allTaxonomies;
}
```

---

## Demo 5: TypeScript Integration

### ❌ Manual TypeScript (Before)

```typescript
interface Taxonomy {
  system: {
    id: string;
    name: string;
  };
  terms: {
    results: Array<{
      id: string;
      name: string;
    }>;
  };
}

async function getAllTaxonomiesWithManualTypes(): Promise<Taxonomy[]> {
  const allTaxonomies: Taxonomy[] = [];
  let hasMore = true;
  let cursor: string | undefined;
  let pageCount = 0;
  const maxPages = 10;

  while (hasMore && pageCount < maxPages) {
    pageCount++;

    const response = await contentClient.getTaxonomies({
      pageSize: 50,
      after: cursor
    });

    // Type assertion required
    const typedResults = response.results as Taxonomy[];
    allTaxonomies.push(...typedResults);
    
    hasMore = response.hasMore;
    cursor = response.cursor;
  }

  return allTaxonomies;
}
```

### ✅ Utility TypeScript (After)

```typescript
interface Taxonomy {
  system: {
    id: string;
    name: string;
  };
  terms: {
    results: Array<{
      id: string;
      name: string;
    }>;
  };
}

async function getAllTaxonomiesWithUtilityTypes(): Promise<Taxonomy[]> {
  return paginateAll<Taxonomy>(
    (args) => contentClient.getTaxonomies(args),
    { pageSize: 50, maxPages: 10 }
  );
}
```

---

## Demo 6: Real-world Usage Scenarios

### Scenario 1: Data Processing Pipeline

```typescript
// Process all taxonomies with filtering and transformation
async function processAllTaxonomies() {
  console.log('Starting taxonomy processing pipeline...');

  // Fetch all data using utility
  const allTaxonomies = await paginateAll(
    (args) => contentClient.getTaxonomies(args),
    { pageSize: 100 }
  );

  console.log(`Fetched ${allTaxonomies.length} taxonomies`);

  // Transform data
  const processedTaxonomies = allTaxonomies.map(taxonomy => ({
    id: taxonomy.system.id,
    name: taxonomy.system.name,
    termCount: taxonomy.terms.length,
    isPublished: taxonomy.system.publishStatus === 'PUBLISHED'
  }));

  // Filter data
  const publishedTaxonomies = processedTaxonomies.filter(t => t.isPublished);
  const largeTaxonomies = processedTaxonomies.filter(t => t.termCount > 10);

  // Group data
  const groupedByTermCount = processedTaxonomies.reduce((acc, taxonomy) => {
    const group = taxonomy.termCount > 10 ? 'large' : 'small';
    if (!acc[group]) acc[group] = [];
    acc[group].push(taxonomy);
    return acc;
  }, {} as Record<string, typeof processedTaxonomies>);

  console.log(`Processing complete:`);
  console.log(`- Total: ${processedTaxonomies.length}`);
  console.log(`- Published: ${publishedTaxonomies.length}`);
  console.log(`- Large: ${largeTaxonomies.length}`);
  console.log(`- Small: ${groupedByTermCount.small?.length || 0}`);

  return {
    all: processedTaxonomies,
    published: publishedTaxonomies,
    large: largeTaxonomies,
    grouped: groupedByTermCount
  };
}
```

### Scenario 2: Parallel Processing

```typescript
// Process multiple endpoints in parallel
async function processAllDataParallel() {
  console.log('Starting parallel data processing...');

  const [taxonomies, storeItems, categories] = await Promise.all([
    paginateAll((args) => contentClient.getTaxonomies(args), { pageSize: 50 }),
    paginateAll((args) => contentClient.getManyStoreItem(args), { pageSize: 100 }),
    paginateAll((args) => contentClient.getManyCategory(args), { pageSize: 75 })
  ]);

  console.log(`Parallel processing complete:`);
  console.log(`- Taxonomies: ${taxonomies.length}`);
  console.log(`- Store Items: ${storeItems.length}`);
  console.log(`- Categories: ${categories.length}`);

  return { taxonomies, storeItems, categories };
}
```

---

## Demo Results Summary

### Code Reduction
- **Manual Implementation**: 40-60 lines per endpoint
- **Utility Implementation**: 3-5 lines per endpoint
- **Reduction**: 85-90% less code

### Error Handling
- **Manual**: Custom error handling in every loop
- **Utility**: Built-in validation and error handling
- **Improvement**: Consistent, reliable error handling

### Type Safety
- **Manual**: Type assertions and manual validation
- **Utility**: Generic types with compile-time safety
- **Improvement**: Better TypeScript integration

### Maintainability
- **Manual**: Code duplication across endpoints
- **Utility**: Single, reusable implementation
- **Improvement**: Centralized logic, easier maintenance

### Developer Experience
- **Manual**: Complex boilerplate, error-prone
- **Utility**: Simple API, reliable behavior
- **Improvement**: Faster development, fewer bugs

---

## Conclusion

The pagination utility dramatically simplifies pagination logic while providing better error handling, type safety, and maintainability. The demo shows:

1. **Massive code reduction** (85-90% less code)
2. **Improved reliability** (built-in error handling)
3. **Better developer experience** (simple API)
4. **Enhanced type safety** (generic TypeScript support)
5. **Easier maintenance** (centralized logic)

**Recommendation**: Adopt the pagination utility for all new paginated endpoints to improve code quality and developer productivity. 