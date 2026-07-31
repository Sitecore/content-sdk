[**@sitecore-content-sdk/content**](../../../../README.md)

***

[@sitecore-content-sdk/content](../../../../README.md) / [index](../../../README.md) / [form](../README.md) / subscribeToFormSubmitEvent

# Function: subscribeToFormSubmitEvent()

> **subscribeToFormSubmitEvent**(`formElement`, `componentId?`, `signal?`): `void`

Defined in: [content/src/form/form.ts:82](https://github.com/Sitecore/content-sdk/blob/07c6169d94098a2bc2f491ef61de4d253b52b098/packages/content/src/form/form.ts#L82)

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
