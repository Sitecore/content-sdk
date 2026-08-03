[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchResponse

# Interface: SearchResponse\<T\>

Defined in: [search-service.ts:55](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/search/src/search-service.ts#L55)

Response from the Search Service.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SearchDocument`](../type-aliases/SearchDocument.md) | [`SearchDocument`](../type-aliases/SearchDocument.md) |

## Properties

### facets?

> `optional` **facets?**: [`FacetResult`](FacetResult.md)[]

Defined in: [search-service.ts:67](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/search/src/search-service.ts#L67)

Facet results, present only when facets were requested.

***

### results

> **results**: `T`[]

Defined in: [search-service.ts:59](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/search/src/search-service.ts#L59)

The search results.

***

### total

> **total**: `number`

Defined in: [search-service.ts:63](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/search/src/search-service.ts#L63)

The total number of search results.
