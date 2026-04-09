[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / mergeURLSearchParams

# Function: mergeURLSearchParams()

> **mergeURLSearchParams**(`params1`, `params2`): `string`

Defined in: [packages/core/src/tools/utils.ts:222](https://github.com/Sitecore/content-sdk/blob/21e586e21b4d02181f2ff54e45a22a203b23a8bf/packages/core/src/tools/utils.ts#L222)

Merges two URLSearchParams objects. If both objects contain the same key, the value from the second object overrides the first.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params1` | `URLSearchParams` | The first set of URL search parameters. |
| `params2` | `URLSearchParams` | The second set of URL search parameters. |

## Returns

`string`

- A string representation of the merged URL search parameters.
