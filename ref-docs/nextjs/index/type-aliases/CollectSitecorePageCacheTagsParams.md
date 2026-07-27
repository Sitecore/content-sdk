[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / CollectSitecorePageCacheTagsParams

# Type Alias: CollectSitecorePageCacheTagsParams

> **CollectSitecorePageCacheTagsParams** = `object`

Defined in: [nextjs/src/cache/sitecore-page-cache-tags.ts:33](https://github.com/Sitecore/content-sdk/blob/6f8e423028bdf8a74a2fc4b8cb084961d755b73f/packages/nextjs/src/cache/sitecore-page-cache-tags.ts#L33)

Inputs for assembling cache tags for a typical Sitecore page render (`getPage`).

## Properties

### locale

> **locale**: `string`

Defined in: [nextjs/src/cache/sitecore-page-cache-tags.ts:35](https://github.com/Sitecore/content-sdk/blob/6f8e423028bdf8a74a2fc4b8cb084961d755b73f/packages/nextjs/src/cache/sitecore-page-cache-tags.ts#L35)

***

### path?

> `optional` **path?**: `string`

Defined in: [nextjs/src/cache/sitecore-page-cache-tags.ts:39](https://github.com/Sitecore/content-sdk/blob/6f8e423028bdf8a74a2fc4b8cb084961d755b73f/packages/nextjs/src/cache/sitecore-page-cache-tags.ts#L39)

Sitecore route path (e.g. `/about`, `/Not-Found`, or `/` for home). Omit for home.

***

### route?

> `optional` **route?**: [`RouteData`](../interfaces/RouteData.md) \| `null`

Defined in: [nextjs/src/cache/sitecore-page-cache-tags.ts:45](https://github.com/Sitecore/content-sdk/blob/6f8e423028bdf8a74a2fc4b8cb084961d755b73f/packages/nextjs/src/cache/sitecore-page-cache-tags.ts#L45)

Route node from a Sitecore layout response (e.g. `page.layout.sitecore.route`, which is
`RouteData | null`). Optional because the page may not resolve; only `itemId`, `itemLanguage`,
and `itemVersion` are read when present.

***

### site

> **site**: `string`

Defined in: [nextjs/src/cache/sitecore-page-cache-tags.ts:34](https://github.com/Sitecore/content-sdk/blob/6f8e423028bdf8a74a2fc4b8cb084961d755b73f/packages/nextjs/src/cache/sitecore-page-cache-tags.ts#L34)
