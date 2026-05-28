[**@sitecore-content-sdk/content**](../../../../README.md)

***

[@sitecore-content-sdk/content](../../../../README.md) / [index](../../../README.md) / [form](../README.md) / loadForm

# Function: loadForm()

> **loadForm**(`contextId`, `formId`, `edgeUrl?`): `Promise`\<`string`\>

Defined in: [content/src/form/form.ts:15](https://github.com/Sitecore/content-sdk/blob/856cb89263cff3f1e39e74ebd0ae054e4bd68391/packages/content/src/form/form.ts#L15)

**`Internal`**

Fetches the form markup from the Sitecore Edge service and renders it in the component's template.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `contextId` | `string` | The unique identifier of the current context |
| `formId` | `string` | The unique identifier of the form |
| `edgeUrl?` | `string` | The URL of the Sitecore Edge Platform |

## Returns

`Promise`\<`string`\>
