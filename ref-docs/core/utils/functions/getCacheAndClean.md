[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / getCacheAndClean

# Function: getCacheAndClean()

> **getCacheAndClean**\<`T`\>(`key`): `undefined` \| `T`

Defined in: [packages/core/src/utils/globalCache.ts:40](https://github.com/Sitecore/content-sdk/blob/8f087d4bba725c145aa46cd7e0883f4ab146e82e/packages/core/src/utils/globalCache.ts#L40)

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
