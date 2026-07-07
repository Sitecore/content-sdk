[**@sitecore-content-sdk/personalize**](../../README.md)

***

[@sitecore-content-sdk/personalize](../../README.md) / [internal](../README.md) / PersonalizeAdapter

# Interface: PersonalizeAdapter

Defined in: [personalize/src/initialization/types.ts:160](https://github.com/Sitecore/content-sdk/blob/2aa732fd2d36762c97dbe79aef5930e72524bea4/packages/personalize/src/initialization/types.ts#L160)

Represents the personalize adapter interface that defines the methods to get and set the profile id, and optionally get the user agent.

## Extends

- `PluginAdapter`

## Extended by

- [`PersonalizeServerAdapter`](../../index/interfaces/PersonalizeServerAdapter.md)
- [`PersonalizeBrowserAdapter`](../../index/interfaces/PersonalizeBrowserAdapter.md)

## Properties

### getProfileId

> **getProfileId**: () => `string` \| `null`

Defined in: [personalize/src/initialization/types.ts:165](https://github.com/Sitecore/content-sdk/blob/2aa732fd2d36762c97dbe79aef5930e72524bea4/packages/personalize/src/initialization/types.ts#L165)

Gets the profile ID. The method returns a string representing the profile ID if it exists, or null if it does not exist.

#### Returns

`string` \| `null`

The profile ID or null if not found.

***

### getUserAgent?

> `optional` **getUserAgent?**: () => `string` \| `undefined`

Defined in: [personalize/src/initialization/types.ts:175](https://github.com/Sitecore/content-sdk/blob/2aa732fd2d36762c97dbe79aef5930e72524bea4/packages/personalize/src/initialization/types.ts#L175)

Optionally gets the user agent string. The method returns a string representing the user agent if it is available, or undefined if it is not available. This method can be used to provide additional context for personalization based on the user's device or browser.

#### Returns

`string` \| `undefined`

The user agent string or undefined.

***

### setProfileId

> **setProfileId**: () => `Promise`\<`void`\>

Defined in: [personalize/src/initialization/types.ts:170](https://github.com/Sitecore/content-sdk/blob/2aa732fd2d36762c97dbe79aef5930e72524bea4/packages/personalize/src/initialization/types.ts#L170)

Sets the profile ID. The method may involve asynchronous operations, such as setting cookies or making API calls, and returns a promise that resolves when the profile ID has been set.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the profile ID has been set.

***

### type

> **type**: `"browser"` \| `string` & `object`

Defined in: core/types/initialization/types.d.ts:87

#### Inherited from

`PluginAdapter.type`
