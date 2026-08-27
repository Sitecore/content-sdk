[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / RedirectsMiddlewareOptions

# Type Alias: RedirectsMiddlewareOptions

> **RedirectsMiddlewareOptions** = [`BaseMiddlewareOptions`](../interfaces/BaseMiddlewareOptions.md) & `Partial`\<[`AngularSitecoreConfig`](../../../config/type-aliases/AngularSitecoreConfig.md)\[`"api"`\]\[`"edge"`\]\> & `Partial`\<[`AngularSitecoreConfig`](../../../config/type-aliases/AngularSitecoreConfig.md)\[`"api"`\]\[`"local"`\]\> & [`AngularSitecoreConfig`](../../../config/type-aliases/AngularSitecoreConfig.md)\[`"redirects"`\] & `Pick`\<[`AngularSitecoreConfig`](../../../config/type-aliases/AngularSitecoreConfig.md)\[`"angular"`\], `"locales"`\> & `object`

Defined in: [packages/angular/src/server/middleware/redirects-middleware.ts:38](https://github.com/Sitecore/content-sdk/blob/b0823f3a364598af8034e451448160c20b885d18/packages/angular/src/server/middleware/redirects-middleware.ts#L38)

Configuration for the redirects middleware.

## Type Declaration

### defaultLanguage?

> `optional` **defaultLanguage?**: `string`

Fallback language when the request path has no locale prefix. Default is `'en'`.

### defaultSite?

> `optional` **defaultSite?**: `string`

Fallback site name when not resolved by the multisite middleware or site cookie.

### redirectsService?

> `optional` **redirectsService?**: `RedirectsService`

Override the redirects service instance (e.g. for testing).

### sites?

> `optional` **sites?**: `SiteInfo`[]

Sites used to resolve the site's default language for the `$siteLang` token.
