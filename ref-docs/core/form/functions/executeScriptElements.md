[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [form](../README.md) / executeScriptElements

# Function: executeScriptElements()

> **executeScriptElements**(`rootElement`): `void`

Defined in: [packages/core/src/form/form.ts:50](https://github.com/Sitecore/content-sdk/blob/5647269998b9306151914ae421806dad763f924a/packages/core/src/form/form.ts#L50)

When you set the innerHTML property of an element, the browser does not execute any <script> tags included in the HTML string
This method ensures that any <script> elements within the loaded HTML are executed.
It re-creates the script elements and appends the to the component's template, then removes old script elements to avoid duplication.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rootElement` | `HTMLElement` | The root element to execute script elements within |

## Returns

`void`
