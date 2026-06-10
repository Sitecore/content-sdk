[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/cache](../README.md) / GlobalLoaderCacheConfig

# Interface: GlobalLoaderCacheConfig

Defined in: [packages/angular/src/server/cache/models.ts:36](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/server/cache/models.ts#L36)

Global config for the loader cache. Consumed by `createLoaderCache()` in
the app's `server.ts`.

Moved to separate file to avoid accidental `unstorage` imports in browser-safe code.

Drivers are imported and instantiated in the app (e.g.
`fsDriver({ base: './.cache/loaders' })`) — the package does not own driver
selection. When `driver` is omitted, the cache falls back to its built-in
in-memory implementation.

## Extends

- [`LoaderCacheConfig`](../../../loaders/interfaces/LoaderCacheConfig.md)

## Properties

### defaultLocale?

> `optional` **defaultLocale?**: `string`

Defined in: [packages/angular/src/loaders/models.ts:174](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/loaders/models.ts#L174)

Fallback locale for tag helpers when a site entry has no `language`. Defaults to `'en'`.

#### Inherited from

[`LoaderCacheConfig`](../../../loaders/interfaces/LoaderCacheConfig.md).[`defaultLocale`](../../../loaders/interfaces/LoaderCacheConfig.md#defaultlocale)

***

### defaultSiteName?

> `optional` **defaultSiteName?**: `string`

Defined in: [packages/angular/src/loaders/models.ts:167](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/loaders/models.ts#L167)

Default site name for tag helpers and admin tooling. Defaults to `'default'`.

#### Inherited from

[`LoaderCacheConfig`](../../../loaders/interfaces/LoaderCacheConfig.md).[`defaultSiteName`](../../../loaders/interfaces/LoaderCacheConfig.md#defaultsitename)

***

### driver?

> `optional` **driver?**: `Driver`\<`any`, `any`\>

Defined in: [packages/angular/src/server/cache/models.ts:41](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/server/cache/models.ts#L41)

Unstorage `Driver` instance. Pass an imported driver — the cache wraps it
with `createStorage({ driver })` internally. Omit for the in-memory default.

***

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [packages/angular/src/loaders/models.ts:185](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/loaders/models.ts#L185)

Master switch — when false, every call falls through to the raw loader.

#### Inherited from

[`LoaderCacheConfig`](../../../loaders/interfaces/LoaderCacheConfig.md).[`enabled`](../../../loaders/interfaces/LoaderCacheConfig.md#enabled)

***

### revalidate?

> `optional` **revalidate?**: `number`

Defined in: [packages/angular/src/loaders/models.ts:183](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/loaders/models.ts#L183)

TTL in seconds. Positive → expires after N seconds; `0` or negative → never expires.

#### Inherited from

[`LoaderCacheConfig`](../../../loaders/interfaces/LoaderCacheConfig.md).[`revalidate`](../../../loaders/interfaces/LoaderCacheConfig.md#revalidate)

***

### sites?

> `optional` **sites?**: `string`[]

Defined in: [packages/angular/src/loaders/models.ts:172](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/loaders/models.ts#L172)

Site names used by revalidation middleware to fan out dictionary loader tags
(`sc:loader:dictionary:<site>:<locale>`) on every webhook call.

#### Inherited from

[`LoaderCacheConfig`](../../../loaders/interfaces/LoaderCacheConfig.md).[`sites`](../../../loaders/interfaces/LoaderCacheConfig.md#sites)

***

### tags?

> `optional` **tags?**: `string`[]

Defined in: [packages/angular/src/loaders/models.ts:190](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/loaders/models.ts#L190)

Custom tags applied to every entry this loader writes. Merged with built-in
OSR tags (self-key, `sc:site`, `sc:locale`, and `sc:item` for page loaders).

#### Inherited from

[`LoaderCacheConfig`](../../../loaders/interfaces/LoaderCacheConfig.md).[`tags`](../../../loaders/interfaces/LoaderCacheConfig.md#tags)
