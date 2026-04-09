[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchParameters

# Interface: SearchParameters\<T\>

Defined in: [search-service.ts:65](https://github.com/Sitecore/content-sdk/blob/70016491a49cd62f4c9a1f6cd5f5e859c138b42d/packages/search/src/search-service.ts#L65)

A set of request parameters for the Search Service.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SearchDocument`](../type-aliases/SearchDocument.md) | [`SearchDocument`](../type-aliases/SearchDocument.md) |

## Properties

### keyphrase?

> `optional` **keyphrase?**: `string`

Defined in: [search-service.ts:73](https://github.com/Sitecore/content-sdk/blob/70016491a49cd62f4c9a1f6cd5f5e859c138b42d/packages/search/src/search-service.ts#L73)

Text value to search for. If not provided, the search will return all results.

***

### limit?

> `optional` **limit?**: `number`

Defined in: [search-service.ts:82](https://github.com/Sitecore/content-sdk/blob/70016491a49cd62f4c9a1f6cd5f5e859c138b42d/packages/search/src/search-service.ts#L82)

Specifies the maximum number of items to return. Maximum value 500.

#### Default

```ts
10
```

***

### offset?

> `optional` **offset?**: `number`

Defined in: [search-service.ts:87](https://github.com/Sitecore/content-sdk/blob/70016491a49cd62f4c9a1f6cd5f5e859c138b42d/packages/search/src/search-service.ts#L87)

Specifies how many items to skip before starting to collect the result set.

#### Default

```ts
0
```

***

### searchIndexId

> **searchIndexId**: `string`

Defined in: [search-service.ts:69](https://github.com/Sitecore/content-sdk/blob/70016491a49cd62f4c9a1f6cd5f5e859c138b42d/packages/search/src/search-service.ts#L69)

The ID of the search index to use.

***

### sort?

> `optional` **sort?**: [`SortSetting`](../type-aliases/SortSetting.md)\<`T`\> \| [`SortSetting`](../type-aliases/SortSetting.md)\<`T`\>[]

Defined in: [search-service.ts:77](https://github.com/Sitecore/content-sdk/blob/70016491a49cd62f4c9a1f6cd5f5e859c138b42d/packages/search/src/search-service.ts#L77)

Specifies the sorting of the search results.
