[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [index](../README.md) / AnalyticsPluginParams

# Interface: AnalyticsPluginParams

Defined in: [analytics-core/src/initialization/plugin.ts:19](https://github.com/Sitecore/content-sdk/blob/9329e6e2d33c2b5d7d6c8bef29aa6663d4bb5a71/packages/analytics-core/src/initialization/plugin.ts#L19)

Parameters for creating an analytics plugin.

## Properties

### adapter

> **adapter**: [`AnalyticsAdapter`](../../internal/interfaces/AnalyticsAdapter.md)

Defined in: [analytics-core/src/initialization/plugin.ts:48](https://github.com/Sitecore/content-sdk/blob/9329e6e2d33c2b5d7d6c8bef29aa6663d4bb5a71/packages/analytics-core/src/initialization/plugin.ts#L48)

The adapter to be used for the analytics plugin.

***

### options?

> `optional` **options?**: `object`

Defined in: [analytics-core/src/initialization/plugin.ts:23](https://github.com/Sitecore/content-sdk/blob/9329e6e2d33c2b5d7d6c8bef29aa6663d4bb5a71/packages/analytics-core/src/initialization/plugin.ts#L23)

Optional configuration options for the analytics plugin.

#### cookieDomain?

> `optional` **cookieDomain?**: `string`

The domain for which the cookie is valid.

#### cookieExpiryDays?

> `optional` **cookieExpiryDays?**: `number`

The number of days until the cookie expires.

#### cookiePath?

> `optional` **cookiePath?**: `string`

The path for which the cookie is valid.

#### enableCookie?

> `optional` **enableCookie?**: `boolean`

Whether the cookie should be set.

#### timeout?

> `optional` **timeout?**: `number`

The timeout duration for the analytics plugin, in milliseconds.
