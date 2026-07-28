[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / getDynamicPlaceholderPattern

# Function: getDynamicPlaceholderPattern()

> **getDynamicPlaceholderPattern**(`placeholder`): `RegExp`

Defined in: [content/src/layout/utils.ts:138](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/content/src/layout/utils.ts#L138)

**`Internal`**

Returns a regular expression pattern for a dynamic placeholder name.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `placeholder` | `string` | Placeholder name with a dynamic segment (e.g. 'main-{*}') |

## Returns

`RegExp`

Regular expression pattern for the dynamic segment
