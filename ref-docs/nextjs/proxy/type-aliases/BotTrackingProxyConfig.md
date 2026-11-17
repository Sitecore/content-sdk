[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / BotTrackingProxyConfig

# Type Alias: BotTrackingProxyConfig

> **BotTrackingProxyConfig** = `SitecoreConfig`\[`"api"`\]\[`"edge"`\] & `Omit`\<[`ProxyBaseConfig`](ProxyBaseConfig.md), `"defaultLanguage"`\> & `object`

Defined in: [nextjs/src/proxy/bot-tracking-proxy.ts:15](https://github.com/Sitecore/content-sdk/blob/3cc9fabc565ee4e80b1eeb351dbd97c802dd1fad/packages/nextjs/src/proxy/bot-tracking-proxy.ts#L15)

Configuration for BotTrackingProxy.

## Type Declaration

### fetchEvent?

> `optional` **fetchEvent**: `NextFetchEvent`

Fetch event to run the bot tracking in the background to not block the request.
If not provided, the bot tracking will run synchronously.
Read more about `fetchEvent` in the [Next.js documentation](https://nextjs.org/docs/app/api-reference/file-conventions/proxy#waituntil-and-nextfetchevent)

#### Param

Fetch event to run the bot tracking in the background.
