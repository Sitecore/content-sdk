[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchResponse

# Interface: SearchResponse\<T\>

Defined in: [search-service.ts:51](https://github.com/Sitecore/content-sdk/blob/6c65c39153c1345166224f0f46be85f70f13c595/packages/search/src/search-service.ts#L51)

Response from the Search Service.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SearchDocument`](../type-aliases/SearchDocument.md) | [`SearchDocument`](../type-aliases/SearchDocument.md) |

## Properties

### results

> **results**: `T`[]

Defined in: [search-service.ts:55](https://github.com/Sitecore/content-sdk/blob/6c65c39153c1345166224f0f46be85f70f13c595/packages/search/src/search-service.ts#L55)

The search results.

***

### total

> **total**: `number`

Defined in: [search-service.ts:59](https://github.com/Sitecore/content-sdk/blob/6c65c39153c1345166224f0f46be85f70f13c595/packages/search/src/search-service.ts#L59)

The total number of search results.
