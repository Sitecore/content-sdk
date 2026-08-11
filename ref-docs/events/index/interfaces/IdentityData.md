[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / IdentityData

# Interface: IdentityData

Defined in: [events/src/events/identity/identity-event.ts:133](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/identity/identity-event.ts#L133)

Interface with the necessary attributes for the input for sending identity events

## Extends

- [`EventAttributesInput`](EventAttributesInput.md)

## Properties

### channel?

> `optional` **channel?**: `string`

Defined in: [events/src/events/common-interfaces.ts:37](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/common-interfaces.ts#L37)

The touchpoint where the user interacts with your brand.

For example, for webpages, the channel is "WEB". For mobile app screens, the channel is "MOBILE_APP".

Format: uppercase.

If unset, this property will not be part of the payload.

#### Inherited from

[`EventAttributesInput`](EventAttributesInput.md).[`channel`](EventAttributesInput.md#channel)

***

### city?

> `optional` **city?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:139](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/identity/identity-event.ts#L139)

The site visitor's city address.

Format: title case recommended.

***

### country?

> `optional` **country?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:145](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/identity/identity-event.ts#L145)

The site visitor's country address.

Format: uppercase ISO 3166-1 alpha-2.

***

### currency?

> `optional` **currency?**: `string`

Defined in: [events/src/events/common-interfaces.ts:47](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/common-interfaces.ts#L47)

The alphabetic currency code of the currency the site visitor uses in your app.

For example, if the site visitor selects Australian dollars as the currency, the currency is "AUD".

Format: uppercase ISO 4217.

If unset, this property will not be part of the payload.

#### Inherited from

[`EventAttributesInput`](EventAttributesInput.md).[`currency`](EventAttributesInput.md#currency)

***

### dob?

> `optional` **dob?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:151](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/identity/identity-event.ts#L151)

The site visitor's date of birth.

Format: date only, YYYY-MM-DD.

***

### email?

> `optional` **email?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:157](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/identity/identity-event.ts#L157)

The site visitor's email address.

Format: lowercase recommended.

***

### extensionData?

> `optional` **extensionData?**: `NestedObject`

Defined in: [events/src/events/identity/identity-event.ts:211](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/identity/identity-event.ts#L211)

Any custom data to collect about an event in addition to the other attributes provided for the event data.

***

### firstName?

> `optional` **firstName?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:163](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/identity/identity-event.ts#L163)

The site visitor's first name.

Format: title case recommended.

***

### gender?

> `optional` **gender?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:167](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/identity/identity-event.ts#L167)

The site visitor's gender.

***

### identifiers

> **identifiers**: [`Identifier`](Identifier.md)[]

Defined in: [events/src/events/identity/identity-event.ts:171](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/identity/identity-event.ts#L171)

The identifiers used for identifying site visitors.

***

### language?

> `optional` **language?**: `string`

Defined in: [events/src/events/common-interfaces.ts:19](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/common-interfaces.ts#L19)

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

Defined in: [events/src/events/identity/identity-event.ts:177](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/identity/identity-event.ts#L177)

The site visitor's last name.

Format: title case recommended.

***

### mobile?

> `optional` **mobile?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:181](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/identity/identity-event.ts#L181)

The site visitor's mobile number.

***

### page?

> `optional` **page?**: `string`

Defined in: [events/src/events/common-interfaces.ts:27](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/common-interfaces.ts#L27)

The name of the webpage where the interaction with your brand takes place.

Default for browser-side events: for the website root page, "Home Page". For other webpages, inferred from the URL pathname.

Default for server-side events: empty string.

#### Inherited from

[`EventAttributesInput`](EventAttributesInput.md).[`page`](EventAttributesInput.md#page)

***

### phone?

> `optional` **phone?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:185](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/identity/identity-event.ts#L185)

The site visitor's phone number.

***

### postalCode?

> `optional` **postalCode?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:189](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/identity/identity-event.ts#L189)

The site visitor's postal code.

***

### state?

> `optional` **state?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:195](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/identity/identity-event.ts#L195)

The site visitor's state address.

Format: title case recommended.

***

### street?

> `optional` **street?**: `string`[]

Defined in: [events/src/events/identity/identity-event.ts:201](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/identity/identity-event.ts#L201)

The site visitor's street address.

Format: title case recommended.

***

### title?

> `optional` **title?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:207](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/events/src/events/identity/identity-event.ts#L207)

The site visitor's title.

Format: title case.
