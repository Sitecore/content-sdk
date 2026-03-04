[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / getCache

# Function: getCache()

> **getCache**\<`T`\>(`key`): `T` \| `undefined`

Defined in: [packages/core/src/tools/globalCache.ts:28](https://github.com/Sitecore/content-sdk/blob/dca81790520720d9e179a738163a316f911b36d8/packages/core/src/tools/globalCache.ts#L28)

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

`T` \| `undefined`

- The cached value if present, otherwise undefined.
