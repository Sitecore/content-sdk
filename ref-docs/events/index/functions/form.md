[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / form

# Function: form()

> **form**(`formId`, `interactionType`, `componentInstanceId`): `Promise`\<`EPResponse` \| `null`\>

Defined in: [events/src/events/custom-event/form.ts:16](https://github.com/Sitecore/content-sdk/blob/eb4a5a9ee099182eed23366c9fea12d5faf5c541/packages/events/src/events/custom-event/form.ts#L16)

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
