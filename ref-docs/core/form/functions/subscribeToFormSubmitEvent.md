[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [form](../README.md) / subscribeToFormSubmitEvent

# Function: subscribeToFormSubmitEvent()

> **subscribeToFormSubmitEvent**(`formElement`, `componentId`?): `void`

Defined in: [packages/core/src/form/form.ts:76](https://github.com/Sitecore/xmc-jss-dev/blob/643e3fe82af3b30800fd4ecaa7f98eb7f13d1ef6/packages/core/src/form/form.ts#L76)

Subscribes to the Form event and then sends data to CloudSDK.
This listener captures interactions such as form views or submissions

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `formElement` | `HTMLElement` | The form element to subscribe to events on |
| `componentId`? | `string` | The unique identifier of the component |

## Returns

`void`
