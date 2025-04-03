[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [form](../README.md) / loadForm

# Function: loadForm()

> **loadForm**(`contextId`, `formId`, `edgeUrl`?): `Promise`\<`string`\>

Defined in: [packages/core/src/form/form.ts:11](https://github.com/Sitecore/content-sdk/blob/0f8983961033e3434ebcac616164ddf8d484be81/packages/core/src/form/form.ts#L11)

Fetches the form markup from the Sitecore Edge service and renders it in the component's template.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `contextId` | `string` | The unique identifier of the current context |
| `formId` | `string` | The unique identifier of the form |
| `edgeUrl`? | `string` | The URL of the Sitecore Edge Platform |

## Returns

`Promise`\<`string`\>
