[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / PerRouteLoaderCacheConfig

# Interface: PerRouteLoaderCacheConfig

Defined in: [packages/angular/src/loaders/models.ts:205](https://github.com/Sitecore/content-sdk/blob/07c6169d94098a2bc2f491ef61de4d253b52b098/packages/angular/src/loaders/models.ts#L205)

Per-route cache configuration.

## Extended by

- [`LoaderCacheConfig`](LoaderCacheConfig.md)

## Properties

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [packages/angular/src/loaders/models.ts:209](https://github.com/Sitecore/content-sdk/blob/07c6169d94098a2bc2f491ef61de4d253b52b098/packages/angular/src/loaders/models.ts#L209)

Master switch — when false, every call falls through to the raw loader.

***

### revalidate?

> `optional` **revalidate?**: `number`

Defined in: [packages/angular/src/loaders/models.ts:207](https://github.com/Sitecore/content-sdk/blob/07c6169d94098a2bc2f491ef61de4d253b52b098/packages/angular/src/loaders/models.ts#L207)

TTL in seconds. Positive → expires after N seconds; `0` or negative → never expires.

***

### tags?

> `optional` **tags?**: `string`[]

Defined in: [packages/angular/src/loaders/models.ts:214](https://github.com/Sitecore/content-sdk/blob/07c6169d94098a2bc2f491ef61de4d253b52b098/packages/angular/src/loaders/models.ts#L214)

Custom tags applied to every entry this loader writes. Merged with built-in
OSR tags (self-key, `sc:site`, `sc:locale`, and `sc:item` for page loaders).
