[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / isExperimentalEnvFlagEnabled

# Variable: isExperimentalEnvFlagEnabled

> `const` **isExperimentalEnvFlagEnabled**: (`value`) => `boolean`

Defined in: content/types/experimental-features/utils.d.ts:9

Returns true when an experimental feature env flag is opted in.
Accepts `true` / `1` (case-insensitive, trimmed).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `undefined` | Environment variable value. |

## Returns

`boolean`

Whether the flag is enabled.
