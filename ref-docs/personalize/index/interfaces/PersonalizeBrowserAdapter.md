[**@sitecore-content-sdk/personalize**](../../README.md)

***

[@sitecore-content-sdk/personalize](../../README.md) / [index](../README.md) / PersonalizeBrowserAdapter

# Interface: PersonalizeBrowserAdapter

Defined in: [personalize/src/initialization/browser-adapter.ts:19](https://github.com/Sitecore/content-sdk/blob/2204da329c1296334b71f674795af93d93d50ee9/packages/personalize/src/initialization/browser-adapter.ts#L19)

Defines the PersonalizeBrowserAdapter.

## Extends

- [`PersonalizeAdapter`](../../internal/interfaces/PersonalizeAdapter.md)

## Properties

### getProfileId

> **getProfileId**: () => `string` \| `null`

Defined in: [personalize/src/initialization/types.ts:165](https://github.com/Sitecore/content-sdk/blob/2204da329c1296334b71f674795af93d93d50ee9/packages/personalize/src/initialization/types.ts#L165)

Gets the profile ID. The method returns a string representing the profile ID if it exists, or null if it does not exist.

#### Returns

`string` \| `null`

The profile ID or null if not found.

#### Inherited from

[`PersonalizeAdapter`](../../internal/interfaces/PersonalizeAdapter.md).[`getProfileId`](../../internal/interfaces/PersonalizeAdapter.md#getprofileid)

***

### getUserAgent?

> `optional` **getUserAgent?**: () => `string` \| `undefined`

Defined in: [personalize/src/initialization/types.ts:175](https://github.com/Sitecore/content-sdk/blob/2204da329c1296334b71f674795af93d93d50ee9/packages/personalize/src/initialization/types.ts#L175)

Optionally gets the user agent string. The method returns a string representing the user agent if it is available, or undefined if it is not available. This method can be used to provide additional context for personalization based on the user's device or browser.

#### Returns

`string` \| `undefined`

The user agent string or undefined.

#### Inherited from

[`PersonalizeAdapter`](../../internal/interfaces/PersonalizeAdapter.md).[`getUserAgent`](../../internal/interfaces/PersonalizeAdapter.md#getuseragent)

***

### setProfileId

> **setProfileId**: () => `Promise`\<`void`\>

Defined in: [personalize/src/initialization/types.ts:170](https://github.com/Sitecore/content-sdk/blob/2204da329c1296334b71f674795af93d93d50ee9/packages/personalize/src/initialization/types.ts#L170)

Sets the profile ID. The method may involve asynchronous operations, such as setting cookies or making API calls, and returns a promise that resolves when the profile ID has been set.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the profile ID has been set.

#### Inherited from

[`PersonalizeAdapter`](../../internal/interfaces/PersonalizeAdapter.md).[`setProfileId`](../../internal/interfaces/PersonalizeAdapter.md#setprofileid)

***

### type

> **type**: `"browser"`

Defined in: [personalize/src/initialization/browser-adapter.ts:23](https://github.com/Sitecore/content-sdk/blob/2204da329c1296334b71f674795af93d93d50ee9/packages/personalize/src/initialization/browser-adapter.ts#L23)

The type of the adapter.

#### Overrides

[`PersonalizeAdapter`](../../internal/interfaces/PersonalizeAdapter.md).[`type`](../../internal/interfaces/PersonalizeAdapter.md#type)
