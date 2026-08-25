[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [config](../README.md) / deepMerge

# Function: deepMerge()

> **deepMerge**\<`T`\>(`base`, `override?`): `T`

Defined in: [content/src/config/define-config.ts:107](https://github.com/Sitecore/content-sdk/blob/c9c8d1c0cd9bd014c418f5695be825137a97e6ba/packages/content/src/config/define-config.ts#L107)

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
