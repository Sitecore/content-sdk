[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / CacheClient

# Interface: CacheClient\<T\>

<<<<<<< HEAD
Defined in: [packages/core/src/cache-client.ts:7](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/cache-client.ts#L7)
=======
Defined in: [packages/core/src/cache-client.ts:7](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/cache-client.ts#L7)
>>>>>>> dd686bb50 (Update API docs)

An interface for cache clients.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of data being cached. |

## Methods

### getCacheValue()

> **getCacheValue**(`key`): `null` \| `T`

<<<<<<< HEAD
Defined in: [packages/core/src/cache-client.ts:21](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/cache-client.ts#L21)
=======
Defined in: [packages/core/src/cache-client.ts:21](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/cache-client.ts#L21)
>>>>>>> dd686bb50 (Update API docs)

Retrieves a value from the cache.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The cache key. |

#### Returns

`null` \| `T`

The cache value as {T}, or null if the specified key was not found in the cache.

***

### setCacheValue()

> **setCacheValue**(`key`, `value`): `T`

<<<<<<< HEAD
Defined in: [packages/core/src/cache-client.ts:14](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/cache-client.ts#L14)
=======
Defined in: [packages/core/src/cache-client.ts:14](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/cache-client.ts#L14)
>>>>>>> dd686bb50 (Update API docs)

Adds a value to the cache for the specified cache key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The cache key. |
| `value` | `T` | The value to cache. |

#### Returns

`T`

The value added to the cache.
