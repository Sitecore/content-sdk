[**@sitecore-content-sdk/core**](../../../../README.md)

***

[@sitecore-content-sdk/core](../../../../README.md) / [index](../../../README.md) / [form](../README.md) / subscribeToFormSubmitEvent

# Function: subscribeToFormSubmitEvent()

> **subscribeToFormSubmitEvent**(`formElement`, `componentId?`): `void`

Defined in: [packages/core/src/form/form.ts:76](https://github.com/Sitecore/content-sdk/blob/3a3301c5fd596749a0c51a4826e9163b9f1b97ea/packages/core/src/form/form.ts#L76)

Subscribes to the Form event and then sends data to CloudSDK.
This listener captures interactions such as form views or submissions

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `formElement` | `HTMLElement` | The form element to subscribe to events on |
| `componentId?` | `string` | The unique identifier of the component |

## Returns

`void`
