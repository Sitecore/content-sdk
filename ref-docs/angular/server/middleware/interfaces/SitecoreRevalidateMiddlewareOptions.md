[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / SitecoreRevalidateMiddlewareOptions

# Interface: SitecoreRevalidateMiddlewareOptions

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:35](https://github.com/Sitecore/content-sdk/blob/5f3a752c70ee72724112f3ed87925efaf43205a5/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L35)

Options for [createSitecoreRevalidateMiddleware](../functions/createSitecoreRevalidateMiddleware.md).

## Properties

### cache

> **cache**: [`LoaderCache`](../../../loaders/interfaces/LoaderCache.md)

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:37](https://github.com/Sitecore/content-sdk/blob/5f3a752c70ee72724112f3ed87925efaf43205a5/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L37)

Shared cache instance from createLoaderCache call

***

### defaultLocale?

> `optional` **defaultLocale?**: `string`

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:41](https://github.com/Sitecore/content-sdk/blob/5f3a752c70ee72724112f3ed87925efaf43205a5/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L41)

Locale fallback when an update has no `entity_culture`; default `'en'`.

***

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:49](https://github.com/Sitecore/content-sdk/blob/5f3a752c70ee72724112f3ed87925efaf43205a5/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L49)

Endpoint path; default `/api/revalidate`.

***

### secret?

> `optional` **secret?**: `string`

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:39](https://github.com/Sitecore/content-sdk/blob/5f3a752c70ee72724112f3ed87925efaf43205a5/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L39)

Default: `process.env.SITECORE_REVALIDATE_SECRET`

***

### sites?

> `optional` **sites?**: `SiteInfo`[]

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:47](https://github.com/Sitecore/content-sdk/blob/5f3a752c70ee72724112f3ed87925efaf43205a5/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L47)

Sites list (e.g. from `.sitecore/sites.json`), used to resolve which site a Dictionary entry
update (`entity_definition: "DictionaryEntry"`) belongs to, so only that site's
`sc:dict:<site>:<locale>` tag is marked stale instead of every configured site's.
