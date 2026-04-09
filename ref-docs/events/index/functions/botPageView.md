[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / botPageView

# Function: botPageView()

> **botPageView**(`pageViewData?`): `Promise`\<`EPResponse` \| `null`\>

Defined in: [events/src/events/page-view/bot-page-view.ts:33](https://github.com/Sitecore/content-sdk/blob/21e586e21b4d02181f2ff54e45a22a203b23a8bf/packages/events/src/events/page-view/bot-page-view.ts#L33)

Sends a VIEW event for server-side bot tracking (e.g. Next.js proxy / Edge).
Uses a synthetic per-invocation client id and defaults `channel` to `bot`.
Returns `null` in browser environments.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pageViewData?` | [`BotPageViewData`](../type-aliases/BotPageViewData.md) | The optional attributes to be sent to the SitecoreCloud API |

## Returns

`Promise`\<`EPResponse` \| `null`\>

The response from Sitecore Edge Proxy, or `null` if skipped (browser).
