[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / mergeURLSearchParams

# Function: mergeURLSearchParams()

> **mergeURLSearchParams**(`params1`, `params2`): `string`

Defined in: [packages/core/src/utils/utils.ts:294](https://github.com/Sitecore/content-sdk/blob/6b7c7b667b2f4d24b0f2f2dc3cbdfa4d1a32ad10/packages/core/src/utils/utils.ts#L294)

Merges two URLSearchParams objects. If both objects contain the same key, the value from the second object overrides the first.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params1` | `URLSearchParams` | The first set of URL search parameters. |
| `params2` | `URLSearchParams` | The second set of URL search parameters. |

## Returns

`string`

- A string representation of the merged URL search parameters.
