[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchResponse

# Interface: SearchResponse\<T\>

Defined in: [search-service.ts:51](https://github.com/Sitecore/content-sdk/blob/6f494d7de2451d44441c200576d22126cf4eecc0/packages/search/src/search-service.ts#L51)

Response from the Search Service.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SearchDocument`](../type-aliases/SearchDocument.md) | [`SearchDocument`](../type-aliases/SearchDocument.md) |

## Properties

### results

> **results**: `T`[]

Defined in: [search-service.ts:55](https://github.com/Sitecore/content-sdk/blob/6f494d7de2451d44441c200576d22126cf4eecc0/packages/search/src/search-service.ts#L55)

The search results.

***

### total

> **total**: `number`

Defined in: [search-service.ts:59](https://github.com/Sitecore/content-sdk/blob/6f494d7de2451d44441c200576d22126cf4eecc0/packages/search/src/search-service.ts#L59)

The total number of search results.
