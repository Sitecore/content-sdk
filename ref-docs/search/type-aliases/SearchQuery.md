[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchQuery

# Type Alias: SearchQuery

> **SearchQuery** = `StrictUnion`\<`KeyphraseQuery` \| `SeedItemIdQuery` \| `SeedItemUrlQuery`\>

Defined in: [models.ts:143](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/search/src/models.ts#L143)

Query payload for the `/v1/search` API.
`keyphrase`, `seedItemId`, and `seedItemUrl` are mutually exclusive; provide at most one.
Omitting all three (or sending an empty `keyphrase`) returns unfiltered results.
`seedItemId` and `seedItemUrl` are used for More Like This (MLT) queries and are not
supported by `/v1/search/suggest`.
