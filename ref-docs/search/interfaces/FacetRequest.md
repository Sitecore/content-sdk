[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / FacetRequest

# Interface: FacetRequest

Defined in: [models.ts:56](https://github.com/Sitecore/content-sdk/blob/c534eb99847822eb0c922118a328b7fc16159f1c/packages/search/src/models.ts#L56)

Facet request configuration.
Use 'all: true' to retrieve counts for every enabled facet in the index config.
Use 'fields' to filter results by specific facet values.
Both can be combined: 'all: true' returns all facet counts while 'fields' filters the results.

## Properties

### all?

> `optional` **all?**: `boolean`

Defined in: [models.ts:60](https://github.com/Sitecore/content-sdk/blob/c534eb99847822eb0c922118a328b7fc16159f1c/packages/search/src/models.ts#L60)

When true, returns value counts for all facets enabled in the index configuration.

***

### fields?

> `optional` **fields?**: [`FacetField`](FacetField.md)[]

Defined in: [models.ts:64](https://github.com/Sitecore/content-sdk/blob/c534eb99847822eb0c922118a328b7fc16159f1c/packages/search/src/models.ts#L64)

Specific facet fields to request or filter by.
