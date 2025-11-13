[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [content](../README.md) / GET\_TAXONOMIES\_QUERY

# Variable: GET\_TAXONOMIES\_QUERY

> `const` **GET\_TAXONOMIES\_QUERY**: "\n  query GetAllTaxonomies(\n    $pageSize: Int\n    $after: String\n  ) \{\n    manyTaxonomy(minimumPageSize: $pageSize, after: $after) \{\n      cursor\n      hasMore\n      results \{\n        terms \{\n          cursor\n          hasMore\n          results \{\n            id\n            name\n            label\n          \}\n        \}\n        system \{\n          id\n          name\n          version\n          label\n          createdAt\n          createdBy\n          updatedAt\n          updatedBy\n          publishStatus\n        \}\n      \}\n    \}\n  \}\n"

Defined in: [packages/core/src/content/taxonomies.ts:125](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/content/taxonomies.ts#L125)

GraphQL query to retrieve all taxonomies with optional pagination for taxonomies only.

Variables:
- pageSize: The number of taxonomies to retrieve per page.
- after: The cursor for fetching the next page of taxonomies.
