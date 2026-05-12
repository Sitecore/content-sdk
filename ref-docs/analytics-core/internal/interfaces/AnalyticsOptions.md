[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / AnalyticsOptions

# Interface: AnalyticsOptions

Defined in: [analytics-core/src/initialization/types.ts:41](https://github.com/Sitecore/content-sdk/blob/553b16a67e807643f564a3c5208631654e0b2cef/packages/analytics-core/src/initialization/types.ts#L41)

Defines options for the Analytics plugin.

## Properties

### cookies

> **cookies**: `object`

Defined in: [analytics-core/src/initialization/types.ts:45](https://github.com/Sitecore/content-sdk/blob/553b16a67e807643f564a3c5208631654e0b2cef/packages/analytics-core/src/initialization/types.ts#L45)

The cookie settings for the analytics plugin.

#### domain?

> `optional` **domain?**: `string`

The domain for which the cookie is valid.

#### enabled?

> `optional` **enabled?**: `boolean`

Whether the cookie should be set.

#### expiryDays

> **expiryDays**: `number`

The number of days until the cookie expires.

#### name

> **name**: `string`

The name of the cookie used to store the client ID.

#### path?

> `optional` **path?**: `string`

The path for which the cookie is valid.

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [analytics-core/src/initialization/types.ts:74](https://github.com/Sitecore/content-sdk/blob/553b16a67e807643f564a3c5208631654e0b2cef/packages/analytics-core/src/initialization/types.ts#L74)

The timeout duration for the analytics plugin, in milliseconds.

***

### visitorIds?

> `optional` **visitorIds?**: [`VisitorIds`](VisitorIds.md)

Defined in: [analytics-core/src/initialization/types.ts:70](https://github.com/Sitecore/content-sdk/blob/553b16a67e807643f564a3c5208631654e0b2cef/packages/analytics-core/src/initialization/types.ts#L70)

The visitor IDs returned from the Edge Proxy.
