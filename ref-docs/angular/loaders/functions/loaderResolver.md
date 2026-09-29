[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / loaderResolver

# Function: loaderResolver()

> **loaderResolver**(`loaderId`, `cacheOptions?`): `ResolveFn`\<`unknown`\>

Defined in: [packages/angular/src/loaders/loader-resolver.ts:136](https://github.com/Sitecore/content-sdk/blob/c7801c33fe661bb4b9b6f414c72a29794de8b26a/packages/angular/src/loaders/loader-resolver.ts#L136)

Create a loader resolver function that resolver loader data with optional cache options on server or browser.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `loaderId` | `string` | The loader ID |
| `cacheOptions?` | [`PerRouteLoaderCacheConfig`](../interfaces/PerRouteLoaderCacheConfig.md) | The cache options |

## Returns

`ResolveFn`\<`unknown`\>

loader resolver function
