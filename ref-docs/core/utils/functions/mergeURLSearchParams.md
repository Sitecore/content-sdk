[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / mergeURLSearchParams

# Function: mergeURLSearchParams()

> **mergeURLSearchParams**(`params1`, `params2`): `string`

Defined in: [packages/core/src/utils/utils.ts:268](https://github.com/Sitecore/content-sdk/blob/8c53a853d75603d20d15cb340986939d03d331f2/packages/core/src/utils/utils.ts#L268)

Merges two URLSearchParams objects. If both objects contain the same key, the value from the second object overrides the first.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params1` | `URLSearchParams` | The first set of URL search parameters. |
| `params2` | `URLSearchParams` | The second set of URL search parameters. |

## Returns

`string`

- A string representation of the merged URL search parameters.
