[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / getRenderingParamString

# Function: getRenderingParamString()

> **getRenderingParamString**(`value`): `string` \| `undefined`

Defined in: [content/src/layout/utils.ts:33](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/content/src/layout/utils.ts#L33)

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
