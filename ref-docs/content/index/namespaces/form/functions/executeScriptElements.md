[**@sitecore-content-sdk/content**](../../../../README.md)

***

[@sitecore-content-sdk/content](../../../../README.md) / [index](../../../README.md) / [form](../README.md) / executeScriptElements

# Function: executeScriptElements()

> **executeScriptElements**(`rootElement`): `void`

Defined in: [content/src/form/form.ts:64](https://github.com/Sitecore/content-sdk/blob/cc697f1b79c7ea3d0da73c83f919cdbb67d0d0c9/packages/content/src/form/form.ts#L64)

**`Internal`**

When you set the innerHTML property of an element, the browser does not execute any <script> tags included in the HTML string
This method ensures that any <script> elements within the loaded HTML are executed.
It re-creates the script elements and appends the to the component's template, then removes old script elements to avoid duplication.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rootElement` | `HTMLElement` | The root element to execute script elements within |

## Returns

`void`
