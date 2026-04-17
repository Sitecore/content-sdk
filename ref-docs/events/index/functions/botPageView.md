[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / botPageView

# Function: botPageView()

> **botPageView**(`pageViewData?`): `Promise`\<`EPResponse` \| `null`\>

Defined in: [events/src/events/page-view/bot-page-view.ts:37](https://github.com/Sitecore/content-sdk/blob/fd717ff9011a06b489cdebb45197092600bc6c8a/packages/events/src/events/page-view/bot-page-view.ts#L37)

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
