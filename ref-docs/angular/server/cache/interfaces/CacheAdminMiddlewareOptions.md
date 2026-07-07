[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/cache](../README.md) / CacheAdminMiddlewareOptions

# Interface: CacheAdminMiddlewareOptions

Defined in: [packages/angular/src/server/cache/demo/cache-admin-middleware.ts:18](https://github.com/Sitecore/content-sdk/blob/2aa732fd2d36762c97dbe79aef5930e72524bea4/packages/angular/src/server/cache/demo/cache-admin-middleware.ts#L18)

Options for the admin middleware.

## Properties

### auth?

> `optional` **auth?**: (`req`) => `boolean`

Defined in: [packages/angular/src/server/cache/demo/cache-admin-middleware.ts:27](https://github.com/Sitecore/content-sdk/blob/2aa732fd2d36762c97dbe79aef5930e72524bea4/packages/angular/src/server/cache/demo/cache-admin-middleware.ts#L27)

Optional auth gate. Return true to allow. Defaults to allowing everything,
which is fine for local demos — *do not* leave that default in a deploy.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | [`ExpressRequest`](../../middleware/interfaces/ExpressRequest.md) |

#### Returns

`boolean`

***

### cache

> **cache**: [`LoaderCache`](../../../loaders/interfaces/LoaderCache.md)

Defined in: [packages/angular/src/server/cache/demo/cache-admin-middleware.ts:20](https://github.com/Sitecore/content-sdk/blob/2aa732fd2d36762c97dbe79aef5930e72524bea4/packages/angular/src/server/cache/demo/cache-admin-middleware.ts#L20)

The cache instance to expose. Capture once in `server.ts`.

***

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/angular/src/server/cache/demo/cache-admin-middleware.ts:22](https://github.com/Sitecore/content-sdk/blob/2aa732fd2d36762c97dbe79aef5930e72524bea4/packages/angular/src/server/cache/demo/cache-admin-middleware.ts#L22)

Base path. Defaults to `/api/_cache`.
