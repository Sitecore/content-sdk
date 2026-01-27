[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchResponse

# Interface: SearchResponse\<T\>

Defined in: [search-service.ts:48](https://github.com/Sitecore/content-sdk/blob/4c91e9096c4e7c0afcb0aa1545c8537310c5d3aa/packages/search/src/search-service.ts#L48)

Response from the Search Service.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SearchDocument`](../type-aliases/SearchDocument.md) | [`SearchDocument`](../type-aliases/SearchDocument.md) |

## Properties

### results

> **results**: `T`[]

Defined in: [search-service.ts:52](https://github.com/Sitecore/content-sdk/blob/4c91e9096c4e7c0afcb0aa1545c8537310c5d3aa/packages/search/src/search-service.ts#L52)

The search results.

***

### total

> **total**: `number`

Defined in: [search-service.ts:56](https://github.com/Sitecore/content-sdk/blob/4c91e9096c4e7c0afcb0aa1545c8537310c5d3aa/packages/search/src/search-service.ts#L56)

The total number of search results.
