[**@sitecore-content-sdk/content**](../../../../README.md)

***

[@sitecore-content-sdk/content](../../../../README.md) / [index](../../../README.md) / [form](../README.md) / subscribeToFormSubmitEvent

# Function: subscribeToFormSubmitEvent()

> **subscribeToFormSubmitEvent**(`formElement`, `componentId?`, `signal?`): `void`

Defined in: [content/src/form/form.ts:91](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/content/src/form/form.ts#L91)

**`Internal`**

Subscribes to the Form event
This listener captures interactions such as form views or submissions

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `formElement` | `HTMLElement` | The form element to subscribe to events on |
| `componentId?` | `string` | The unique identifier of the component |
| `signal?` | `AbortSignal` | - |

## Returns

`void`
