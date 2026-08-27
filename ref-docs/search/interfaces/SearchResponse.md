[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchResponse

# Interface: SearchResponse\<T\>

Defined in: [search-service.ts:64](https://github.com/Sitecore/content-sdk/blob/99809bafe75cd59525023226061287a2ced48886/packages/search/src/search-service.ts#L64)

Response from the Search Service.
Keyword search and More Like This (MLT) queries share this mapped shape,
so MLT widget consumers can read `results` without additional patching.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SearchDocument`](../type-aliases/SearchDocument.md) | [`SearchDocument`](../type-aliases/SearchDocument.md) |

## Properties

### facets?

> `optional` **facets?**: [`FacetResult`](FacetResult.md)[]

Defined in: [search-service.ts:76](https://github.com/Sitecore/content-sdk/blob/99809bafe75cd59525023226061287a2ced48886/packages/search/src/search-service.ts#L76)

Facet results, present only when facets were requested.

***

### results

> **results**: `T`[]

Defined in: [search-service.ts:68](https://github.com/Sitecore/content-sdk/blob/99809bafe75cd59525023226061287a2ced48886/packages/search/src/search-service.ts#L68)

The search results. For MLT queries, these are items similar to the seed item.

***

### total

> **total**: `number`

Defined in: [search-service.ts:72](https://github.com/Sitecore/content-sdk/blob/99809bafe75cd59525023226061287a2ced48886/packages/search/src/search-service.ts#L72)

The total number of search results.
