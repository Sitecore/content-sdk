[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / form

# Function: form()

> **form**(`formId`, `interactionType`, `componentInstanceId`): `Promise`\<`EPResponse` \| `null`\>

Defined in: [events/src/events/custom-event/form.ts:16](https://github.com/Sitecore/content-sdk/blob/3b25a6307ef74f6ab7da606ec8b04e5fcb108ad3/packages/events/src/events/custom-event/form.ts#L16)

A function that sends a form event to the SitecoreCloud API

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `formId` | `string` | The required form ID string |
| `interactionType` | `"VIEWED"` \| `"SUBMITTED"` | The required interaction type string. Possible values: `VIEWED`, `SUBMITTED` |
| `componentInstanceId` | `string` | The required component instance ID string |

## Returns

`Promise`\<`EPResponse` \| `null`\>

The response object that Sitecore Edge Proxy returns or null
