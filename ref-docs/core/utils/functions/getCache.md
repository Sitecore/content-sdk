[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / getCache

# Function: getCache()

> **getCache**\<`T`\>(`key`): `undefined` \| `T`

Defined in: [packages/core/src/utils/globalCache.ts:28](https://github.com/Sitecore/content-sdk/blob/3ca8429b451816c5b357bf7ad37b7b8d995cee29/packages/core/src/utils/globalCache.ts#L28)

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
