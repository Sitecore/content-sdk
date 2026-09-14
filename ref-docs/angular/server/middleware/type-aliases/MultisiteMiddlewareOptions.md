[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / MultisiteMiddlewareOptions

# Type Alias: MultisiteMiddlewareOptions

> **MultisiteMiddlewareOptions** = [`BaseMiddlewareOptions`](../interfaces/BaseMiddlewareOptions.md) & [`AngularSitecoreConfig`](../../../config/type-aliases/AngularSitecoreConfig.md)\[`"multisite"`\] & `object`

Defined in: [packages/angular/src/server/middleware/multisite-middleware.ts:26](https://github.com/Sitecore/content-sdk/blob/b858df1f6f27c4f7a00a2d33c81c5e5233790233/packages/angular/src/server/middleware/multisite-middleware.ts#L26)

Configuration options for the multisite middleware.

## Type Declaration

### defaultSite?

> `optional` **defaultSite?**: `string`

Default site to use if no site is resolved

### sites?

> `optional` **sites?**: `SiteInfo`[]

Sites to resolve the site from
