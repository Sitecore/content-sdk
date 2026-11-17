[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / BotTrackingMiddlewareOptions

# Type Alias: BotTrackingMiddlewareOptions

> **BotTrackingMiddlewareOptions** = `Omit`\<[`BaseMiddlewareOptions`](../interfaces/BaseMiddlewareOptions.md), `"enabled"`\> & [`SitecoreConfig`](../content/config/type-aliases/SitecoreConfig.md)\[`"api"`\]\[`"edge"`\] & `object`

Defined in: [packages/angular/src/server/middleware/bot-tracking-middleware.ts:24](https://github.com/Sitecore/content-sdk/blob/5f550df58daa0752bc0119549b277b24b2048b1f/packages/angular/src/server/middleware/bot-tracking-middleware.ts#L24)

Configuration for the bot tracking middleware.

## Type Declaration

### defaultLanguage?

> `optional` **defaultLanguage?**: `string`

Fallback language when the request path has no locale prefix. Default is `'en'`

### defaultSite?

> `optional` **defaultSite?**: `string`

Fallback site name when not resolved by the multisite middleware or site cookie

### locales?

> `optional` **locales?**: `string`[]

Locales used to extract the language from the request path
