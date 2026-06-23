[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/cache](../README.md) / createCacheAdminMiddleware

# Function: createCacheAdminMiddleware()

> **createCacheAdminMiddleware**(`options`): [`ExpressMiddleware`](../../middleware/type-aliases/ExpressMiddleware.md)

Defined in: [packages/angular/src/server/cache/demo/cache-admin-middleware.ts:40](https://github.com/Sitecore/content-sdk/blob/0e7dce683a0be4b8942bf4dc050856cd3c28ba07/packages/angular/src/server/cache/demo/cache-admin-middleware.ts#L40)

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
