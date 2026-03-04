[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / MemoryCacheClient

# Class: MemoryCacheClient\<T\>

Defined in: [packages/core/src/cache-client.ts:57](https://github.com/Sitecore/content-sdk/blob/dca81790520720d9e179a738163a316f911b36d8/packages/core/src/cache-client.ts#L57)

A cache client that uses the 'memory-cache' library (https://github.com/ptarjan/node-cache).
This class is meant to be extended or used as a mixin; it's not meant to be used directly.

## Mixin

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of data being cached. |

## Implements

- [`CacheClient`](../interfaces/CacheClient.md)\<`T`\>

## Constructors

### Constructor

> **new MemoryCacheClient**\<`T`\>(`options`): `MemoryCacheClient`\<`T`\>

Defined in: [packages/core/src/cache-client.ts:64](https://github.com/Sitecore/content-sdk/blob/dca81790520720d9e179a738163a316f911b36d8/packages/core/src/cache-client.ts#L64)

Initializes a new instance of

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`CacheOptions`](../interfaces/CacheOptions.md) | Configuration options |

#### Returns

`MemoryCacheClient`\<`T`\>

#### See

 - MemoryCacheClient using the provided
 - CacheOptions

## Properties

### options

> **options**: [`CacheOptions`](../interfaces/CacheOptions.md)

Defined in: [packages/core/src/cache-client.ts:64](https://github.com/Sitecore/content-sdk/blob/dca81790520720d9e179a738163a316f911b36d8/packages/core/src/cache-client.ts#L64)

Configuration options

## Methods

### getCacheValue()

> **getCacheValue**(`key`): `T` \| `null`

Defined in: [packages/core/src/cache-client.ts:80](https://github.com/Sitecore/content-sdk/blob/dca81790520720d9e179a738163a316f911b36d8/packages/core/src/cache-client.ts#L80)

Retrieves a value from the cache.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The cache key. |

#### Returns

`T` \| `null`

The cache value as {T}, or null if the specified key is not found in the cache.

#### Implementation of

[`CacheClient`](../interfaces/CacheClient.md).[`getCacheValue`](../interfaces/CacheClient.md#getcachevalue)

***

### setCacheValue()

> **setCacheValue**(`key`, `value`): `T`

Defined in: [packages/core/src/cache-client.ts:91](https://github.com/Sitecore/content-sdk/blob/dca81790520720d9e179a738163a316f911b36d8/packages/core/src/cache-client.ts#L91)

Adds a value to the cache for the specified cache key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The cache key. |
| `value` | `T` | The value to cache. |

#### Returns

`T`

The value added to the cache.

#### Implementation of

[`CacheClient`](../interfaces/CacheClient.md).[`setCacheValue`](../interfaces/CacheClient.md#setcachevalue)
