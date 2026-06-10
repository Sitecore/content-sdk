[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [route-handler](../README.md) / SitecoreRevalidateRouteHandlerOptions

# Type Alias: SitecoreRevalidateRouteHandlerOptions

> **SitecoreRevalidateRouteHandlerOptions** = `object`

Defined in: [nextjs/src/route-handler/sitecore-revalidate-route-handler.ts:39](https://github.com/Sitecore/content-sdk/blob/0325d614f670aabc44a25c7deff996ace6a1fe8c/packages/nextjs/src/route-handler/sitecore-revalidate-route-handler.ts#L39)

Options for [createSitecoreRevalidateRouteHandler](../functions/createSitecoreRevalidateRouteHandler.md).

## Properties

### cacheProfile?

> `optional` **cacheProfile?**: [`RevalidateTagCacheProfile`](RevalidateTagCacheProfile.md)

Defined in: [nextjs/src/route-handler/sitecore-revalidate-route-handler.ts:50](https://github.com/Sitecore/content-sdk/blob/0325d614f670aabc44a25c7deff996ace6a1fe8c/packages/nextjs/src/route-handler/sitecore-revalidate-route-handler.ts#L50)

Next.js `revalidateTag` cache profile (second argument). Default is `"max"` (recommended).
Other string values may match profiles from `cacheLife` in `next.config`; objects may use `{ expire }` per Next.js docs.

***

### defaultLocale?

> `optional` **defaultLocale?**: `string`

Defined in: [nextjs/src/route-handler/sitecore-revalidate-route-handler.ts:55](https://github.com/Sitecore/content-sdk/blob/0325d614f670aabc44a25c7deff996ace6a1fe8c/packages/nextjs/src/route-handler/sitecore-revalidate-route-handler.ts#L55)

Locale for item tags when culture is missing, and for dictionary tags when a site has no language.
Defaults to `'en'` when omitted.

***

### secret?

> `optional` **secret?**: `string`

Defined in: [nextjs/src/route-handler/sitecore-revalidate-route-handler.ts:45](https://github.com/Sitecore/content-sdk/blob/0325d614f670aabc44a25c7deff996ace6a1fe8c/packages/nextjs/src/route-handler/sitecore-revalidate-route-handler.ts#L45)

Shared secret for `POST /api/revalidate`. If omitted, the handler reads `process.env.SITECORE_REVALIDATE_SECRET`.
When a non-empty value is configured (here or via env), callers must send the same value in the
**`x-revalidate-secret`** header. When empty/omitted, revalidation proceeds without that header.

***

### sites?

> `optional` **sites?**: [`SiteInfo`](../../index/type-aliases/SiteInfo.md)[]

Defined in: [nextjs/src/route-handler/sitecore-revalidate-route-handler.ts:60](https://github.com/Sitecore/content-sdk/blob/0325d614f670aabc44a25c7deff996ace6a1fe8c/packages/nextjs/src/route-handler/sitecore-revalidate-route-handler.ts#L60)

Sites list (e.g. from `.sitecore/sites.json`). Adds one `sc:dict:<site>:<locale>` tag per
site on every revalidation call. `generateSites` always includes the configured default site.
