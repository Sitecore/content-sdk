[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchQuery

# Type Alias: SearchQuery

> **SearchQuery** = `StrictUnion`\<`KeyphraseQuery` \| `SeedItemIdQuery` \| `SeedItemUrlQuery`\>

Defined in: [models.ts:150](https://github.com/nayanadarshana/content-sdk/blob/469722c5a2544a875a80aa8cb3c7b3f6c18f819f/packages/search/src/models.ts#L150)

Query payload for the `/v1/search` API.
`keyphrase`, `seedItemId`, and `seedItemUrl` are mutually exclusive; provide at most one.
Omitting all three (or sending an empty `keyphrase`) returns unfiltered results.
`seedItemId` and `seedItemUrl` are used for More Like This (MLT) queries and are not
supported by `/v1/search/suggest`.
