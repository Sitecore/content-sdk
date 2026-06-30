[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / EventAttributesInput

# Interface: EventAttributesInput

Defined in: [events/src/events/common-interfaces.ts:7](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/events/src/events/common-interfaces.ts#L7)

Event data that is sent to Sitecore Edge Proxy.

## Extended by

- [`PageViewData`](PageViewData.md)
- [`EventData`](EventData.md)
- [`IdentityData`](IdentityData.md)

## Properties

### channel?

> `optional` **channel?**: `string`

Defined in: [events/src/events/common-interfaces.ts:37](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/events/src/events/common-interfaces.ts#L37)

The touchpoint where the user interacts with your brand.

For example, for webpages, the channel is "WEB". For mobile app screens, the channel is "MOBILE_APP".

Format: uppercase.

If unset, this property will not be part of the payload.

***

### currency?

> `optional` **currency?**: `string`

Defined in: [events/src/events/common-interfaces.ts:47](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/events/src/events/common-interfaces.ts#L47)

The alphabetic currency code of the currency the site visitor uses in your app.

For example, if the site visitor selects Australian dollars as the currency, the currency is "AUD".

Format: uppercase ISO 4217.

If unset, this property will not be part of the payload.

***

### language?

> `optional` **language?**: `string`

Defined in: [events/src/events/common-interfaces.ts:19](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/events/src/events/common-interfaces.ts#L19)

The language the site visitor interacts with your brand in.

For example, if the site visitor selects the Japanese language in your app, the language is "JA".

Format: uppercase ISO 639.

Default for browser-side events: inferred from the HTML lang attribute. If lang is not specified, the default is an empty string.

Default for server-side events: empty string.

***

### page?

> `optional` **page?**: `string`

Defined in: [events/src/events/common-interfaces.ts:27](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/events/src/events/common-interfaces.ts#L27)

The name of the webpage where the interaction with your brand takes place.

Default for browser-side events: for the website root page, "Home Page". For other webpages, inferred from the URL pathname.

Default for server-side events: empty string.
