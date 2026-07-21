[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / IdentityData

# Interface: IdentityData

Defined in: [events/src/events/identity/identity-event.ts:132](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/identity/identity-event.ts#L132)

Interface with the necessary attributes for the input for sending identity events

## Extends

- [`EventAttributesInput`](EventAttributesInput.md)

## Properties

### channel?

> `optional` **channel?**: `string`

Defined in: [events/src/events/common-interfaces.ts:37](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/common-interfaces.ts#L37)

The touchpoint where the user interacts with your brand.

For example, for webpages, the channel is "WEB". For mobile app screens, the channel is "MOBILE_APP".

Format: uppercase.

If unset, this property will not be part of the payload.

#### Inherited from

[`EventAttributesInput`](EventAttributesInput.md).[`channel`](EventAttributesInput.md#channel)

***

### city?

> `optional` **city?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:138](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/identity/identity-event.ts#L138)

The site visitor's city address.

Format: title case recommended.

***

### country?

> `optional` **country?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:144](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/identity/identity-event.ts#L144)

The site visitor's country address.

Format: uppercase ISO 3166-1 alpha-2.

***

### currency?

> `optional` **currency?**: `string`

Defined in: [events/src/events/common-interfaces.ts:47](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/common-interfaces.ts#L47)

The alphabetic currency code of the currency the site visitor uses in your app.

For example, if the site visitor selects Australian dollars as the currency, the currency is "AUD".

Format: uppercase ISO 4217.

If unset, this property will not be part of the payload.

#### Inherited from

[`EventAttributesInput`](EventAttributesInput.md).[`currency`](EventAttributesInput.md#currency)

***

### dob?

> `optional` **dob?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:150](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/identity/identity-event.ts#L150)

The site visitor's date of birth.

Format: ISO 8601.

***

### email?

> `optional` **email?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:156](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/identity/identity-event.ts#L156)

The site visitor's email address.

Format: lowercase recommended.

***

### extensionData?

> `optional` **extensionData?**: `NestedObject`

Defined in: [events/src/events/identity/identity-event.ts:210](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/identity/identity-event.ts#L210)

Any custom data to collect about an event in addition to the other attributes provided for the event data.

***

### firstName?

> `optional` **firstName?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:162](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/identity/identity-event.ts#L162)

The site visitor's first name.

Format: title case recommended.

***

### gender?

> `optional` **gender?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:166](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/identity/identity-event.ts#L166)

The site visitor's gender.

***

### identifiers

> **identifiers**: [`Identifier`](Identifier.md)[]

Defined in: [events/src/events/identity/identity-event.ts:170](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/identity/identity-event.ts#L170)

The identifiers used for identifying site visitors.

***

### language?

> `optional` **language?**: `string`

Defined in: [events/src/events/common-interfaces.ts:19](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/common-interfaces.ts#L19)

The language the site visitor interacts with your brand in.

For example, if the site visitor selects the Japanese language in your app, the language is "JA".

Format: uppercase ISO 639.

Default for browser-side events: inferred from the HTML lang attribute. If lang is not specified, the default is an empty string.

Default for server-side events: empty string.

#### Inherited from

[`EventAttributesInput`](EventAttributesInput.md).[`language`](EventAttributesInput.md#language)

***

### lastName?

> `optional` **lastName?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:176](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/identity/identity-event.ts#L176)

The site visitor's last name.

Format: title case recommended.

***

### mobile?

> `optional` **mobile?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:180](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/identity/identity-event.ts#L180)

The site visitor's mobile number.

***

### page?

> `optional` **page?**: `string`

Defined in: [events/src/events/common-interfaces.ts:27](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/common-interfaces.ts#L27)

The name of the webpage where the interaction with your brand takes place.

Default for browser-side events: for the website root page, "Home Page". For other webpages, inferred from the URL pathname.

Default for server-side events: empty string.

#### Inherited from

[`EventAttributesInput`](EventAttributesInput.md).[`page`](EventAttributesInput.md#page)

***

### phone?

> `optional` **phone?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:184](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/identity/identity-event.ts#L184)

The site visitor's phone number.

***

### postalCode?

> `optional` **postalCode?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:188](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/identity/identity-event.ts#L188)

The site visitor's postal code.

***

### state?

> `optional` **state?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:194](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/identity/identity-event.ts#L194)

The site visitor's state address.

Format: title case recommended.

***

### street?

> `optional` **street?**: `string`[]

Defined in: [events/src/events/identity/identity-event.ts:200](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/identity/identity-event.ts#L200)

The site visitor's street address.

Format: title case recommended.

***

### title?

> `optional` **title?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:206](https://github.com/Sitecore/content-sdk/blob/758194c5352b02735bc7dfd29f021597ce763889/packages/events/src/events/identity/identity-event.ts#L206)

The site visitor's title.

Format: title case.
