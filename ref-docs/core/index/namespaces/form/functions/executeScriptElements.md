[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [index](../../../README.md) / [form](../README.md) / executeScriptElements

# Function: executeScriptElements()

> **executeScriptElements**(`rootElement`): `void`

<<<<<<< HEAD
Defined in: [packages/core/src/form/form.ts:50](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/form/form.ts#L50)
=======
Defined in: [packages/core/src/form/form.ts:50](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/form/form.ts#L50)
>>>>>>> dd686bb50 (Update API docs)

When you set the innerHTML property of an element, the browser does not execute any <script> tags included in the HTML string
This method ensures that any <script> elements within the loaded HTML are executed.
It re-creates the script elements and appends the to the component's template, then removes old script elements to avoid duplication.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rootElement` | `HTMLElement` | The root element to execute script elements within |

## Returns

`void`
