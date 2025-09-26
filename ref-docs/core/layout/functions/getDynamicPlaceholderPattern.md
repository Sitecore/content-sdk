[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [layout](../README.md) / getDynamicPlaceholderPattern

# Function: getDynamicPlaceholderPattern()

> **getDynamicPlaceholderPattern**(`placeholder`): `RegExp`

Defined in: [packages/core/src/layout/utils.ts:81](https://github.com/Sitecore/content-sdk/blob/6568f3f866052357cc0d19dd77254f43ff7c7f0a/packages/core/src/layout/utils.ts#L81)

Returns a regular expression pattern for a dynamic placeholder name.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `placeholder` | `string` | Placeholder name with a dynamic segment (e.g. 'main-{*}') |

## Returns

`RegExp`

Regular expression pattern for the dynamic segment
