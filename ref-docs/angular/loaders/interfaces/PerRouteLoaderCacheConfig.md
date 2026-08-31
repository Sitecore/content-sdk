[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / PerRouteLoaderCacheConfig

# Interface: PerRouteLoaderCacheConfig

Defined in: [packages/angular/src/loaders/models.ts:208](https://github.com/Sitecore/content-sdk/blob/6320ef720fd2c837d6aad938ce6e7c5806cb2aa6/packages/angular/src/loaders/models.ts#L208)

Per-route cache configuration.

## Extended by

- [`LoaderCacheConfig`](LoaderCacheConfig.md)

## Properties

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [packages/angular/src/loaders/models.ts:212](https://github.com/Sitecore/content-sdk/blob/6320ef720fd2c837d6aad938ce6e7c5806cb2aa6/packages/angular/src/loaders/models.ts#L212)

Master switch — when false, every call falls through to the raw loader.

***

### revalidate?

> `optional` **revalidate?**: `number`

Defined in: [packages/angular/src/loaders/models.ts:210](https://github.com/Sitecore/content-sdk/blob/6320ef720fd2c837d6aad938ce6e7c5806cb2aa6/packages/angular/src/loaders/models.ts#L210)

TTL in seconds. Positive → expires after N seconds; `0` or negative → never expires.

***

### tags?

> `optional` **tags?**: `string`[]

Defined in: [packages/angular/src/loaders/models.ts:217](https://github.com/Sitecore/content-sdk/blob/6320ef720fd2c837d6aad938ce6e7c5806cb2aa6/packages/angular/src/loaders/models.ts#L217)

Custom tags applied to every entry this loader writes. Merged with built-in
OSR tags (self-key, `sc:site`, `sc:locale`, and `sc:item` for page loaders).
