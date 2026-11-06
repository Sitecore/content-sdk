[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / getCache

# Function: getCache()

> **getCache**\<`T`\>(`key`): `undefined` \| `T`

Defined in: [packages/core/src/utils/globalCache.ts:28](https://github.com/Sitecore/content-sdk/blob/bf1778855be199e9ff2d9c4f99717b45b5cfbcf4/packages/core/src/utils/globalCache.ts#L28)

**`Internal`**

Retrieves a value from the global cache by key.
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
