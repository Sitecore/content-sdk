[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / getRenderingParamString

# Function: getRenderingParamString()

> **getRenderingParamString**(`value`): `string` \| `undefined`

Defined in: [content/src/layout/utils.ts:33](https://github.com/Sitecore/content-sdk/blob/cc697f1b79c7ea3d0da73c83f919cdbb67d0d0c9/packages/content/src/layout/utils.ts#L33)

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
