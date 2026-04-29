[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchParameters

# Interface: SearchParameters\<T\>

Defined in: [search-service.ts:66](https://github.com/Sitecore/content-sdk/blob/c06d0ea4e9b654ad3cb1c8d49cd23539a931fcce/packages/search/src/search-service.ts#L66)

A set of request parameters for the Search Service.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SearchDocument`](../type-aliases/SearchDocument.md) | [`SearchDocument`](../type-aliases/SearchDocument.md) |

## Properties

### keyphrase?

> `optional` **keyphrase?**: `string`

Defined in: [search-service.ts:74](https://github.com/Sitecore/content-sdk/blob/c06d0ea4e9b654ad3cb1c8d49cd23539a931fcce/packages/search/src/search-service.ts#L74)

Text value to search for. If not provided, the search will return all results.

***

### limit?

> `optional` **limit?**: `number`

Defined in: [search-service.ts:83](https://github.com/Sitecore/content-sdk/blob/c06d0ea4e9b654ad3cb1c8d49cd23539a931fcce/packages/search/src/search-service.ts#L83)

Specifies the maximum number of items to return. Maximum value 500.

#### Default

```ts
10
```

***

### offset?

> `optional` **offset?**: `number`

Defined in: [search-service.ts:88](https://github.com/Sitecore/content-sdk/blob/c06d0ea4e9b654ad3cb1c8d49cd23539a931fcce/packages/search/src/search-service.ts#L88)

Specifies how many items to skip before starting to collect the result set.

#### Default

```ts
0
```

***

### searchIndexId

> **searchIndexId**: `string`

Defined in: [search-service.ts:70](https://github.com/Sitecore/content-sdk/blob/c06d0ea4e9b654ad3cb1c8d49cd23539a931fcce/packages/search/src/search-service.ts#L70)

The ID of the search index to use.

***

### sort?

> `optional` **sort?**: [`SortSetting`](../type-aliases/SortSetting.md)\<`T`\> \| [`SortSetting`](../type-aliases/SortSetting.md)\<`T`\>[]

Defined in: [search-service.ts:78](https://github.com/Sitecore/content-sdk/blob/c06d0ea4e9b654ad3cb1c8d49cd23539a931fcce/packages/search/src/search-service.ts#L78)

Specifies the sorting of the search results.
