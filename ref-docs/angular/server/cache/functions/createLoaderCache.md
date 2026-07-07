[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/cache](../README.md) / createLoaderCache

# Function: createLoaderCache()

> **createLoaderCache**(`config?`): [`LoaderCache`](../../../loaders/interfaces/LoaderCache.md)

Defined in: [packages/angular/src/server/cache/loader-cache.ts:26](https://github.com/Sitecore/content-sdk/blob/2aa732fd2d36762c97dbe79aef5930e72524bea4/packages/angular/src/server/cache/loader-cache.ts#L26)

Public factory for the loader cache with unstorage backing.
Uses the memory driver by default.

Drivers are best imported and constructed in the app's `server.ts` and passed here as an instance.
Callers depend on the [LoaderCache](../../../loaders/interfaces/LoaderCache.md) interface; concrete classes are not exported.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | [`GlobalLoaderCacheConfig`](../interfaces/GlobalLoaderCacheConfig.md) | Global cache config and optional unstorage driver. |

## Returns

[`LoaderCache`](../../../loaders/interfaces/LoaderCache.md)

Cache implementation with SWR + tag semantics.

## Example

```ts
const cache = createLoaderCache({
  revalidate: config.angular.loadersCache.revalidate,
  enabled: config.angular.loadersCache.enabled,
  defaultSiteName: config.defaultSite,
  driver: fsDriver({ base: './.cache/loaders' }),
});
```
