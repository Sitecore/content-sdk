[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / MultisiteMiddlewareOptions

# Type Alias: MultisiteMiddlewareOptions

> **MultisiteMiddlewareOptions** = [`BaseMiddlewareOptions`](../interfaces/BaseMiddlewareOptions.md) & [`AngularSitecoreConfig`](../../../config/type-aliases/AngularSitecoreConfig.md)\[`"multisite"`\] & `object`

Defined in: [packages/angular/src/server/middleware/multisite-middleware.ts:26](https://github.com/Sitecore/content-sdk/blob/cc697f1b79c7ea3d0da73c83f919cdbb67d0d0c9/packages/angular/src/server/middleware/multisite-middleware.ts#L26)

Configuration options for the multisite middleware.

## Type Declaration

### defaultSite?

> `optional` **defaultSite?**: `string`

Default site to use if no site is resolved

### sites?

> `optional` **sites?**: `SiteInfo`[]

Sites to resolve the site from
