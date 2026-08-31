[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderCacheConfig

# Interface: LoaderCacheConfig

Defined in: [packages/angular/src/loaders/models.ts:192](https://github.com/Sitecore/content-sdk/blob/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d/packages/angular/src/loaders/models.ts#L192)

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

Defined in: [packages/angular/src/loaders/models.ts:201](https://github.com/Sitecore/content-sdk/blob/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d/packages/angular/src/loaders/models.ts#L201)

Fallback locale for tag helpers when a site entry has no `language`. Defaults to `'en'`.

***

### defaultSiteName?

> `optional` **defaultSiteName?**: `string`

Defined in: [packages/angular/src/loaders/models.ts:194](https://github.com/Sitecore/content-sdk/blob/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d/packages/angular/src/loaders/models.ts#L194)

Default site name for tag helpers and admin tooling. Defaults to `'default'`.

***

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [packages/angular/src/loaders/models.ts:212](https://github.com/Sitecore/content-sdk/blob/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d/packages/angular/src/loaders/models.ts#L212)

Master switch — when false, every call falls through to the raw loader.

#### Inherited from

[`PerRouteLoaderCacheConfig`](PerRouteLoaderCacheConfig.md).[`enabled`](PerRouteLoaderCacheConfig.md#enabled)

***

### revalidate?

> `optional` **revalidate?**: `number`

Defined in: [packages/angular/src/loaders/models.ts:210](https://github.com/Sitecore/content-sdk/blob/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d/packages/angular/src/loaders/models.ts#L210)

TTL in seconds. Positive → expires after N seconds; `0` or negative → never expires.

#### Inherited from

[`PerRouteLoaderCacheConfig`](PerRouteLoaderCacheConfig.md).[`revalidate`](PerRouteLoaderCacheConfig.md#revalidate)

***

### sites?

> `optional` **sites?**: `string`[]

Defined in: [packages/angular/src/loaders/models.ts:199](https://github.com/Sitecore/content-sdk/blob/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d/packages/angular/src/loaders/models.ts#L199)

Site names used by revalidation middleware to fan out dictionary loader tags
(`sc:loader:dictionary:<site>:<locale>`) on every webhook call.

***

### tags?

> `optional` **tags?**: `string`[]

Defined in: [packages/angular/src/loaders/models.ts:217](https://github.com/Sitecore/content-sdk/blob/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d/packages/angular/src/loaders/models.ts#L217)

Custom tags applied to every entry this loader writes. Merged with built-in
OSR tags (self-key, `sc:site`, `sc:locale`, and `sc:item` for page loaders).

#### Inherited from

[`PerRouteLoaderCacheConfig`](PerRouteLoaderCacheConfig.md).[`tags`](PerRouteLoaderCacheConfig.md#tags)
