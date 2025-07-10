# Dynamic Pagination for Content SDK

## Overview

Dynamic Pagination provides a simple, unified way to fetch paginated data from any GraphQL query using the Content SDK. It automatically detects paginated fields, supports both single and multiple paginated fields in the same query, and gives you full control over pagination with cursors.

- **Unified API:** One method for all use cases
- **Automatic Field Detection:** No need to specify field paths
- **Supports Multiple Paginated Fields:** Handles queries with more than one paginated field
- **Cursor-based Continuation:** Use the returned cursor(s) to fetch the next page
- **Optional maxPages:** Limit the number of pages fetched for safety

---

## Quick Start

### 1. Import and Initialize

```typescript
import { ContentClient } from '@sitecore-content-sdk/core';

const client = ContentClient.createClient({
  tenant: 'your-tenant',
  environment: 'main',
  token: 'your-token',
});
```

### 2. Basic Usage (Single Paginated Field)

```typescript
const result = await client.dynamicPagination(
  `query GetProducts($pageSize: Int, $after: String) {
    manyProduct(minimumPageSize: $pageSize, after: $after) {
      results { id name price }
      cursor hasMore
    }
  }`,
  {
    pagination: { pageSize: 50 },
    // maxPages: 10, // Optional safety limit
  }
);

console.log(result.items); // Array of products
console.log(result.cursor); // Cursor for next page
console.log(result.hasMore); // true if more pages available
```

#### Fetch Next Page
```typescript
if (result.hasMore) {
  const nextPage = await client.dynamicPagination(
    query,
    { pagination: { pageSize: 50, after: result.cursor } }
  );
}
```

### 3. Multiple Paginated Fields in One Query

```typescript
const result = await client.dynamicPagination(
  `query GetData($pageSize: Int, $after: String) {
    manyProduct(minimumPageSize: $pageSize, after: $after) {
      results { id name }
      cursor hasMore
    }
    manyItem(minimumPageSize: $pageSize, after: $after) {
      results { id name }
      cursor hasMore
    }
  }`,
  {
    pagination: { pageSize: 50 },
    multiField: true,
    // maxPages: 10, // Optional
  }
);

console.log(result.items); // All items from all paginated fields
console.log(result.cursors); // { manyProduct: '...', manyItem: '...' }
console.log(result.hasMore); // true if any field has more pages
```

---

## API Reference

### `dynamicPagination`

```typescript
const result = await client.dynamicPagination(query, config);
```

- `query`: GraphQL query string (must use $pageSize and $after variables)
- `config` (object):
  - `pagination.pageSize` (number): Items per page
  - `pagination.after` (string): Cursor for next page (optional)
  - `multiField` (boolean): Set to true if your query has multiple paginated fields
  - `maxPages` (number): Optional safety limit for auto-fetching pages

#### Return Value
- **Single field:** `{ items: T[], cursor?: string, hasMore: boolean }`
- **Multiple fields:** `{ items: any[], cursors: Record<string, string | undefined>, hasMore: boolean }`

---

## Best Practices
- Always use the returned `cursor` or `cursors` for fetching the next page.
- Use `maxPages` to prevent accidental infinite loops when auto-fetching.
- For most use cases, just call `dynamicPagination` and handle pagination manually with the cursor.
- No need to specify field paths or use different modes—everything is handled automatically.

---

## Example: Full Pagination Loop

```typescript
let allItems = [];
let cursor: string | undefined = undefined;
let hasMore = true;

while (hasMore) {
  const result = await client.dynamicPagination(query, {
    pagination: { pageSize: 50, after: cursor },
  });
  allItems = allItems.concat(result.items);
  cursor = result.cursor;
  hasMore = result.hasMore;
}
```

---

## FAQ

**Q: Do I need to specify the paginated field name?**
A: No. The utility auto-detects paginated fields in the response.

**Q: Can I use this for multiple paginated fields in one query?**
A: Yes! Set `multiField: true` in the config.

**Q: How do I limit the number of pages fetched?**
A: Use the `maxPages` option in the config.

**Q: Is nested pagination supported?**
A: No. The new API is designed for top-level paginated fields only.

---

For more details, see the code and tests in the Content SDK repository. 