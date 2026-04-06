[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / botPageView

# Function: botPageView()

> **botPageView**(): `Promise`\<`EPResponse` \| `null`\>

Defined in: [events/src/events/page-view/bot-page-view.ts:15](https://github.com/Sitecore/content-sdk/blob/6637a5cdd65fb19a328565a2dd7accc61598d2f1/packages/events/src/events/page-view/bot-page-view.ts#L15)

Sends a VIEW event for server-side bot tracking (e.g. Next.js proxy / Edge).
Uses a synthetic per-invocation client id and defaults `channel` to `bot`.
Returns `null` in browser environments.

## Returns

`Promise`\<`EPResponse` \| `null`\>

The response from Sitecore Edge Proxy, or `null` if skipped (browser).
