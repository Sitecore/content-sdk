[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / loaderResolver

# Function: loaderResolver()

> **loaderResolver**(`loaderId`, `cacheOptions?`): `ResolveFn`\<`unknown`\>

Defined in: [packages/angular/src/loaders/loader-resolver.ts:136](https://github.com/Sitecore/content-sdk/blob/b124678d1f36578713f38271906f1e3a623ad001/packages/angular/src/loaders/loader-resolver.ts#L136)

Create a loader resolver function that resolver loader data with optional cache options on server or browser.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `loaderId` | `string` | The loader ID |
| `cacheOptions?` | [`PerRouteLoaderCacheConfig`](../interfaces/PerRouteLoaderCacheConfig.md) | The cache options |

## Returns

`ResolveFn`\<`unknown`\>

loader resolver function
