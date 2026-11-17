[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / loaderResolver

# Function: loaderResolver()

> **loaderResolver**(`loaderId`, `cacheOptions?`): `ResolveFn`\<`unknown`\>

Defined in: [packages/angular/src/loaders/loader-resolver.ts:136](https://github.com/Sitecore/content-sdk/blob/5f550df58daa0752bc0119549b277b24b2048b1f/packages/angular/src/loaders/loader-resolver.ts#L136)

Create a loader resolver function that resolver loader data with optional cache options on server or browser.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `loaderId` | `string` | The loader ID |
| `cacheOptions?` | [`PerRouteLoaderCacheConfig`](../interfaces/PerRouteLoaderCacheConfig.md) | The cache options |

## Returns

`ResolveFn`\<`unknown`\>

loader resolver function
