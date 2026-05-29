[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / EventData

# Interface: EventData

Defined in: [events/src/events/custom-event/custom-event.ts:103](https://github.com/Sitecore/content-sdk/blob/97ebacafeda3114eace6f291c3fbb622e2944a72/packages/events/src/events/custom-event/custom-event.ts#L103)

Interface with the required/optional attributes to send a custom event to the SitecoreCloud API

## Extends

- [`EventAttributesInput`](EventAttributesInput.md).`NestedObject`

## Indexable

> \[`key`: `string`\]: `NestedObject` \| `BasicTypes`

They keys of the object can be any string, and the values can be either basic types or another nested object.

## Properties

### channel?

> `optional` **channel?**: `string`

Defined in: [events/src/events/common-interfaces.ts:37](https://github.com/Sitecore/content-sdk/blob/97ebacafeda3114eace6f291c3fbb622e2944a72/packages/events/src/events/common-interfaces.ts#L37)

The touchpoint where the user interacts with your brand.

For example, for webpages, the channel is "WEB". For mobile app screens, the channel is "MOBILE_APP".

Format: uppercase.

If unset, this property will not be part of the payload.

#### Inherited from

[`EventAttributesInput`](EventAttributesInput.md).[`channel`](EventAttributesInput.md#channel)

***

### currency?

> `optional` **currency?**: `string`

Defined in: [events/src/events/common-interfaces.ts:47](https://github.com/Sitecore/content-sdk/blob/97ebacafeda3114eace6f291c3fbb622e2944a72/packages/events/src/events/common-interfaces.ts#L47)

The alphabetic currency code of the currency the site visitor uses in your app.

For example, if the site visitor selects Australian dollars as the currency, the currency is "AUD".

Format: uppercase ISO 4217.

If unset, this property will not be part of the payload.

#### Inherited from

[`EventAttributesInput`](EventAttributesInput.md).[`currency`](EventAttributesInput.md#currency)

***

### extensionData?

> `optional` **extensionData?**: `NestedObject`

Defined in: [events/src/events/custom-event/custom-event.ts:124](https://github.com/Sitecore/content-sdk/blob/97ebacafeda3114eace6f291c3fbb622e2944a72/packages/events/src/events/custom-event/custom-event.ts#L124)

Any custom data to collect about an event in addition to the other attributes provided for the event data.

***

### language?

> `optional` **language?**: `string`

Defined in: [events/src/events/common-interfaces.ts:19](https://github.com/Sitecore/content-sdk/blob/97ebacafeda3114eace6f291c3fbb622e2944a72/packages/events/src/events/common-interfaces.ts#L19)

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

Defined in: [events/src/events/common-interfaces.ts:27](https://github.com/Sitecore/content-sdk/blob/97ebacafeda3114eace6f291c3fbb622e2944a72/packages/events/src/events/common-interfaces.ts#L27)

The name of the webpage where the interaction with your brand takes place.

Default for browser-side events: for the website root page, "Home Page". For other webpages, inferred from the URL pathname.

Default for server-side events: empty string.

#### Inherited from

[`EventAttributesInput`](EventAttributesInput.md).[`page`](EventAttributesInput.md#page)

***

### searchData?

> `optional` **searchData?**: `NestedObject`

Defined in: [events/src/events/custom-event/custom-event.ts:120](https://github.com/Sitecore/content-sdk/blob/97ebacafeda3114eace6f291c3fbb622e2944a72/packages/events/src/events/custom-event/custom-event.ts#L120)

Sitecore Search data about the event.

Use only in the following, standard events:
`SC_SEARCH_WIDGET_VIEW`, `SC_SEARCH_WIDGET_CLICK`

If set, the event and all its data will be available in Sitecore Search.
Construct according to the Sitecore Search Events API reference and data model.

***

### type

> **type**: `string`

Defined in: [events/src/events/custom-event/custom-event.ts:110](https://github.com/Sitecore/content-sdk/blob/97ebacafeda3114eace6f291c3fbb622e2944a72/packages/events/src/events/custom-event/custom-event.ts#L110)

The type of the event.
To send a custom event using event, or to add a custom event to the event queue using addToEventQueue, set type to a unique value. Do not set type to a reserved event name.

Recommendation: Include the name of the site in the unique value, for example, "myretailsite:CLICKED_PROMO".
