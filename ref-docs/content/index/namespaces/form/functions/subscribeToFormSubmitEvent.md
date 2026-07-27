[**@sitecore-content-sdk/content**](../../../../README.md)

***

[@sitecore-content-sdk/content](../../../../README.md) / [index](../../../README.md) / [form](../README.md) / subscribeToFormSubmitEvent

# Function: subscribeToFormSubmitEvent()

> **subscribeToFormSubmitEvent**(`formElement`, `componentId?`, `signal?`): `void`

Defined in: [content/src/form/form.ts:82](https://github.com/Sitecore/content-sdk/blob/6f8e423028bdf8a74a2fc4b8cb084961d755b73f/packages/content/src/form/form.ts#L82)

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
