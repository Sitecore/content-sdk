[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / SitecoreRevalidateMiddlewareOptions

# Interface: SitecoreRevalidateMiddlewareOptions

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:35](https://github.com/Sitecore/content-sdk/blob/f3401a8f88338ab1fd34e5ea98096e167973633a/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L35)

Options for [createSitecoreRevalidateMiddleware](../functions/createSitecoreRevalidateMiddleware.md).

## Properties

### cache

> **cache**: [`LoaderCache`](../../../loaders/interfaces/LoaderCache.md)

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:37](https://github.com/Sitecore/content-sdk/blob/f3401a8f88338ab1fd34e5ea98096e167973633a/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L37)

Shared cache instance from createLoaderCache call

***

### defaultLocale?

> `optional` **defaultLocale?**: `string`

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:41](https://github.com/Sitecore/content-sdk/blob/f3401a8f88338ab1fd34e5ea98096e167973633a/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L41)

Locale fallback when an update has no `entity_culture`; default `'en'`.

***

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:48](https://github.com/Sitecore/content-sdk/blob/f3401a8f88338ab1fd34e5ea98096e167973633a/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L48)

Endpoint path; default `/api/revalidate`.

***

### secret?

> `optional` **secret?**: `string`

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:39](https://github.com/Sitecore/content-sdk/blob/f3401a8f88338ab1fd34e5ea98096e167973633a/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L39)

Default: `process.env.SITECORE_REVALIDATE_SECRET`

***

### sites?

> `optional` **sites?**: `SiteInfo`[]

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:46](https://github.com/Sitecore/content-sdk/blob/f3401a8f88338ab1fd34e5ea98096e167973633a/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L46)

When set, every webhook also marks stale one
`sc:loader:dictionary:<site>:<locale>` entry per site (dictionary fan-out).
