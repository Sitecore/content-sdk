[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / hasCache

# Function: hasCache()

> **hasCache**(`key`): `boolean`

Defined in: [packages/core/src/tools/globalCache.ts:54](https://github.com/Sitecore/content-sdk/blob/ee7d15fb7ff51ecf52f6c48a5dd927ab6855f385/packages/core/src/tools/globalCache.ts#L54)

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
