[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / BotPageViewData

# Type Alias: BotPageViewData

> **BotPageViewData** = `object`

Defined in: [events/src/events/page-view/bot-page-view.ts:17](https://github.com/Sitecore/content-sdk/blob/421d9105c87752d5bb0d388661240bd0d97920b1/packages/events/src/events/page-view/bot-page-view.ts#L17)

The data to be sent for bot tracking.

## Properties

### language

> **language**: `string`

Defined in: [events/src/events/page-view/bot-page-view.ts:27](https://github.com/Sitecore/content-sdk/blob/421d9105c87752d5bb0d388661240bd0d97920b1/packages/events/src/events/page-view/bot-page-view.ts#L27)

The language the site visitor interacts with your brand in.
For example, if the site visitor selects the Japanese language in your app, the language is "JA".
Format: uppercase ISO 639.

***

### page

> **page**: `string`

Defined in: [events/src/events/page-view/bot-page-view.ts:21](https://github.com/Sitecore/content-sdk/blob/421d9105c87752d5bb0d388661240bd0d97920b1/packages/events/src/events/page-view/bot-page-view.ts#L21)

The name of the webpage where the interaction with your brand takes place.

***

### userAgent

> **userAgent**: `string`

Defined in: [events/src/events/page-view/bot-page-view.ts:31](https://github.com/Sitecore/content-sdk/blob/421d9105c87752d5bb0d388661240bd0d97920b1/packages/events/src/events/page-view/bot-page-view.ts#L31)

Full `User-Agent` of the request. Sent in event `ext` as `sourceUserAgent` (distinct from any `User-Agent` header on the HTTP request).
