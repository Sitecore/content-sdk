[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / setCache

# Function: setCache()

> **setCache**(`key`, `data`): `void`

Defined in: [packages/core/src/tools/globalCache.ts:14](https://github.com/Sitecore/content-sdk/blob/57d48c7b35a450f906daae78abfd4cb68e3a40d5/packages/core/src/tools/globalCache.ts#L14)

**`Internal`**

Stores a value in the global cache under the specified key.
- Initializes the cache object on `globalThis` if it does not exist.
- Overwrites any existing value for the given key.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The cache key to set. |
| `data` | `unknown` | The value to store in the cache. |

## Returns

`void`
