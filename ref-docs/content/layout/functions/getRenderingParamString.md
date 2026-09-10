[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / getRenderingParamString

# Function: getRenderingParamString()

> **getRenderingParamString**(`value`): `string` \| `undefined`

Defined in: [content/src/layout/utils.ts:33](https://github.com/Sitecore/content-sdk/blob/a8a17de670f6378fa21e08a9c76841c041afb7fd/packages/content/src/layout/utils.ts#L33)

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
