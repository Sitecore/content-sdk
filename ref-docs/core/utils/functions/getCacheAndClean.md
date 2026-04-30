[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / getCacheAndClean

# Function: getCacheAndClean()

> **getCacheAndClean**\<`T`\>(`key`): `undefined` \| `T`

Defined in: [packages/core/src/utils/globalCache.ts:40](https://github.com/Sitecore/content-sdk/blob/b60e35951a674bd37f0e92d14d408b5c4c833e41/packages/core/src/utils/globalCache.ts#L40)

**`Internal`**

Retrieves a value from the global cache by key and removes it from the cache.
 - The cache is stored on `globalThis`

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The cache key to retrieve and remove. |

## Returns

`undefined` \| `T`

- The cached value if present, otherwise undefined.
