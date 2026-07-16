[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/cache](../README.md) / createCacheAdminMiddleware

# Function: createCacheAdminMiddleware()

> **createCacheAdminMiddleware**(`options`): [`ExpressMiddleware`](../../middleware/type-aliases/ExpressMiddleware.md)

Defined in: [packages/angular/src/server/cache/demo/cache-admin-middleware.ts:40](https://github.com/Sitecore/content-sdk/blob/5ecdcaf8b7fae916353dcb4b755a48712bde6ab7/packages/angular/src/server/cache/demo/cache-admin-middleware.ts#L40)

Lightweight admin surface for the loader cache:
  GET    <endpoint>/entries        → list entries (metadata only, no values)
  POST   <endpoint>/invalidate     → mark stale by tags (JSON body)
  POST   <endpoint>/flush          → flush every entry
  GET    <endpoint>/config         → resolved config (for the demo UI)

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`CacheAdminMiddlewareOptions`](../interfaces/CacheAdminMiddlewareOptions.md) |

## Returns

[`ExpressMiddleware`](../../middleware/type-aliases/ExpressMiddleware.md)
