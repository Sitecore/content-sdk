# Generic Pagination Utility

## Overview

The Generic Pagination Utility provides a reusable solution for handling cursor-based pagination across dynamic many endpoints in the Content SDK. This utility abstracts away the complexity of pagination loops and provides a simple, type-safe interface for fetching all results from paginated endpoints.

## Problem Statement

Content Services automatically generates dynamic many endpoints (e.g., `manyStoreItem`, `manyTaxonomy`) when new content models are created. These endpoints typically support cursor-based pagination using `cursor` and `hasMore` fields. However, implementing pagination logic for each endpoint requires repetitive code and increases the chance of errors.

## Solution

The `paginateAll` utility function provides a generic, reusable solution that:

- **Abstracts pagination logic**: Handles cursor-based pagination internally
- **Type-safe**: Provides full TypeScript support with generic types
- **Flexible**: Works with any endpoint that follows the standard pagination pattern
- **Configurable**: Supports page size limits and maximum page counts
- **Error handling**: Validates response structure and provides meaningful error messages

## Key Features

- **Generic Design**: Works with any endpoint that returns `{ results: T[], cursor?: string, hasMore: boolean }`
- **Automatic Pagination**: Fetches all pages automatically until no more data is available
- **Performance Control**: Optional `pageSize` and `maxPages` parameters for controlling resource usage
- **Error Validation**: Validates response structure and provides clear error messages
- **Debugging Support**: Comprehensive logging for troubleshooting pagination issues

## Quick Start

```typescript
import { paginateAll } from '@sitecore/content-sdk';

// Fetch all taxonomies
const allTaxonomies = await paginateAll(
  (args) => contentClient.getTaxonomies(args),
  { pageSize: 50 }
);

// Fetch all items from a dynamic endpoint
const allStoreItems = await paginateAll(
  (args) => contentClient.getManyStoreItem(args),
  { pageSize: 100, maxPages: 10 }
);
```

## Benefits

1. **Reduced Code Duplication**: Single utility for all paginated endpoints
2. **Consistent Behavior**: Standardized pagination logic across the SDK
3. **Developer Experience**: Simple API that abstracts away pagination complexity
4. **Type Safety**: Full TypeScript support with generic types
5. **Maintainability**: Centralized pagination logic that's easier to test and maintain

## Compatibility

The utility is compatible with any endpoint that follows the standard pagination pattern:
- Returns an object with `results`, `cursor`, and `hasMore` fields
- Accepts `after` and `pageSize` parameters
- Uses cursor-based pagination

## Next Steps

- [Usage Guide](./usage-guide.md) - Detailed examples and best practices
- [Technical Strategy](./pagination-strategy.md) - Design rationale and implementation details
- [Follow-up Plan](./follow-up.md) - Proposed next steps and recommendations 