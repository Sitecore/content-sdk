[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/express](../README.md) / ServerLoaderRunner

# Class: ServerLoaderRunner

Defined in: [packages/angular/src/server/server-loader-runner.ts:27](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/server-loader-runner.ts#L27)

Server-side cache aware loader data resolver.
LoaderResolver is exposed to both server and browser. This layer ensures browser safety and acts as connecting layer to cache.

Resolution order when a [LoaderCache](../../../loaders/interfaces/LoaderCache.md) is attached:
1. **hit** — return cached value immediately.
2. **stale** — return cached value immediately and schedule a background refresh
   (coalesced per cache key via `pendingCacheOps`).
3. **miss** — run the loader, persist the result with OSR tags, return data.

Redirect responses are never cached. Per-route LoaderCacheConfig overrides
from `loaderResolver(id, cacheOptions)` control TTL, tags, and opt-in caching when
the global cache is disabled.

## Constructors

### Constructor

> **new ServerLoaderRunner**(`registry`, `cache?`): `ServerLoaderRunner`

Defined in: [packages/angular/src/server/server-loader-runner.ts:35](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/server-loader-runner.ts#L35)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `registry` | [`LoaderRegistry`](../../../loaders/type-aliases/LoaderRegistry.md) | Same loader map as `provideLoaderRegistry` / `/_data` middleware. |
| `cache?` | [`LoaderCache`](../../../loaders/interfaces/LoaderCache.md) | Optional cache instance from createLoaderCache. |

#### Returns

`ServerLoaderRunner`

## Methods

### resolve()

> **resolve**(`request`): `Promise`\<[`LoaderDataResult`](../../../loaders/type-aliases/LoaderDataResult.md)\>

Defined in: [packages/angular/src/server/server-loader-runner.ts:42](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/server-loader-runner.ts#L42)

Resolve loader data with optional cache read-through and SWR refresh.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | [`LoaderPayload`](../../../loaders/type-aliases/LoaderPayload.md) | Loader id, URL, params, optional request context and cache overrides. |

#### Returns

`Promise`\<[`LoaderDataResult`](../../../loaders/type-aliases/LoaderDataResult.md)\>

Data, redirect, or error result for the middleware / SSR resolver.
