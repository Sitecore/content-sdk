[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / BotPageViewData

# Type Alias: BotPageViewData

> **BotPageViewData** = `object`

Defined in: [events/src/events/page-view/bot-page-view.ts:12](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/events/src/events/page-view/bot-page-view.ts#L12)

The data to be sent for bot tracking.

## Properties

### language

> **language**: `string`

Defined in: [events/src/events/page-view/bot-page-view.ts:22](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/events/src/events/page-view/bot-page-view.ts#L22)

The language the site visitor interacts with your brand in.
For example, if the site visitor selects the Japanese language in your app, the language is "JA".
Format: uppercase ISO 639.

***

### page

> **page**: `string`

Defined in: [events/src/events/page-view/bot-page-view.ts:16](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/events/src/events/page-view/bot-page-view.ts#L16)

The name of the webpage where the interaction with your brand takes place.

***

### userAgent

> **userAgent**: `string`

Defined in: [events/src/events/page-view/bot-page-view.ts:26](https://github.com/Sitecore/content-sdk/blob/bd64e59f4408401ffdf3111f077ed6c7eb99c56e/packages/events/src/events/page-view/bot-page-view.ts#L26)

Full `User-Agent` of the request. Sent in event `ext` as `sourceUserAgent` (distinct from any `User-Agent` header on the HTTP request).
