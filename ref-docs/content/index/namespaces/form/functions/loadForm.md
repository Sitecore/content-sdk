[**@sitecore-content-sdk/content**](../../../../README.md)

***

[@sitecore-content-sdk/content](../../../../README.md) / [index](../../../README.md) / [form](../README.md) / loadForm

# Function: loadForm()

> **loadForm**(`contextId`, `formId`, `edgeUrl?`, `language?`): `Promise`\<`string`\>

Defined in: [content/src/form/form.ts:16](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/content/src/form/form.ts#L16)

**`Internal`**

Fetches the form markup from the Sitecore Edge service and renders it in the component's template.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `contextId` | `string` | The unique identifier of the current context |
| `formId` | `string` | The unique identifier of the form |
| `edgeUrl?` | `string` | The URL of the Sitecore Edge Platform |
| `language?` | `string` | Page language used to load the matching multilingual form version |

## Returns

`Promise`\<`string`\>
