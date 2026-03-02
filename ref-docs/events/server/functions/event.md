[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [server](../README.md) / event

# Function: event()

> **event**\<`T`\>(`request`, `eventData`): `Promise`\<`EPResponse` \| `null`\>

Defined in: [events/src/events/custom-event/eventServer.ts:18](https://github.com/Sitecore/content-sdk/blob/500ff39a667bc697e65ad8db118ac8c76a24bf2b/packages/events/src/events/custom-event/eventServer.ts#L18)

A function that sends an event to SitecoreCloud API with the specified type

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Request` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `T` | Interface with constraint for extending request |
| `eventData` | [`EventData`](../../browser/interfaces/EventData.md) | The required/optional attributes in order to be send to SitecoreCloud API |

## Returns

`Promise`\<`EPResponse` \| `null`\>

The response object that Sitecore EP returns
