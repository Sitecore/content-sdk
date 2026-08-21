[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [experimental-features](../README.md) / isExperimentalEnvFlagEnabled

# Function: isExperimentalEnvFlagEnabled()

> **isExperimentalEnvFlagEnabled**(`value`): `boolean`

Defined in: [content/src/experimental-features/utils.ts:14](https://github.com/Sitecore/content-sdk/blob/d2b0a9ffcd19364330158edd407f2f3e8df68565/packages/content/src/experimental-features/utils.ts#L14)

Returns true when an experimental feature env flag is opted in.
Accepts `true` / `1` (case-insensitive, trimmed).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `undefined` | Environment variable value. |

## Returns

`boolean`

Whether the flag is enabled.
