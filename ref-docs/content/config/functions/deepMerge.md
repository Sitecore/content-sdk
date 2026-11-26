[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [config](../README.md) / deepMerge

# Function: deepMerge()

> **deepMerge**\<`T`\>(`base`, `override?`): `T`

Defined in: [content/src/config/define-config.ts:107](https://github.com/Sitecore/content-sdk/blob/3966c04d9148447d9abcf751cdefb214d74a9fb3/packages/content/src/config/define-config.ts#L107)

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
