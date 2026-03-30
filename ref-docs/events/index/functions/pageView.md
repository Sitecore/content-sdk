[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / pageView

# Function: pageView()

> **pageView**(`pageViewData?`): `Promise`\<`EPResponse` \| `null`\>

Defined in: [events/src/events/page-view/page-view.ts:16](https://github.com/Sitecore/content-sdk/blob/f7008cbcc73e6353a120cb1ae2a37404f22abe9f/packages/events/src/events/page-view/page-view.ts#L16)

A function that sends a VIEW event to the SitecoreCloud API

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pageViewData?` | [`PageViewData`](../interfaces/PageViewData.md) | The optional attributes to be sent to the SitecoreCloud API This object will be flattened and sent in the ext object of the payload |

## Returns

`Promise`\<`EPResponse` \| `null`\>

The response object that Sitecore Edge Proxy returns
