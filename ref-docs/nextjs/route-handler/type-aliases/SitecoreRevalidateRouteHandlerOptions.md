[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [route-handler](../README.md) / SitecoreRevalidateRouteHandlerOptions

# Type Alias: SitecoreRevalidateRouteHandlerOptions

> **SitecoreRevalidateRouteHandlerOptions** = `object`

Defined in: [nextjs/src/route-handler/sitecore-revalidate-route-handler.ts:40](https://github.com/Sitecore/content-sdk/blob/3966c04d9148447d9abcf751cdefb214d74a9fb3/packages/nextjs/src/route-handler/sitecore-revalidate-route-handler.ts#L40)

Options for [createSitecoreRevalidateRouteHandler](../functions/createSitecoreRevalidateRouteHandler.md).

## Properties

### cacheProfile?

> `optional` **cacheProfile?**: [`RevalidateTagCacheProfile`](RevalidateTagCacheProfile.md)

Defined in: [nextjs/src/route-handler/sitecore-revalidate-route-handler.ts:51](https://github.com/Sitecore/content-sdk/blob/3966c04d9148447d9abcf751cdefb214d74a9fb3/packages/nextjs/src/route-handler/sitecore-revalidate-route-handler.ts#L51)

Next.js `revalidateTag` cache profile (second argument). Default is `"max"` (recommended).
Other string values may match profiles from `cacheLife` in `next.config`; objects may use `{ expire }` per Next.js docs.

***

### defaultLocale?

> `optional` **defaultLocale?**: `string`

Defined in: [nextjs/src/route-handler/sitecore-revalidate-route-handler.ts:56](https://github.com/Sitecore/content-sdk/blob/3966c04d9148447d9abcf751cdefb214d74a9fb3/packages/nextjs/src/route-handler/sitecore-revalidate-route-handler.ts#L56)

Locale for item and dictionary tags when an update omits `entity_culture`.
Defaults to `'en'` when omitted.

***

### secret?

> `optional` **secret?**: `string`

Defined in: [nextjs/src/route-handler/sitecore-revalidate-route-handler.ts:46](https://github.com/Sitecore/content-sdk/blob/3966c04d9148447d9abcf751cdefb214d74a9fb3/packages/nextjs/src/route-handler/sitecore-revalidate-route-handler.ts#L46)

Shared secret for `POST /api/revalidate`. If omitted, the handler reads `process.env.SITECORE_REVALIDATE_SECRET`.
When a non-empty value is configured (here or via env), callers must send the same value in the
**`x-revalidate-secret`** header. When empty/omitted, revalidation proceeds without that header.

***

### sites?

> `optional` **sites?**: [`SiteInfo`](../../index/type-aliases/SiteInfo.md)[]

Defined in: [nextjs/src/route-handler/sitecore-revalidate-route-handler.ts:63](https://github.com/Sitecore/content-sdk/blob/3966c04d9148447d9abcf751cdefb214d74a9fb3/packages/nextjs/src/route-handler/sitecore-revalidate-route-handler.ts#L63)

Sites list (e.g. from `.sitecore/sites.json`), used to resolve which site a Dictionary entry
update (`entity_definition: "DictionaryEntry"`) belongs to, so only that site's
`sc:dict:<site>:<locale>` tag is revalidated instead of every configured site's. `generateSites`
always includes the configured default site.
