[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / FacetField

# Interface: FacetField

Defined in: [models.ts:31](https://github.com/Sitecore/content-sdk/blob/c534eb99847822eb0c922118a328b7fc16159f1c/packages/search/src/models.ts#L31)

A specific facet field to include in the request, with optional filters.

## Properties

### filters?

> `optional` **filters?**: [`FacetFilter`](FacetFilter.md)[]

Defined in: [models.ts:39](https://github.com/Sitecore/content-sdk/blob/c534eb99847822eb0c922118a328b7fc16159f1c/packages/search/src/models.ts#L39)

Optional filters that narrow search results to items matching the given facet values.

***

### max?

> `optional` **max?**: `number`

Defined in: [models.ts:46](https://github.com/Sitecore/content-sdk/blob/c534eb99847822eb0c922118a328b7fc16159f1c/packages/search/src/models.ts#L46)

Maximum number of values to return for this facet.

Valid values are integers from 1 through 100.
When omitted, the Search Runtime uses its default of 10.

***

### name

> **name**: `string`

Defined in: [models.ts:35](https://github.com/Sitecore/content-sdk/blob/c534eb99847822eb0c922118a328b7fc16159f1c/packages/search/src/models.ts#L35)

The display name of the facet as configured in the search index (not the raw field name).
