[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [browser](../README.md) / event

# Function: event()

> **event**(`eventData`): `Promise`\<`EPResponse` \| `null`\>

Defined in: [events/src/events/custom-event/event.ts:14](https://github.com/Sitecore/content-sdk/blob/8dcb9d458e61f7c39bf98898c9a004ce461038f8/packages/events/src/events/custom-event/event.ts#L14)

A function that sends an event to SitecoreCloud API with the specified type

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventData` | [`EventData`](../interfaces/EventData.md) | The required/optional attributes in order to be send to SitecoreCloud API |

## Returns

`Promise`\<`EPResponse` \| `null`\>

The response object that Sitecore EP returns
