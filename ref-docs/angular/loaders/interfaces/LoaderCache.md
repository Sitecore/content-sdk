[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderCache

# Interface: LoaderCache

Defined in: [packages/angular/src/loaders/models.ts:281](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/models.ts#L281)

Server-only cache instance. Constructed once in `server.ts` via
`createLoaderCache` (see `server/cache`) and passed by reference to middleware factories
(`createLoaderDataServiceMiddleware`, `createCacheAdminMiddleware`,
`createSitecoreRevalidateMiddleware`; see `server/middleware`) and to Angular SSR through
`angularApp.handle(req, { cache })`.

Implementations maintain a sidecar tag index so `LoaderCache.invalidate`
can mark entries stale without scanning every key.

## Accessors

### config

#### Get Signature

> **get** **config**(): `Readonly`\<[`LoaderCacheConfig`](LoaderCacheConfig.md)\>

Defined in: [packages/angular/src/loaders/models.ts:285](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/models.ts#L285)

Resolved configuration (useful for admin UI and diagnostics).

##### Returns

`Readonly`\<[`LoaderCacheConfig`](LoaderCacheConfig.md)\>

***

### ttl

#### Get Signature

> **get** **ttl**(): `number`

Defined in: [packages/angular/src/loaders/models.ts:283](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/models.ts#L283)

Global default TTL in seconds from [LoaderCacheConfig.revalidate](PerRouteLoaderCacheConfig.md#revalidate).

##### Returns

`number`

## Methods

### delete()

> **delete**(`key`): `Promise`\<`boolean`\>

Defined in: [packages/angular/src/loaders/models.ts:306](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/models.ts#L306)

Removes a single entry and unlinks it from the tag index.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`Promise`\<`boolean`\>

***

### enabled()

> **enabled**(): `boolean`

Defined in: [packages/angular/src/loaders/models.ts:312](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/models.ts#L312)

Whether caching is enabled globally. Per-route overrides may still opt in.

#### Returns

`boolean`

***

### entries()

> **entries**(): `Promise`\<[`LoaderCacheEntryInfo`](LoaderCacheEntryInfo.md)[]\>

Defined in: [packages/angular/src/loaders/models.ts:310](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/models.ts#L310)

Returns lightweight metadata for admin tooling (values are omitted).

#### Returns

`Promise`\<[`LoaderCacheEntryInfo`](LoaderCacheEntryInfo.md)[]\>

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [packages/angular/src/loaders/models.ts:308](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/models.ts#L308)

Removes every entry and clears the tag index.

#### Returns

`Promise`\<`void`\>

***

### get()

> **get**(`key`): `Promise`\<[`LoaderCacheReadResult`](../type-aliases/LoaderCacheReadResult.md)\>

Defined in: [packages/angular/src/loaders/models.ts:290](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/models.ts#L290)

Reads a cache entry and classifies it as hit, stale, or miss.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | OSR-aligned cache key (for example `sc:loader:page:demo:en:default:about`). |

#### Returns

`Promise`\<[`LoaderCacheReadResult`](../type-aliases/LoaderCacheReadResult.md)\>

***

### invalidate()

> **invalidate**(`filter`): `Promise`\<`number`\>

Defined in: [packages/angular/src/loaders/models.ts:304](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/models.ts#L304)

Marks every entry linked to any of the supplied tags as stale.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `filter` | [`InvalidateInput`](InvalidateInput.md) | Tag list to resolve through the tag index. |

#### Returns

`Promise`\<`number`\>

Number of entries marked stale (includes entries already stale).

***

### set()

> **set**(`key`, `value`, `ttlSeconds`, `tags`): `Promise`\<`void`\>

Defined in: [packages/angular/src/loaders/models.ts:298](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/models.ts#L298)

Stores an entry and links it to the supplied tag set.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | Cache key to write. |
| `value` | `unknown` | Loader payload to persist. |
| `ttlSeconds` | `number` | TTL in seconds; `0` or negative means never expire. |
| `tags` | `string`[] | Tag index pointers written alongside the entry (self-key, site, locale, item, etc.). |

#### Returns

`Promise`\<`void`\>
