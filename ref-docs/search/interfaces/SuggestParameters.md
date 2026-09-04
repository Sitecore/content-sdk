[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SuggestParameters

# Interface: SuggestParameters

Defined in: [search-service.ts:148](https://github.com/Sitecore/content-sdk/blob/8eb01ef1062b410d0a689de49635870a3d3afbde/packages/search/src/search-service.ts#L148)

A set of request parameters for the Suggest Service.
`/v1/search/suggest` accepts only `keyphrase` in the query payload.
`seedItemId` and `seedItemUrl` are not supported.

## Properties

### keyphrase

> **keyphrase**: `string`

Defined in: [search-service.ts:156](https://github.com/Sitecore/content-sdk/blob/8eb01ef1062b410d0a689de49635870a3d3afbde/packages/search/src/search-service.ts#L156)

Partial text used for typeahead suggestions. Must be a non-empty string.

***

### locale?

> `optional` **locale?**: `string`

Defined in: [search-service.ts:162](https://github.com/Sitecore/content-sdk/blob/8eb01ef1062b410d0a689de49635870a3d3afbde/packages/search/src/search-service.ts#L162)

The locale to use for the suggest request. Required for multi-locale index configurations.
Format: letters and hyphens only (e.g. 'en', 'fr-FR', 'el-GR').
Omit for single-locale indexes.

***

### searchIndexId

> **searchIndexId**: `string`

Defined in: [search-service.ts:152](https://github.com/Sitecore/content-sdk/blob/8eb01ef1062b410d0a689de49635870a3d3afbde/packages/search/src/search-service.ts#L152)

The ID of the search index to use.
