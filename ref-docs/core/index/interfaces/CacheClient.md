[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / CacheClient

# Interface: CacheClient\<T\>

Defined in: [packages/core/src/cache-client.ts:8](https://github.com/Sitecore/content-sdk/blob/5a2b53f287cd025776a323be304373d0219e574a/packages/core/src/cache-client.ts#L8)

An interface for cache clients.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of data being cached. |

## Methods

### getCacheValue()

> **getCacheValue**(`key`): `T` \| `null`

Defined in: [packages/core/src/cache-client.ts:22](https://github.com/Sitecore/content-sdk/blob/5a2b53f287cd025776a323be304373d0219e574a/packages/core/src/cache-client.ts#L22)

Retrieves a value from the cache.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The cache key. |

#### Returns

`T` \| `null`

The cache value as {T}, or null if the specified key was not found in the cache.

***

### setCacheValue()

> **setCacheValue**(`key`, `value`): `T`

Defined in: [packages/core/src/cache-client.ts:15](https://github.com/Sitecore/content-sdk/blob/5a2b53f287cd025776a323be304373d0219e574a/packages/core/src/cache-client.ts#L15)

Adds a value to the cache for the specified cache key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The cache key. |
| `value` | `T` | The value to cache. |

#### Returns

`T`

The value added to the cache.
