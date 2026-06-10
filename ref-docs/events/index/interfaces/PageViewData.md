[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / PageViewData

# Interface: PageViewData

Defined in: [events/src/events/page-view/page-view-event.ts:182](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/events/src/events/page-view/page-view-event.ts#L182)

Type with the required/optional attributes in order to send a view event to the SitecoreCloud API

## Extends

- [`EventAttributesInput`](EventAttributesInput.md)

## Properties

### channel?

> `optional` **channel?**: `string`

Defined in: [events/src/events/common-interfaces.ts:37](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/events/src/events/common-interfaces.ts#L37)

The touchpoint where the user interacts with your brand.

For example, for webpages, the channel is "WEB". For mobile app screens, the channel is "MOBILE_APP".

Format: uppercase.

If unset, this property will not be part of the payload.

#### Inherited from

[`EventAttributesInput`](EventAttributesInput.md).[`channel`](EventAttributesInput.md#channel)

***

### currency?

> `optional` **currency?**: `string`

Defined in: [events/src/events/common-interfaces.ts:47](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/events/src/events/common-interfaces.ts#L47)

The alphabetic currency code of the currency the site visitor uses in your app.

For example, if the site visitor selects Australian dollars as the currency, the currency is "AUD".

Format: uppercase ISO 4217.

If unset, this property will not be part of the payload.

#### Inherited from

[`EventAttributesInput`](EventAttributesInput.md).[`currency`](EventAttributesInput.md#currency)

***

### extensionData?

> `optional` **extensionData?**: `NestedObject`

Defined in: [events/src/events/page-view/page-view-event.ts:204](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/events/src/events/page-view/page-view-event.ts#L204)

Any custom data to collect about an event in addition to the other attributes provided for the event data.

***

### includeUTMParameters?

> `optional` **includeUTMParameters?**: `boolean`

Defined in: [events/src/events/page-view/page-view-event.ts:200](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/events/src/events/page-view/page-view-event.ts#L200)

Whether to add every UTM parameter from the URL of the current webpage to the event object.

Default: `true`.

***

### language?

> `optional` **language?**: `string`

Defined in: [events/src/events/common-interfaces.ts:19](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/events/src/events/common-interfaces.ts#L19)

The language the site visitor interacts with your brand in.

For example, if the site visitor selects the Japanese language in your app, the language is "JA".

Format: uppercase ISO 639.

Default for browser-side events: inferred from the HTML lang attribute. If lang is not specified, the default is an empty string.

Default for server-side events: empty string.

#### Inherited from

[`EventAttributesInput`](EventAttributesInput.md).[`language`](EventAttributesInput.md#language)

***

### page?

> `optional` **page?**: `string`

Defined in: [events/src/events/common-interfaces.ts:27](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/events/src/events/common-interfaces.ts#L27)

The name of the webpage where the interaction with your brand takes place.

Default for browser-side events: for the website root page, "Home Page". For other webpages, inferred from the URL pathname.

Default for server-side events: empty string.

#### Inherited from

[`EventAttributesInput`](EventAttributesInput.md).[`page`](EventAttributesInput.md#page)

***

### pageVariantId?

> `optional` **pageVariantId?**: `string`

Defined in: [events/src/events/page-view/page-view-event.ts:186](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/events/src/events/page-view/page-view-event.ts#L186)

The ID of a personalized page variant.

***

### referrer?

> `optional` **referrer?**: `string`

Defined in: [events/src/events/page-view/page-view-event.ts:194](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/events/src/events/page-view/page-view-event.ts#L194)

The URI of the webpage that linked to the webpage where the event was captured.

Default for browser-side events: inferred from document.referrer. If document.referrer is an empty string, the value will be set to null.

Default for server-side events: null.

***

### searchData?

> `optional` **searchData?**: `NestedObject`

Defined in: [events/src/events/page-view/page-view-event.ts:210](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/events/src/events/page-view/page-view-event.ts#L210)

Sitecore Search data about the event.
If set, the event and all its data will be available in Sitecore Search.
Construct according to the Sitecore Search Events API reference and data model.
