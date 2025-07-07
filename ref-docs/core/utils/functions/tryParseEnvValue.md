[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / tryParseEnvValue

# Function: tryParseEnvValue()

> **tryParseEnvValue**\<`T`\>(`envValue`, `defaultValue`): `T`

Defined in: [packages/core/src/utils/env.ts:7](https://github.com/Sitecore/content-sdk/blob/3164917a53e03fa6723785be29b411031326a877/packages/core/src/utils/env.ts#L7)

Method to parse JSON-formatted environment variables

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `envValue` | `undefined` \| `string` | can be undefined when providing values via process.env |
| `defaultValue` | `T` | default value |

## Returns

`T`

parsed value
