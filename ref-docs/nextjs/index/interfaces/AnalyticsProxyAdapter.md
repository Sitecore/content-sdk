[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / AnalyticsProxyAdapter

# Interface: AnalyticsProxyAdapter

Defined in: [nextjs/src/initialization/proxy/analytics-adapter.ts:17](https://github.com/Sitecore/content-sdk/blob/2cc2d29fb8ea55dbe794a0b95c29a8d44bbf2b48/packages/nextjs/src/initialization/proxy/analytics-adapter.ts#L17)

Defines the AnalyticsProxyAdapter.

## Extends

- `AnalyticsAdapter`

## Properties

### getClientId()

> **getClientId**: () => `string` \| `null`

Defined in: analytics-core/types/src/initialization/types.d.ts:13

Gets the client ID.

#### Returns

`string` \| `null`

The client ID, or null if it is not set.

#### Inherited from

`AnalyticsAdapter.getClientId`

***

### location

> **location**: `object`

Defined in: analytics-core/types/src/initialization/types.d.ts:22

The location object, which provides a method for getting search parameters.

#### getSearchParams()

> **getSearchParams**: () => `string`

Gets the search parameters from the location.

##### Returns

`string`

The search parameters from the location.

#### Inherited from

`AnalyticsAdapter.location`

***

### setClientId()

> **setClientId**: () => `Promise`\<`void`\>

Defined in: analytics-core/types/src/initialization/types.d.ts:18

Sets the client ID.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the client ID has been set.

#### Inherited from

`AnalyticsAdapter.setClientId`

***

### type

> **type**: `"proxy"`

Defined in: [nextjs/src/initialization/proxy/analytics-adapter.ts:21](https://github.com/Sitecore/content-sdk/blob/2cc2d29fb8ea55dbe794a0b95c29a8d44bbf2b48/packages/nextjs/src/initialization/proxy/analytics-adapter.ts#L21)

The type of the adapter.

#### Overrides

`AnalyticsAdapter.type`
