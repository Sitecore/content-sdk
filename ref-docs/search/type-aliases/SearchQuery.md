[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchQuery

# Type Alias: SearchQuery

> **SearchQuery** = `StrictUnion`\<`KeyphraseQuery` \| `SeedItemIdQuery` \| `SeedItemUrlQuery`\>

Defined in: [models.ts:143](https://github.com/Sitecore/content-sdk/blob/6320ef720fd2c837d6aad938ce6e7c5806cb2aa6/packages/search/src/models.ts#L143)

Query payload for the `/v1/search` API.
`keyphrase`, `seedItemId`, and `seedItemUrl` are mutually exclusive; provide at most one.
Omitting all three (or sending an empty `keyphrase`) returns unfiltered results.
`seedItemId` and `seedItemUrl` are used for More Like This (MLT) queries and are not
supported by `/v1/search/suggest`.
