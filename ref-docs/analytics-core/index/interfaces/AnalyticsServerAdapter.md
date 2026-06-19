[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [index](../README.md) / AnalyticsServerAdapter

# Interface: AnalyticsServerAdapter

Defined in: [analytics-core/src/initialization/server-adapter.ts:17](https://github.com/Sitecore/content-sdk/blob/e22cfe2c02eee8993a7e1f934742492c457a5316/packages/analytics-core/src/initialization/server-adapter.ts#L17)

Defines the AnalyticsServerAdapter.

## Extends

- [`AnalyticsAdapter`](../../internal/interfaces/AnalyticsAdapter.md)

## Properties

### getClientId

> **getClientId**: () => `string` \| `null`

Defined in: [analytics-core/src/initialization/types.ts:19](https://github.com/Sitecore/content-sdk/blob/e22cfe2c02eee8993a7e1f934742492c457a5316/packages/analytics-core/src/initialization/types.ts#L19)

Gets the client ID.

#### Returns

`string` \| `null`

The client ID, or null if it is not set.

#### Inherited from

[`AnalyticsAdapter`](../../internal/interfaces/AnalyticsAdapter.md).[`getClientId`](../../internal/interfaces/AnalyticsAdapter.md#getclientid)

***

### isBot?

> `optional` **isBot?**: () => `boolean`

Defined in: [analytics-core/src/initialization/types.ts:14](https://github.com/Sitecore/content-sdk/blob/e22cfe2c02eee8993a7e1f934742492c457a5316/packages/analytics-core/src/initialization/types.ts#L14)

Checks if the current request is a bot.

#### Returns

`boolean`

True if the current request is a bot, false otherwise.

#### Inherited from

[`AnalyticsAdapter`](../../internal/interfaces/AnalyticsAdapter.md).[`isBot`](../../internal/interfaces/AnalyticsAdapter.md#isbot)

***

### location

> **location**: `object`

Defined in: [analytics-core/src/initialization/types.ts:28](https://github.com/Sitecore/content-sdk/blob/e22cfe2c02eee8993a7e1f934742492c457a5316/packages/analytics-core/src/initialization/types.ts#L28)

The location object, which provides a method for getting search parameters.

#### getSearchParams

> **getSearchParams**: () => `string`

Gets the search parameters from the location.

##### Returns

`string`

The search parameters from the location.

#### Inherited from

[`AnalyticsAdapter`](../../internal/interfaces/AnalyticsAdapter.md).[`location`](../../internal/interfaces/AnalyticsAdapter.md#location)

***

### setClientId

> **setClientId**: () => `Promise`\<`void`\>

Defined in: [analytics-core/src/initialization/types.ts:24](https://github.com/Sitecore/content-sdk/blob/e22cfe2c02eee8993a7e1f934742492c457a5316/packages/analytics-core/src/initialization/types.ts#L24)

Sets the client ID.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the client ID has been set.

#### Inherited from

[`AnalyticsAdapter`](../../internal/interfaces/AnalyticsAdapter.md).[`setClientId`](../../internal/interfaces/AnalyticsAdapter.md#setclientid)

***

### type

> **type**: `"server"`

Defined in: [analytics-core/src/initialization/server-adapter.ts:21](https://github.com/Sitecore/content-sdk/blob/e22cfe2c02eee8993a7e1f934742492c457a5316/packages/analytics-core/src/initialization/server-adapter.ts#L21)

The type of the adapter.

#### Overrides

[`AnalyticsAdapter`](../../internal/interfaces/AnalyticsAdapter.md).[`type`](../../internal/interfaces/AnalyticsAdapter.md#type)
