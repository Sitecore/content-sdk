[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchParameters

# Interface: SearchParameters\<T\>

Defined in: [search-service.ts:64](https://github.com/Sitecore/content-sdk/blob/74365d5c2afd18a1fb476338fa7e4ac44617886c/packages/search/src/search-service.ts#L64)

A set of request parameters for the Search Service.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SearchDocument`](../type-aliases/SearchDocument.md) | [`SearchDocument`](../type-aliases/SearchDocument.md) |

## Properties

### keyphrase?

> `optional` **keyphrase**: `string`

Defined in: [search-service.ts:72](https://github.com/Sitecore/content-sdk/blob/74365d5c2afd18a1fb476338fa7e4ac44617886c/packages/search/src/search-service.ts#L72)

Text value to search for. If not provided, the search will return all results.

***

### limit?

> `optional` **limit**: `number`

Defined in: [search-service.ts:81](https://github.com/Sitecore/content-sdk/blob/74365d5c2afd18a1fb476338fa7e4ac44617886c/packages/search/src/search-service.ts#L81)

Specifies the maximum number of items to return. Maximum value 500.

#### Default

```ts
10
```

***

### offset?

> `optional` **offset**: `number`

Defined in: [search-service.ts:86](https://github.com/Sitecore/content-sdk/blob/74365d5c2afd18a1fb476338fa7e4ac44617886c/packages/search/src/search-service.ts#L86)

Specifies how many items to skip before starting to collect the result set.

#### Default

```ts
0
```

***

### searchIndexId

> **searchIndexId**: `string`

Defined in: [search-service.ts:68](https://github.com/Sitecore/content-sdk/blob/74365d5c2afd18a1fb476338fa7e4ac44617886c/packages/search/src/search-service.ts#L68)

The ID of the search index to use.

***

### sort?

> `optional` **sort**: [`SortSetting`](../type-aliases/SortSetting.md)\<`T`\> \| [`SortSetting`](../type-aliases/SortSetting.md)\<`T`\>[]

Defined in: [search-service.ts:76](https://github.com/Sitecore/content-sdk/blob/74365d5c2afd18a1fb476338fa7e4ac44617886c/packages/search/src/search-service.ts#L76)

Specifies the sorting of the search results.
