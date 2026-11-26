[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / isJavascriptUrl

# Function: isJavascriptUrl()

> **isJavascriptUrl**(`url`): `boolean`

Defined in: [packages/core/src/tools/utils.ts:183](https://github.com/Sitecore/content-sdk/blob/ec39303dfab1c8fa45958f31c508ba9a92e16847/packages/core/src/tools/utils.ts#L183)

**`Internal`**

Whether an href is a javascript: URL that React blocks.
Case-insensitive. Allows leading spaces and control characters, and tab or
newline characters between the letters of the scheme.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | candidate href |

## Returns

`boolean`

true when the URL uses the javascript protocol

## See

https://github.com/facebook/react/blob/main/packages/react-dom-bindings/src/shared/sanitizeURL.js
