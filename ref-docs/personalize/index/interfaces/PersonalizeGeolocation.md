[**@sitecore-content-sdk/personalize**](../../README.md)

***

[@sitecore-content-sdk/personalize](../../README.md) / [index](../README.md) / PersonalizeGeolocation

# Interface: PersonalizeGeolocation

Defined in: [personalize/src/personalization/personalizer.ts:144](https://github.com/Sitecore/content-sdk/blob/70eccc43077e1c9d1fe9da2ed5681f1cd3574c75/packages/personalize/src/personalization/personalizer.ts#L144)

An interface that describes the geolocation attributes.

## Properties

### city?

> `optional` **city?**: `string`

Defined in: [personalize/src/personalization/personalizer.ts:150](https://github.com/Sitecore/content-sdk/blob/70eccc43077e1c9d1fe9da2ed5681f1cd3574c75/packages/personalize/src/personalization/personalizer.ts#L150)

The site visitor's city.

Format: title case recommended.

***

### country?

> `optional` **country?**: `string`

Defined in: [personalize/src/personalization/personalizer.ts:156](https://github.com/Sitecore/content-sdk/blob/70eccc43077e1c9d1fe9da2ed5681f1cd3574c75/packages/personalize/src/personalization/personalizer.ts#L156)

The site visitor's country.

Format: uppercase ISO 3166-1 alpha-2.

***

### region?

> `optional` **region?**: `string`

Defined in: [personalize/src/personalization/personalizer.ts:163](https://github.com/Sitecore/content-sdk/blob/70eccc43077e1c9d1fe9da2ed5681f1cd3574c75/packages/personalize/src/personalization/personalizer.ts#L163)

The site visitor's region.
Depends on the regional structure of the country.

Format: for example, for Australia, use state and territory abbreviations. For the United States, use ANSI standard INCITS 38:2009.
