[**@sitecore-content-sdk/personalize**](../../README.md)

***

[@sitecore-content-sdk/personalize](../../README.md) / [index](../README.md) / PersonalizeServerAdapter

# Interface: PersonalizeServerAdapter

Defined in: [personalize/src/initialization/server-adapter.ts:20](https://github.com/Sitecore/content-sdk/blob/6b5ddb46afb5e20b513a1bf5d7977b5cb27bfdc2/packages/personalize/src/initialization/server-adapter.ts#L20)

Defines the PersonalizeServerAdapter.

## Extends

- [`PersonalizeAdapter`](../../internal/interfaces/PersonalizeAdapter.md)

## Properties

### getProfileId

> **getProfileId**: () => `string` \| `null`

Defined in: [personalize/src/initialization/types.ts:165](https://github.com/Sitecore/content-sdk/blob/6b5ddb46afb5e20b513a1bf5d7977b5cb27bfdc2/packages/personalize/src/initialization/types.ts#L165)

Gets the profile ID. The method returns a string representing the profile ID if it exists, or null if it does not exist.

#### Returns

`string` \| `null`

The profile ID or null if not found.

#### Inherited from

[`PersonalizeAdapter`](../../internal/interfaces/PersonalizeAdapter.md).[`getProfileId`](../../internal/interfaces/PersonalizeAdapter.md#getprofileid)

***

### getUserAgent

> **getUserAgent**: (() => `string` \| `undefined`) \| `undefined`

Defined in: [personalize/src/initialization/server-adapter.ts:28](https://github.com/Sitecore/content-sdk/blob/6b5ddb46afb5e20b513a1bf5d7977b5cb27bfdc2/packages/personalize/src/initialization/server-adapter.ts#L28)

Gets the user agent from the request headers.

#### Overrides

[`PersonalizeAdapter`](../../internal/interfaces/PersonalizeAdapter.md).[`getUserAgent`](../../internal/interfaces/PersonalizeAdapter.md#getuseragent)

***

### setProfileId

> **setProfileId**: () => `Promise`\<`void`\>

Defined in: [personalize/src/initialization/types.ts:170](https://github.com/Sitecore/content-sdk/blob/6b5ddb46afb5e20b513a1bf5d7977b5cb27bfdc2/packages/personalize/src/initialization/types.ts#L170)

Sets the profile ID. The method may involve asynchronous operations, such as setting cookies or making API calls, and returns a promise that resolves when the profile ID has been set.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the profile ID has been set.

#### Inherited from

[`PersonalizeAdapter`](../../internal/interfaces/PersonalizeAdapter.md).[`setProfileId`](../../internal/interfaces/PersonalizeAdapter.md#setprofileid)

***

### type

> **type**: `"server"`

Defined in: [personalize/src/initialization/server-adapter.ts:24](https://github.com/Sitecore/content-sdk/blob/6b5ddb46afb5e20b513a1bf5d7977b5cb27bfdc2/packages/personalize/src/initialization/server-adapter.ts#L24)

The type of the adapter.

#### Overrides

[`PersonalizeAdapter`](../../internal/interfaces/PersonalizeAdapter.md).[`type`](../../internal/interfaces/PersonalizeAdapter.md#type)
