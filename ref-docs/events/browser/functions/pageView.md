[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [browser](../README.md) / pageView

# Function: pageView()

> **pageView**(`pageViewData?`): `Promise`\<`EPResponse` \| `null`\>

Defined in: [events/src/events/page-view/page-view.ts:15](https://github.com/Sitecore/content-sdk/blob/dc098bf2453ff3d6378a7cb98a7f84ad282af7af/packages/events/src/events/page-view/page-view.ts#L15)

A function that sends a VIEW event to SitecoreCloud API

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pageViewData?` | [`PageViewData`](../interfaces/PageViewData.md) | The optional attributes in order to be send to SitecoreCloud API This object will be flattened and sent in the ext object of the payload |

## Returns

`Promise`\<`EPResponse` \| `null`\>

The response object that Sitecore EP returns
