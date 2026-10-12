[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / MultisiteMiddlewareOptions

# Type Alias: MultisiteMiddlewareOptions

> **MultisiteMiddlewareOptions** = [`BaseMiddlewareOptions`](../interfaces/BaseMiddlewareOptions.md) & [`AngularSitecoreConfig`](../../../config/type-aliases/AngularSitecoreConfig.md)\[`"multisite"`\] & `object`

Defined in: [packages/angular/src/server/middleware/multisite-middleware.ts:26](https://github.com/Sitecore/content-sdk/blob/d153ea0b9ebac2083b9f58f493cfe6e81e7b4fb0/packages/angular/src/server/middleware/multisite-middleware.ts#L26)

Configuration options for the multisite middleware.

## Type Declaration

### defaultSite?

> `optional` **defaultSite?**: `string`

Default site to use if no site is resolved

### sites?

> `optional` **sites?**: `SiteInfo`[]

Sites to resolve the site from
