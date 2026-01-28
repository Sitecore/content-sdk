[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchResponse

# Interface: SearchResponse\<T\>

Defined in: [search-service.ts:49](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/search/src/search-service.ts#L49)

Response from the Search Service.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SearchDocument`](../type-aliases/SearchDocument.md) | [`SearchDocument`](../type-aliases/SearchDocument.md) |

## Properties

### results

> **results**: `T`[]

Defined in: [search-service.ts:53](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/search/src/search-service.ts#L53)

The search results.

***

### total

> **total**: `number`

Defined in: [search-service.ts:57](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/search/src/search-service.ts#L57)

The total number of search results.
