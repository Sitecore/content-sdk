[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / SitecoreRevalidateMiddlewareOptions

# Interface: SitecoreRevalidateMiddlewareOptions

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:34](https://github.com/Sitecore/content-sdk/blob/df0ab91f7e1cc1e11e1d2458da0d151ccdbea3af/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L34)

Options for [createSitecoreRevalidateMiddleware](../functions/createSitecoreRevalidateMiddleware.md).

## Properties

### cache

> **cache**: [`LoaderCache`](../../../loaders/interfaces/LoaderCache.md)

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:36](https://github.com/Sitecore/content-sdk/blob/df0ab91f7e1cc1e11e1d2458da0d151ccdbea3af/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L36)

Shared cache instance from createLoaderCache call

***

### defaultLocale?

> `optional` **defaultLocale?**: `string`

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:40](https://github.com/Sitecore/content-sdk/blob/df0ab91f7e1cc1e11e1d2458da0d151ccdbea3af/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L40)

Locale fallback when an update has no `entity_culture`; default `'en'`.

***

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:48](https://github.com/Sitecore/content-sdk/blob/df0ab91f7e1cc1e11e1d2458da0d151ccdbea3af/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L48)

Endpoint path; default `/api/revalidate`.

***

### secret?

> `optional` **secret?**: `string`

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:38](https://github.com/Sitecore/content-sdk/blob/df0ab91f7e1cc1e11e1d2458da0d151ccdbea3af/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L38)

Default: `process.env.SITECORE_REVALIDATE_SECRET`

***

### sites?

> `optional` **sites?**: `SiteInfo`[]

Defined in: [packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts:46](https://github.com/Sitecore/content-sdk/blob/df0ab91f7e1cc1e11e1d2458da0d151ccdbea3af/packages/angular/src/server/middleware/sitecore-revalidate-middleware.ts#L46)

Sites list (e.g. from `.sitecore/sites.json`), used to resolve which site a Dictionary entry
update (`entity_definition: "DictionaryEntry"`) belongs to, so only that site's
`sc:dict:<site>:<locale>` tag is marked stale instead of every configured site's.
