[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchResponse

# Interface: SearchResponse\<T\>

Defined in: [search-service.ts:50](https://github.com/Sitecore/content-sdk/blob/a8f8449eaf9300a6c6791c4ca1402de3ec959247/packages/search/src/search-service.ts#L50)

Response from the Search Service.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SearchDocument`](../type-aliases/SearchDocument.md) | [`SearchDocument`](../type-aliases/SearchDocument.md) |

## Properties

### results

> **results**: `T`[]

Defined in: [search-service.ts:54](https://github.com/Sitecore/content-sdk/blob/a8f8449eaf9300a6c6791c4ca1402de3ec959247/packages/search/src/search-service.ts#L54)

The search results.

***

### total

> **total**: `number`

Defined in: [search-service.ts:58](https://github.com/Sitecore/content-sdk/blob/a8f8449eaf9300a6c6791c4ca1402de3ec959247/packages/search/src/search-service.ts#L58)

The total number of search results.
