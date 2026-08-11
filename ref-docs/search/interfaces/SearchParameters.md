[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchParameters

# Interface: SearchParameters\<T\>

Defined in: [search-service.ts:74](https://github.com/Sitecore/content-sdk/blob/3b9edfe853f8f321e9bd2dff8cfbdda2c3d66627/packages/search/src/search-service.ts#L74)

A set of request parameters for the Search Service.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SearchDocument`](../type-aliases/SearchDocument.md) | [`SearchDocument`](../type-aliases/SearchDocument.md) |

## Properties

### facet?

> `optional` **facet?**: [`FacetRequest`](FacetRequest.md)

Defined in: [search-service.ts:107](https://github.com/Sitecore/content-sdk/blob/3b9edfe853f8f321e9bd2dff8cfbdda2c3d66627/packages/search/src/search-service.ts#L107)

Facet configuration. Use 'all: true' to retrieve counts for all enabled facets.
Use 'fields' to filter results by specific facet values. Both can be combined.

***

### keyphrase?

> `optional` **keyphrase?**: `string`

Defined in: [search-service.ts:82](https://github.com/Sitecore/content-sdk/blob/3b9edfe853f8f321e9bd2dff8cfbdda2c3d66627/packages/search/src/search-service.ts#L82)

Text value to search for. If not provided, the search will return all results.

***

### limit?

> `optional` **limit?**: `number`

Defined in: [search-service.ts:91](https://github.com/Sitecore/content-sdk/blob/3b9edfe853f8f321e9bd2dff8cfbdda2c3d66627/packages/search/src/search-service.ts#L91)

Specifies the maximum number of items to return. Maximum value 500.

#### Default

```ts
10
```

***

### locale?

> `optional` **locale?**: `string`

Defined in: [search-service.ts:102](https://github.com/Sitecore/content-sdk/blob/3b9edfe853f8f321e9bd2dff8cfbdda2c3d66627/packages/search/src/search-service.ts#L102)

The locale to use for the search. Required for multi-locale index configurations.
Format: letters and hyphens only (e.g. 'en', 'fr-FR', 'el-GR').
Omit for single-locale indexes.

***

### offset?

> `optional` **offset?**: `number`

Defined in: [search-service.ts:96](https://github.com/Sitecore/content-sdk/blob/3b9edfe853f8f321e9bd2dff8cfbdda2c3d66627/packages/search/src/search-service.ts#L96)

Specifies how many items to skip before starting to collect the result set.

#### Default

```ts
0
```

***

### searchIndexId

> **searchIndexId**: `string`

Defined in: [search-service.ts:78](https://github.com/Sitecore/content-sdk/blob/3b9edfe853f8f321e9bd2dff8cfbdda2c3d66627/packages/search/src/search-service.ts#L78)

The ID of the search index to use.

***

### sort?

> `optional` **sort?**: [`SortSetting`](../type-aliases/SortSetting.md)\<`T`\> \| [`SortSetting`](../type-aliases/SortSetting.md)\<`T`\>[]

Defined in: [search-service.ts:86](https://github.com/Sitecore/content-sdk/blob/3b9edfe853f8f321e9bd2dff8cfbdda2c3d66627/packages/search/src/search-service.ts#L86)

Specifies the sorting of the search results.
