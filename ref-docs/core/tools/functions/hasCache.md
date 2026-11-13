[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / hasCache

# Function: hasCache()

> **hasCache**(`key`): `boolean`

Defined in: [packages/core/src/tools/globalCache.ts:54](https://github.com/Sitecore/content-sdk/blob/84b2ebcb77b1c88a88e7b2b7d4b9b7117148025d/packages/core/src/tools/globalCache.ts#L54)

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
