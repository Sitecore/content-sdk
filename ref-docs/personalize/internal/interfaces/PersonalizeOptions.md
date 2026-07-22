[**@sitecore-content-sdk/personalize**](../../README.md)

***

[@sitecore-content-sdk/personalize](../../README.md) / [internal](../README.md) / PersonalizeOptions

# Interface: PersonalizeOptions

Defined in: [personalize/src/initialization/types.ts:62](https://github.com/Sitecore/content-sdk/blob/ce897227369d7cdccf3cbb79b621c67585f7aff6/packages/personalize/src/initialization/types.ts#L62)

Represents the personalize plugin options.

## Properties

### cookies

> **cookies**: `object`

Defined in: [personalize/src/initialization/types.ts:70](https://github.com/Sitecore/content-sdk/blob/ce897227369d7cdccf3cbb79b621c67585f7aff6/packages/personalize/src/initialization/types.ts#L70)

The cookie settings for the personalize plugin, including whether the cookie is enabled and the name of the cookie.

#### enabled

> **enabled**: `boolean`

Whether the sc_cid_personalize cookie is enabled.

#### name

> **name**: `string`

The name of the sc_cid_personalize cookie.

***

### webPersonalization

> **webPersonalization**: `false` \| [`WebPersonalizationOptions`](../../index/interfaces/WebPersonalizationOptions.md)

Defined in: [personalize/src/initialization/types.ts:66](https://github.com/Sitecore/content-sdk/blob/ce897227369d7cdccf3cbb79b621c67585f7aff6/packages/personalize/src/initialization/types.ts#L66)

The web personalization options.
