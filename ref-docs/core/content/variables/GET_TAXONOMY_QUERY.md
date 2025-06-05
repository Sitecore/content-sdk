[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [content](../README.md) / GET\_TAXONOMY\_QUERY

# Variable: GET\_TAXONOMY\_QUERY

> `const` **GET\_TAXONOMY\_QUERY**: "\n  query GetTaxonomyById($id: ID!, $termsPageSize: Int, $termsAfter: String) \{\n    taxonomy(id: $id) \{\n      terms(minimumPageSize: $termsPageSize, after: $termsAfter) \{\n        cursor\n        hasMore\n        results \{\n          id\n          name\n          label\n        \}\n      \}\n      system \{\n        id\n        name\n        version\n        label\n        createdAt\n        createdBy\n        updatedAt\n        updatedBy\n        publishStatus\n      \}\n    \}\n  \}\n"

Defined in: [packages/core/src/content/taxonomies.ts:167](https://github.com/Sitecore/content-sdk/blob/458187ff9fb374e734a531d840a9956b30fbb79e/packages/core/src/content/taxonomies.ts#L167)

GraphQL query to retrieve a specific taxonomy by its ID, with optional pagination for its terms.

Variables:
- id: The unique ID of the taxonomy to retrieve.
- termsPageSize: The number of terms to retrieve per page.
- termsAfter: The cursor for fetching the next page of terms.
