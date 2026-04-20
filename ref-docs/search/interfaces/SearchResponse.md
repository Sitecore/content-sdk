[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchResponse

# Interface: SearchResponse\<T\>

Defined in: [search-service.ts:50](https://github.com/Sitecore/content-sdk/blob/70eccc43077e1c9d1fe9da2ed5681f1cd3574c75/packages/search/src/search-service.ts#L50)

Response from the Search Service.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SearchDocument`](../type-aliases/SearchDocument.md) | [`SearchDocument`](../type-aliases/SearchDocument.md) |

## Properties

### results

> **results**: `T`[]

Defined in: [search-service.ts:54](https://github.com/Sitecore/content-sdk/blob/70eccc43077e1c9d1fe9da2ed5681f1cd3574c75/packages/search/src/search-service.ts#L54)

The search results.

***

### total

> **total**: `number`

Defined in: [search-service.ts:58](https://github.com/Sitecore/content-sdk/blob/70eccc43077e1c9d1fe9da2ed5681f1cd3574c75/packages/search/src/search-service.ts#L58)

The total number of search results.
