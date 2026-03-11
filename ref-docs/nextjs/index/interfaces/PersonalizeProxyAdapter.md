[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / PersonalizeProxyAdapter

# Interface: PersonalizeProxyAdapter

Defined in: [nextjs/src/initialization/proxy/personalize-adapter.ts:19](https://github.com/Sitecore/content-sdk/blob/e4d25a1361f2e4c7054948e8cb31a3639dc89fb9/packages/nextjs/src/initialization/proxy/personalize-adapter.ts#L19)

Defines the PersonalizeProxyAdapter.

## Extends

- `Required`\<`PersonalizeAdapter`\>

## Properties

### getProfileId()

> **getProfileId**: () => `string` \| `null`

Defined in: personalize/types/src/initialization/types.d.ts:156

Gets the profile ID. The method returns a string representing the profile ID if it exists, or null if it does not exist.

#### Returns

`string` \| `null`

The profile ID or null if not found.

#### Inherited from

`Required.getProfileId`

***

### getUserAgent()

> **getUserAgent**: () => `string` \| `undefined`

Defined in: personalize/types/src/initialization/types.d.ts:166

Optionally gets the user agent string. The method returns a string representing the user agent if it is available, or undefined if it is not available. This method can be used to provide additional context for personalization based on the user's device or browser.

#### Returns

`string` \| `undefined`

The user agent string or undefined.

#### Inherited from

`Required.getUserAgent`

***

### setProfileId()

> **setProfileId**: () => `Promise`\<`void`\>

Defined in: personalize/types/src/initialization/types.d.ts:161

Sets the profile ID. The method may involve asynchronous operations, such as setting cookies or making API calls, and returns a promise that resolves when the profile ID has been set.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the profile ID has been set.

#### Inherited from

`Required.setProfileId`

***

### type

> **type**: `"proxy"`

Defined in: [nextjs/src/initialization/proxy/personalize-adapter.ts:23](https://github.com/Sitecore/content-sdk/blob/e4d25a1361f2e4c7054948e8cb31a3639dc89fb9/packages/nextjs/src/initialization/proxy/personalize-adapter.ts#L23)

The type of the adapter.

#### Overrides

`Required.type`
