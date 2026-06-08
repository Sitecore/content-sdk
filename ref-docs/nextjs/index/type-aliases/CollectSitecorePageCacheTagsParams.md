[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / CollectSitecorePageCacheTagsParams

# Type Alias: CollectSitecorePageCacheTagsParams

> **CollectSitecorePageCacheTagsParams** = `object`

Defined in: [nextjs/src/cache/sitecore-page-cache-tags.ts:64](https://github.com/Sitecore/content-sdk/blob/386c7f8bd3745fb4187e490efe4dd14be4a48189/packages/nextjs/src/cache/sitecore-page-cache-tags.ts#L64)

Inputs for assembling cache tags for a typical Sitecore page render (`getPage`).

## Properties

### locale

> **locale**: `string`

Defined in: [nextjs/src/cache/sitecore-page-cache-tags.ts:66](https://github.com/Sitecore/content-sdk/blob/386c7f8bd3745fb4187e490efe4dd14be4a48189/packages/nextjs/src/cache/sitecore-page-cache-tags.ts#L66)

***

### path?

> `optional` **path?**: `string`[]

Defined in: [nextjs/src/cache/sitecore-page-cache-tags.ts:76](https://github.com/Sitecore/content-sdk/blob/386c7f8bd3745fb4187e490efe4dd14be4a48189/packages/nextjs/src/cache/sitecore-page-cache-tags.ts#L76)

App Router catch-all segments (e.g. from `[...path]`). Used when `personalizedPathname` is omitted;
normalized the same way as `SitecoreClient.parsePath` for a string array argument.

***

### personalizedPathname?

> `optional` **personalizedPathname?**: `string`

Defined in: [nextjs/src/cache/sitecore-page-cache-tags.ts:71](https://github.com/Sitecore/content-sdk/blob/386c7f8bd3745fb4187e490efe4dd14be4a48189/packages/nextjs/src/cache/sitecore-page-cache-tags.ts#L71)

Path string used for deriving normalized route segments (personalization rewrite segments stripped)
for the route tag. Provide this **or** `path`. When both are set, this value wins.

***

### route?

> `optional` **route?**: [`RouteData`](../interfaces/RouteData.md) \| `null`

Defined in: [nextjs/src/cache/sitecore-page-cache-tags.ts:82](https://github.com/Sitecore/content-sdk/blob/386c7f8bd3745fb4187e490efe4dd14be4a48189/packages/nextjs/src/cache/sitecore-page-cache-tags.ts#L82)

Route node from a Sitecore layout response (e.g. `page.layout.sitecore.route`, which is
`RouteData | null`). Optional because the page may not resolve; only `itemId`, `itemLanguage`,
and `itemVersion` are read when present.

***

### site

> **site**: `string`

Defined in: [nextjs/src/cache/sitecore-page-cache-tags.ts:65](https://github.com/Sitecore/content-sdk/blob/386c7f8bd3745fb4187e490efe4dd14be4a48189/packages/nextjs/src/cache/sitecore-page-cache-tags.ts#L65)
