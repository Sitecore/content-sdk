[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / pageView

# Function: pageView()

> **pageView**(`pageViewData?`): `Promise`\<`EPResponse` \| `null`\>

Defined in: [events/src/events/page-view/page-view.ts:32](https://github.com/Sitecore/content-sdk/blob/2cc2d29fb8ea55dbe794a0b95c29a8d44bbf2b48/packages/events/src/events/page-view/page-view.ts#L32)

A function that sends a VIEW event to the SitecoreCloud API

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pageViewData?` | [`PageViewData`](../interfaces/PageViewData.md) | The optional attributes to be sent to the SitecoreCloud API This object will be flattened and sent in the ext object of the payload. The page view will be skipped if the visitor on the client-side is a bot. |

## Returns

`Promise`\<`EPResponse` \| `null`\>

The response object that Sitecore Edge Proxy returns
