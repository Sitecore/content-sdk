[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / getCache

# Function: getCache()

> **getCache**\<`T`\>(`key`): `T` \| `undefined`

Defined in: [packages/core/src/tools/globalCache.ts:28](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/core/src/tools/globalCache.ts#L28)

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
