[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [layout](../README.md) / getDynamicPlaceholderPattern

# Function: getDynamicPlaceholderPattern()

> **getDynamicPlaceholderPattern**(`placeholder`): `RegExp`

Defined in: [packages/core/src/layout/utils.ts:93](https://github.com/Sitecore/content-sdk/blob/0649782c3e3848c143b038ab97cec6f2f05fd578/packages/core/src/layout/utils.ts#L93)

**`Internal`**

Returns a regular expression pattern for a dynamic placeholder name.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `placeholder` | `string` | Placeholder name with a dynamic segment (e.g. 'main-{*}') |

## Returns

`RegExp`

Regular expression pattern for the dynamic segment
