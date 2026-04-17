[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / AnalyticsOptions

# Interface: AnalyticsOptions

Defined in: [analytics-core/src/initialization/types.ts:36](https://github.com/Sitecore/content-sdk/blob/fd717ff9011a06b489cdebb45197092600bc6c8a/packages/analytics-core/src/initialization/types.ts#L36)

Defines options for the Analytics plugin.

## Properties

### cookies

> **cookies**: `object`

Defined in: [analytics-core/src/initialization/types.ts:40](https://github.com/Sitecore/content-sdk/blob/fd717ff9011a06b489cdebb45197092600bc6c8a/packages/analytics-core/src/initialization/types.ts#L40)

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

Defined in: [analytics-core/src/initialization/types.ts:69](https://github.com/Sitecore/content-sdk/blob/fd717ff9011a06b489cdebb45197092600bc6c8a/packages/analytics-core/src/initialization/types.ts#L69)

The timeout duration for the analytics plugin, in milliseconds.

***

### visitorIds?

> `optional` **visitorIds?**: [`VisitorIds`](VisitorIds.md)

Defined in: [analytics-core/src/initialization/types.ts:65](https://github.com/Sitecore/content-sdk/blob/fd717ff9011a06b489cdebb45197092600bc6c8a/packages/analytics-core/src/initialization/types.ts#L65)

The visitor IDs returned from the Edge Proxy.
