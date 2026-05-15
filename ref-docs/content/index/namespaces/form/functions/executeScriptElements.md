[**@sitecore-content-sdk/content**](../../../../README.md)

***

[@sitecore-content-sdk/content](../../../../README.md) / [index](../../../README.md) / [form](../README.md) / executeScriptElements

# Function: executeScriptElements()

> **executeScriptElements**(`rootElement`): `void`

Defined in: [content/src/form/form.ts:55](https://github.com/Sitecore/content-sdk/blob/7d388d6eae7bc0cfc53199a13850391ceccd0504/packages/content/src/form/form.ts#L55)

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
