[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / AnalyticsProxyAdapter

# Interface: AnalyticsProxyAdapter

Defined in: [nextjs/src/initialization/proxy/analytics-adapter.ts:16](https://github.com/Sitecore/content-sdk/blob/0325d614f670aabc44a25c7deff996ace6a1fe8c/packages/nextjs/src/initialization/proxy/analytics-adapter.ts#L16)

Defines the AnalyticsProxyAdapter.

## Extends

- `AnalyticsAdapter`

## Properties

### getClientId

> **getClientId**: () => `string` \| `null`

Defined in: analytics-core/types/src/initialization/types.d.ts:18

Gets the client ID.

#### Returns

`string` \| `null`

The client ID, or null if it is not set.

#### Inherited from

`AnalyticsAdapter.getClientId`

***

### isBot?

> `optional` **isBot?**: () => `boolean`

Defined in: analytics-core/types/src/initialization/types.d.ts:13

Checks if the current request is a bot.

#### Returns

`boolean`

True if the current request is a bot, false otherwise.

#### Inherited from

`AnalyticsAdapter.isBot`

***

### location

> **location**: `object`

Defined in: analytics-core/types/src/initialization/types.d.ts:27

The location object, which provides a method for getting search parameters.

#### getSearchParams

> **getSearchParams**: () => `string`

Gets the search parameters from the location.

##### Returns

`string`

The search parameters from the location.

#### Inherited from

`AnalyticsAdapter.location`

***

### setClientId

> **setClientId**: () => `Promise`\<`void`\>

Defined in: analytics-core/types/src/initialization/types.d.ts:23

Sets the client ID.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the client ID has been set.

#### Inherited from

`AnalyticsAdapter.setClientId`

***

### type

> **type**: `"proxy"`

Defined in: [nextjs/src/initialization/proxy/analytics-adapter.ts:20](https://github.com/Sitecore/content-sdk/blob/0325d614f670aabc44a25c7deff996ace6a1fe8c/packages/nextjs/src/initialization/proxy/analytics-adapter.ts#L20)

The type of the adapter.

#### Overrides

`AnalyticsAdapter.type`
