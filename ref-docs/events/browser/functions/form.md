[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [browser](../README.md) / form

# Function: form()

> **form**(`formId`, `interactionType`, `componentInstanceId`): `Promise`\<`EPResponse` \| `null`\>

Defined in: [events/src/events/custom-event/form.ts:15](https://github.com/Sitecore/content-sdk/blob/48c97c4b8cd547e1668c820cb220274bc3e67af1/packages/events/src/events/custom-event/form.ts#L15)

A function that sends a form event to SitecoreCloud API

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `formId` | `string` | The required form ID string |
| `interactionType` | `"VIEWED"` \| `"SUBMITTED"` | The required interaction type string. Possible values: "VIEWED", "SUBMITTED" |
| `componentInstanceId` | `string` | The required component instance ID string |

## Returns

`Promise`\<`EPResponse` \| `null`\>

The response object that Sitecore EP returns or null
