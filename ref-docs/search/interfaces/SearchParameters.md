[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchParameters

# Interface: SearchParameters\<T\>

Defined in: [search-service.ts:87](https://github.com/Sitecore/content-sdk/blob/b0823f3a364598af8034e451448160c20b885d18/packages/search/src/search-service.ts#L87)

A set of request parameters for the Search Service.
Query fields `keyphrase`, `seedItemId`, and `seedItemUrl` are mutually exclusive.
Provide at most one. Omitting all three returns unfiltered results.
Use `seedItemId` or `seedItemUrl` for More Like This (MLT) widget queries.
These seed fields are sent only to `/v1/search`, not `/v1/search/suggest`.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SearchDocument`](../type-aliases/SearchDocument.md) | [`SearchDocument`](../type-aliases/SearchDocument.md) |

## Properties

### facet?

> `optional` **facet?**: [`FacetRequest`](FacetRequest.md)

Defined in: [search-service.ts:133](https://github.com/Sitecore/content-sdk/blob/b0823f3a364598af8034e451448160c20b885d18/packages/search/src/search-service.ts#L133)

Facet configuration. Use 'all: true' to retrieve counts for all enabled facets.
Use 'fields' to filter results by specific facet values. Both can be combined.

***

### keyphrase?

> `optional` **keyphrase?**: `string`

Defined in: [search-service.ts:96](https://github.com/Sitecore/content-sdk/blob/b0823f3a364598af8034e451448160c20b885d18/packages/search/src/search-service.ts#L96)

Text value to search for. If not provided, the search will return all results.
Mutually exclusive with `seedItemId` and `seedItemUrl`.

***

### limit?

> `optional` **limit?**: `number`

Defined in: [search-service.ts:117](https://github.com/Sitecore/content-sdk/blob/b0823f3a364598af8034e451448160c20b885d18/packages/search/src/search-service.ts#L117)

Specifies the maximum number of items to return. Maximum value 500.

#### Default

```ts
10
```

***

### locale?

> `optional` **locale?**: `string`

Defined in: [search-service.ts:128](https://github.com/Sitecore/content-sdk/blob/b0823f3a364598af8034e451448160c20b885d18/packages/search/src/search-service.ts#L128)

The locale to use for the search. Required for multi-locale index configurations.
Format: letters and hyphens only (e.g. 'en', 'fr-FR', 'el-GR').
Omit for single-locale indexes.

***

### offset?

> `optional` **offset?**: `number`

Defined in: [search-service.ts:122](https://github.com/Sitecore/content-sdk/blob/b0823f3a364598af8034e451448160c20b885d18/packages/search/src/search-service.ts#L122)

Specifies how many items to skip before starting to collect the result set.

#### Default

```ts
0
```

***

### searchIndexId

> **searchIndexId**: `string`

Defined in: [search-service.ts:91](https://github.com/Sitecore/content-sdk/blob/b0823f3a364598af8034e451448160c20b885d18/packages/search/src/search-service.ts#L91)

The ID of the search index to use.

***

### seedItemId?

> `optional` **seedItemId?**: `string`

Defined in: [search-service.ts:102](https://github.com/Sitecore/content-sdk/blob/b0823f3a364598af8034e451448160c20b885d18/packages/search/src/search-service.ts#L102)

Item ID used as the seed for More Like This (MLT) results.
Mutually exclusive with `keyphrase` and `seedItemUrl`.
Used only by `/v1/search`, not `/v1/search/suggest`.

***

### seedItemUrl?

> `optional` **seedItemUrl?**: `string`

Defined in: [search-service.ts:108](https://github.com/Sitecore/content-sdk/blob/b0823f3a364598af8034e451448160c20b885d18/packages/search/src/search-service.ts#L108)

Item URL used as the seed for More Like This (MLT) results.
Mutually exclusive with `keyphrase` and `seedItemId`.
Used only by `/v1/search`, not `/v1/search/suggest`.

***

### sort?

> `optional` **sort?**: [`SortSetting`](../type-aliases/SortSetting.md)\<`T`\> \| [`SortSetting`](../type-aliases/SortSetting.md)\<`T`\>[]

Defined in: [search-service.ts:112](https://github.com/Sitecore/content-sdk/blob/b0823f3a364598af8034e451448160c20b885d18/packages/search/src/search-service.ts#L112)

Specifies the sorting of the search results.
