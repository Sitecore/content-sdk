[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [index](../../../README.md) / [form](../README.md) / loadForm

# Function: loadForm()

> **loadForm**(`contextId`, `formId`, `edgeUrl?`): `Promise`\<`string`\>

Defined in: [packages/core/src/form/form.ts:12](https://github.com/Sitecore/content-sdk/blob/4ac6c0b08031d0f8d3e3046612ef022854196c98/packages/core/src/form/form.ts#L12)

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
