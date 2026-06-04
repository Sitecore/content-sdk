[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / PerRouteLoaderCacheConfig

# Interface: PerRouteLoaderCacheConfig

Defined in: [packages/angular/src/loaders/models.ts:181](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/loaders/models.ts#L181)

Per-route cache configuration.

## Extended by

- [`LoaderCacheConfig`](LoaderCacheConfig.md)

## Properties

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [packages/angular/src/loaders/models.ts:185](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/loaders/models.ts#L185)

Master switch — when false, every call falls through to the raw loader.

***

### revalidate?

> `optional` **revalidate?**: `number`

Defined in: [packages/angular/src/loaders/models.ts:183](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/loaders/models.ts#L183)

TTL in seconds. Positive → expires after N seconds; `0` or negative → never expires.

***

### tags?

> `optional` **tags?**: `string`[]

Defined in: [packages/angular/src/loaders/models.ts:190](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/loaders/models.ts#L190)

Custom tags applied to every entry this loader writes. Merged with built-in
OSR tags (self-key, `sc:site`, `sc:locale`, and `sc:item` for page loaders).
