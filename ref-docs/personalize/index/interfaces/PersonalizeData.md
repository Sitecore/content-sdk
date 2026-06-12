[**@sitecore-content-sdk/personalize**](../../README.md)

***

[@sitecore-content-sdk/personalize](../../README.md) / [index](../README.md) / PersonalizeData

# Interface: PersonalizeData

Defined in: [personalize/src/personalization/personalizer.ts:170](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/personalize/src/personalization/personalizer.ts#L170)

An interface that describes the flow execution model attributes input for the library

## Properties

### channel

> **channel**: `string`

Defined in: [personalize/src/personalization/personalizer.ts:177](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/personalize/src/personalization/personalizer.ts#L177)

The touchpoint where the user interacts with your brand.
For example, for webpages, the channel is "WEB". For mobile app screens, the channel is "MOBILE_APP".

Format: uppercase.

***

### currency?

> `optional` **currency?**: `string`

Defined in: [personalize/src/personalization/personalizer.ts:184](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/personalize/src/personalization/personalizer.ts#L184)

The alphabetic currency code of the currency the site visitor uses in your app.
For example, if the site visitor selects Australian dollars as the currency, the currency is "AUD".

Format: uppercase ISO 4217.

***

### email?

> `optional` **email?**: `string`

Defined in: [personalize/src/personalization/personalizer.ts:190](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/personalize/src/personalization/personalizer.ts#L190)

The site visitor's email address.

Format: lowercase recommended.

***

### friendlyId

> **friendlyId**: `string`

Defined in: [personalize/src/personalization/personalizer.ts:195](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/personalize/src/personalization/personalizer.ts#L195)

The unique identifier of the live interactive experience or experiment to run.
To find the friendly ID in Sitecore Personalize, click the live experience or experiment to run, then click Build summary. The friendly ID is in the Details pane.

***

### geo?

> `optional` **geo?**: [`PersonalizeGeolocation`](PersonalizeGeolocation.md)

Defined in: [personalize/src/personalization/personalizer.ts:199](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/personalize/src/personalization/personalizer.ts#L199)

The site visitor's geolocation data.

***

### identifier?

> `optional` **identifier?**: [`PersonalizeIdentifierInput`](PersonalizeIdentifierInput.md)

Defined in: [personalize/src/personalization/personalizer.ts:205](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/personalize/src/personalization/personalizer.ts#L205)

The identifiers used for identifying site visitors.

If set, the experience or experiment runs only for the identified site visitor.

***

### language?

> `optional` **language?**: `string`

Defined in: [personalize/src/personalization/personalizer.ts:216](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/personalize/src/personalization/personalizer.ts#L216)

The language the site visitor interacts with your brand in.
For example, if the site visitor selects the Japanese language in your app, the language is "JA".

Format: uppercase ISO 639.

Default for browser-side events: inferred from the HTML lang attribute. If lang is not specified, the default is an empty string.

Default for server-side events: empty string.

***

### pageVariantIds?

> `optional` **pageVariantIds?**: `string`[]

Defined in: [personalize/src/personalization/personalizer.ts:232](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/personalize/src/personalization/personalizer.ts#L232)

A list of IDs of personalized page variants.

Ensures that the correct variants are rendered for personalization.

If unset or an empty array, this property will not be part of the payload.

***

### params?

> `optional` **params?**: `NestedObject`

Defined in: [personalize/src/personalization/personalizer.ts:224](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/personalize/src/personalization/personalizer.ts#L224)

An object of your choice.

If the URL of the webpage where this function runs contains UTM parameters, those parameters are automatically captured in params.utm.

To override the automatically captured UTM parameters, specify values manually in params.utm.
