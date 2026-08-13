[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchResponse

# Interface: SearchResponse\<T\>

Defined in: [search-service.ts:55](https://github.com/Sitecore/content-sdk/blob/08b5216f27c90a395a5ac8aa21cca1fd107676c6/packages/search/src/search-service.ts#L55)

Response from the Search Service.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SearchDocument`](../type-aliases/SearchDocument.md) | [`SearchDocument`](../type-aliases/SearchDocument.md) |

## Properties

### facets?

> `optional` **facets?**: [`FacetResult`](FacetResult.md)[]

Defined in: [search-service.ts:67](https://github.com/Sitecore/content-sdk/blob/08b5216f27c90a395a5ac8aa21cca1fd107676c6/packages/search/src/search-service.ts#L67)

Facet results, present only when facets were requested.

***

### results

> **results**: `T`[]

Defined in: [search-service.ts:59](https://github.com/Sitecore/content-sdk/blob/08b5216f27c90a395a5ac8aa21cca1fd107676c6/packages/search/src/search-service.ts#L59)

The search results.

***

### total

> **total**: `number`

Defined in: [search-service.ts:63](https://github.com/Sitecore/content-sdk/blob/08b5216f27c90a395a5ac8aa21cca1fd107676c6/packages/search/src/search-service.ts#L63)

The total number of search results.
