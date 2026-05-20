[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / getCacheAndClean

# Function: getCacheAndClean()

> **getCacheAndClean**\<`T`\>(`key`): `T` \| `undefined`

Defined in: [packages/core/src/tools/globalCache.ts:40](https://github.com/Sitecore/content-sdk/blob/3b25a6307ef74f6ab7da606ec8b04e5fcb108ad3/packages/core/src/tools/globalCache.ts#L40)

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

`T` \| `undefined`

- The cached value if present, otherwise undefined.
