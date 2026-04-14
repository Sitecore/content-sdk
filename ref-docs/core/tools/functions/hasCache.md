[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / hasCache

# Function: hasCache()

> **hasCache**(`key`): `boolean`

Defined in: [packages/core/src/tools/globalCache.ts:54](https://github.com/Sitecore/content-sdk/blob/888eef99b46ec3cc8aafe70ca50b3ddbce1580b0/packages/core/src/tools/globalCache.ts#L54)

**`Internal`**

Determines whether a cached value exists for the provided key
 - The cache is stored on `globalThis`

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The cache key to test for existence. |

## Returns

`boolean`

- true if a value is present for the given key; otherwise false.
