[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / FacetRequest

# Interface: FacetRequest

Defined in: [models.ts:49](https://github.com/Sitecore/content-sdk/blob/9329e6e2d33c2b5d7d6c8bef29aa6663d4bb5a71/packages/search/src/models.ts#L49)

Facet request configuration.
Use 'all: true' to retrieve counts for every enabled facet in the index config.
Use 'fields' to filter results by specific facet values.
Both can be combined: 'all: true' returns all facet counts while 'fields' filters the results.

## Properties

### all?

> `optional` **all?**: `boolean`

Defined in: [models.ts:53](https://github.com/Sitecore/content-sdk/blob/9329e6e2d33c2b5d7d6c8bef29aa6663d4bb5a71/packages/search/src/models.ts#L53)

When true, returns value counts for all facets enabled in the index configuration.

***

### fields?

> `optional` **fields?**: [`FacetField`](FacetField.md)[]

Defined in: [models.ts:57](https://github.com/Sitecore/content-sdk/blob/9329e6e2d33c2b5d7d6c8bef29aa6663d4bb5a71/packages/search/src/models.ts#L57)

Specific facet fields to request or filter by.
