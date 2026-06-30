[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / botPageView

# Function: botPageView()

> **botPageView**(`pageViewData?`): `Promise`\<`EPResponse` \| `null`\>

Defined in: [events/src/events/page-view/bot-page-view.ts:60](https://github.com/Sitecore/content-sdk/blob/f559a5f32d3b72c553bf5e9a3870c6af89ad15ac/packages/events/src/events/page-view/bot-page-view.ts#L60)

Sends a VIEW event for bot tracking.
Derives a stable client id from `userAgent` so repeated requests from the same
crawler share a single id, and defaults `channel` to `bot`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pageViewData?` | [`BotPageViewData`](../type-aliases/BotPageViewData.md) | The optional attributes to be sent to the SitecoreCloud API |

## Returns

`Promise`\<`EPResponse` \| `null`\>

The response from Sitecore Edge Proxy.
