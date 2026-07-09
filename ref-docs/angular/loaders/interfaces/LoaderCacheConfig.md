[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderCacheConfig

# Interface: LoaderCacheConfig

Defined in: [packages/angular/src/loaders/models.ts:189](https://github.com/Sitecore/content-sdk/blob/a45363382ef21e6ca947808e5b980aa4f1721e36/packages/angular/src/loaders/models.ts#L189)

Base browser-safe config type for loader cache.

`revalidate` is in seconds. A positive value caches the entry for that many
seconds; `0` or a negative value means "never expire" (rely on explicit
invalidation). There is no `'infinite'` sentinel.

## Extends

- [`PerRouteLoaderCacheConfig`](PerRouteLoaderCacheConfig.md)

## Extended by

- [`GlobalLoaderCacheConfig`](../../server/cache/interfaces/GlobalLoaderCacheConfig.md)

## Properties

### defaultLocale?

> `optional` **defaultLocale?**: `string`

Defined in: [packages/angular/src/loaders/models.ts:198](https://github.com/Sitecore/content-sdk/blob/a45363382ef21e6ca947808e5b980aa4f1721e36/packages/angular/src/loaders/models.ts#L198)

Fallback locale for tag helpers when a site entry has no `language`. Defaults to `'en'`.

***

### defaultSiteName?

> `optional` **defaultSiteName?**: `string`

Defined in: [packages/angular/src/loaders/models.ts:191](https://github.com/Sitecore/content-sdk/blob/a45363382ef21e6ca947808e5b980aa4f1721e36/packages/angular/src/loaders/models.ts#L191)

Default site name for tag helpers and admin tooling. Defaults to `'default'`.

***

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [packages/angular/src/loaders/models.ts:209](https://github.com/Sitecore/content-sdk/blob/a45363382ef21e6ca947808e5b980aa4f1721e36/packages/angular/src/loaders/models.ts#L209)

Master switch — when false, every call falls through to the raw loader.

#### Inherited from

[`PerRouteLoaderCacheConfig`](PerRouteLoaderCacheConfig.md).[`enabled`](PerRouteLoaderCacheConfig.md#enabled)

***

### revalidate?

> `optional` **revalidate?**: `number`

Defined in: [packages/angular/src/loaders/models.ts:207](https://github.com/Sitecore/content-sdk/blob/a45363382ef21e6ca947808e5b980aa4f1721e36/packages/angular/src/loaders/models.ts#L207)

TTL in seconds. Positive → expires after N seconds; `0` or negative → never expires.

#### Inherited from

[`PerRouteLoaderCacheConfig`](PerRouteLoaderCacheConfig.md).[`revalidate`](PerRouteLoaderCacheConfig.md#revalidate)

***

### sites?

> `optional` **sites?**: `string`[]

Defined in: [packages/angular/src/loaders/models.ts:196](https://github.com/Sitecore/content-sdk/blob/a45363382ef21e6ca947808e5b980aa4f1721e36/packages/angular/src/loaders/models.ts#L196)

Site names used by revalidation middleware to fan out dictionary loader tags
(`sc:loader:dictionary:<site>:<locale>`) on every webhook call.

***

### tags?

> `optional` **tags?**: `string`[]

Defined in: [packages/angular/src/loaders/models.ts:214](https://github.com/Sitecore/content-sdk/blob/a45363382ef21e6ca947808e5b980aa4f1721e36/packages/angular/src/loaders/models.ts#L214)

Custom tags applied to every entry this loader writes. Merged with built-in
OSR tags (self-key, `sc:site`, `sc:locale`, and `sc:item` for page loaders).

#### Inherited from

[`PerRouteLoaderCacheConfig`](PerRouteLoaderCacheConfig.md).[`tags`](PerRouteLoaderCacheConfig.md#tags)
