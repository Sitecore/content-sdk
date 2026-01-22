[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / getDefaultCookieAttributes

# Function: getDefaultCookieAttributes()

> **getDefaultCookieAttributes**(`maxAge?`, `cookieDomain?`): `CookieProperties`

Defined in: [src/cookie/get-default-cookie-attributes.ts:10](https://github.com/Sitecore/content-sdk/blob/e70bcf4a0aa34d1ca05e3c9f8e1720f1c4be4408/packages/analytics-core/src/cookie/get-default-cookie-attributes.ts#L10)

Gets the default cookie attributes.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `maxAge?` | `number` | `DEFAULT_COOKIE_EXPIRY_DAYS` | Sets the cookie "Max-Age" attribute in days. |
| `cookieDomain?` | `string` | `undefined` | Optional domain for the cookie. |

## Returns

`CookieProperties`

The default configuration settings for the cookie string.
