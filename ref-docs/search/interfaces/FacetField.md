[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / FacetField

# Interface: FacetField

Defined in: [models.ts:31](https://github.com/Sitecore/content-sdk/blob/c9c8d1c0cd9bd014c418f5695be825137a97e6ba/packages/search/src/models.ts#L31)

A specific facet field to include in the request, with optional filters.

## Properties

### filters?

> `optional` **filters?**: [`FacetFilter`](FacetFilter.md)[]

Defined in: [models.ts:39](https://github.com/Sitecore/content-sdk/blob/c9c8d1c0cd9bd014c418f5695be825137a97e6ba/packages/search/src/models.ts#L39)

Optional filters that narrow search results to items matching the given facet values.

***

### name

> **name**: `string`

Defined in: [models.ts:35](https://github.com/Sitecore/content-sdk/blob/c9c8d1c0cd9bd014c418f5695be825137a97e6ba/packages/search/src/models.ts#L35)

The display name of the facet as configured in the search index (not the raw field name).
