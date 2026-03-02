[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [server](../README.md) / pageView

# Function: pageView()

> **pageView**\<`T`\>(`request`, `pageViewData?`): `Promise`\<`EPResponse` \| `null`\>

Defined in: [events/src/events/page-view/page-view-server.ts:18](https://github.com/Sitecore/content-sdk/blob/a62a1f22ed28ce75629a695b9a29f5908e48b767/packages/events/src/events/page-view/page-view-server.ts#L18)

A function that sends a VIEW event to SitecoreCloud API

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Request` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `T` | Interface with constraint for extending request |
| `pageViewData?` | [`PageViewData`](../../browser/interfaces/PageViewData.md) | The required/optional attributes in order to be send to SitecoreCloud API |

## Returns

`Promise`\<`EPResponse` \| `null`\>

The response object that Sitecore EP returns
