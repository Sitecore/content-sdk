[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / event

# Function: event()

> **event**(`eventData`): `Promise`\<`EPResponse` \| `null`\>

Defined in: [events/src/events/custom-event/event.ts:15](https://github.com/Sitecore/content-sdk/blob/8f962400f3b79f00425a8cd76a6d2082b5b47c47/packages/events/src/events/custom-event/event.ts#L15)

A function that sends an event to the SitecoreCloud API with the specified type

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventData` | [`EventData`](../interfaces/EventData.md) | The required/optional attributes to be sent to the SitecoreCloud API |

## Returns

`Promise`\<`EPResponse` \| `null`\>

The response object that Sitecore Edge Proxy returns
