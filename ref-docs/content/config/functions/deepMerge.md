[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [config](../README.md) / deepMerge

# Function: deepMerge()

> **deepMerge**\<`T`\>(`base`, `override?`): `T`

Defined in: [content/src/config/define-config.ts:107](https://github.com/Sitecore/content-sdk/blob/2dc64e62333bc02156fe37ffdcae6ab8a71ff4cc/packages/content/src/config/define-config.ts#L107)

**`Internal`**

Deep merge utility that skips undefined or empty string values in the override.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | `T` | base value |
| `override?` | `DeepPartial`\<`T`\> | override value |

## Returns

`T`
