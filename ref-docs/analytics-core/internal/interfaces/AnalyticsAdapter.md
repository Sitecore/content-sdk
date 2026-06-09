[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / AnalyticsAdapter

# Interface: AnalyticsAdapter

Defined in: [analytics-core/src/initialization/types.ts:9](https://github.com/Sitecore/content-sdk/blob/585d583b22461a5fc38589fdf351e01bd3e65204/packages/analytics-core/src/initialization/types.ts#L9)

Defines the structure of the analytics adapter, including methods for getting and setting the client ID, and retrieving search parameters from the location.

## Extends

- `PluginAdapter`

## Extended by

- [`AnalyticsServerAdapter`](../../index/interfaces/AnalyticsServerAdapter.md)
- [`AnalyticsBrowserAdapter`](../../index/interfaces/AnalyticsBrowserAdapter.md)

## Properties

### getClientId

> **getClientId**: () => `string` \| `null`

Defined in: [analytics-core/src/initialization/types.ts:19](https://github.com/Sitecore/content-sdk/blob/585d583b22461a5fc38589fdf351e01bd3e65204/packages/analytics-core/src/initialization/types.ts#L19)

Gets the client ID.

#### Returns

`string` \| `null`

The client ID, or null if it is not set.

***

### isBot?

> `optional` **isBot?**: () => `boolean`

Defined in: [analytics-core/src/initialization/types.ts:14](https://github.com/Sitecore/content-sdk/blob/585d583b22461a5fc38589fdf351e01bd3e65204/packages/analytics-core/src/initialization/types.ts#L14)

Checks if the current request is a bot.

#### Returns

`boolean`

True if the current request is a bot, false otherwise.

***

### location

> **location**: `object`

Defined in: [analytics-core/src/initialization/types.ts:28](https://github.com/Sitecore/content-sdk/blob/585d583b22461a5fc38589fdf351e01bd3e65204/packages/analytics-core/src/initialization/types.ts#L28)

The location object, which provides a method for getting search parameters.

#### getSearchParams

> **getSearchParams**: () => `string`

Gets the search parameters from the location.

##### Returns

`string`

The search parameters from the location.

***

### setClientId

> **setClientId**: () => `Promise`\<`void`\>

Defined in: [analytics-core/src/initialization/types.ts:24](https://github.com/Sitecore/content-sdk/blob/585d583b22461a5fc38589fdf351e01bd3e65204/packages/analytics-core/src/initialization/types.ts#L24)

Sets the client ID.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the client ID has been set.

***

### type

> **type**: `"browser"` \| `string` & `object`

Defined in: core/types/initialization/types.d.ts:87

#### Inherited from

`PluginAdapter.type`
