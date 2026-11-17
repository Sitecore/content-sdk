[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchResponse

# Interface: SearchResponse\<T\>

Defined in: [search-service.ts:50](https://github.com/Sitecore/content-sdk/blob/17e859e2129ef994749bbc91241f601b807f14da/packages/search/src/search-service.ts#L50)

Response from the Search Service.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| <a id="type-parameter-t"></a> `T` *extends* [`SearchDocument`](../type-aliases/SearchDocument.md) | [`SearchDocument`](../type-aliases/SearchDocument.md) |

## Properties

### results

> **results**: `T`[]

Defined in: [search-service.ts:54](https://github.com/Sitecore/content-sdk/blob/17e859e2129ef994749bbc91241f601b807f14da/packages/search/src/search-service.ts#L54)

The search results.

***

### total

> **total**: `number`

Defined in: [search-service.ts:58](https://github.com/Sitecore/content-sdk/blob/17e859e2129ef994749bbc91241f601b807f14da/packages/search/src/search-service.ts#L58)

The total number of search results.
