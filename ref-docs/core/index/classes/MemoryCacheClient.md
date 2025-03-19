[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / MemoryCacheClient

# Class: MemoryCacheClient\<T\>

Defined in: [packages/core/src/cache-client.ts:54](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/core/src/cache-client.ts#L54)

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

### new MemoryCacheClient()

> **new MemoryCacheClient**\<`T`\>(`options`): [`MemoryCacheClient`](MemoryCacheClient.md)\<`T`\>

Defined in: [packages/core/src/cache-client.ts:61](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/core/src/cache-client.ts#L61)

Initializes a new instance of

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`CacheOptions`](../interfaces/CacheOptions.md) | Configuration options |

#### Returns

[`MemoryCacheClient`](MemoryCacheClient.md)\<`T`\>

#### See

 - MemoryCacheClient using the provided
 - CacheOptions

## Properties

### options

> **options**: [`CacheOptions`](../interfaces/CacheOptions.md)

Defined in: [packages/core/src/cache-client.ts:61](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/core/src/cache-client.ts#L61)

Configuration options

## Methods

### getCacheValue()

> **getCacheValue**(`key`): `null` \| `T`

Defined in: [packages/core/src/cache-client.ts:77](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/core/src/cache-client.ts#L77)

Retrieves a value from the cache.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The cache key. |

#### Returns

`null` \| `T`

The cache value as {T}, or null if the specified key is not found in the cache.

#### Implementation of

[`CacheClient`](../interfaces/CacheClient.md).[`getCacheValue`](../interfaces/CacheClient.md#getcachevalue)

***

### setCacheValue()

> **setCacheValue**(`key`, `value`): `T`

Defined in: [packages/core/src/cache-client.ts:88](https://github.com/Sitecore/xmc-jss-dev/blob/d118c3d87d535fa4161627b881481e84f583140c/packages/core/src/cache-client.ts#L88)

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
