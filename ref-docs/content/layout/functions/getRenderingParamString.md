[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / getRenderingParamString

# Function: getRenderingParamString()

> **getRenderingParamString**(`value`): `string` \| `undefined`

Defined in: [content/src/layout/utils.ts:33](https://github.com/Sitecore/content-sdk/blob/081959dae5f50b36abd9af8b5e9d111d2d12fc2d/packages/content/src/layout/utils.ts#L33)

**`Internal`**

Normalizes a rendering param value to a string.
Layout Service may return DetailedRenderingParams as objects instead of plain
strings (e.g. Styles, CSSStyles, GridParameters).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `unknown` | rendering param value |

## Returns

`string` \| `undefined`

normalized string value, or undefined when not extractable
