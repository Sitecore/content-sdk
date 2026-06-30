[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / getDefaultCookieAttributes

# Function: getDefaultCookieAttributes()

> **getDefaultCookieAttributes**(`maxAge?`, `cookieDomain?`): [`CookieProperties`](../../utils/interfaces/CookieProperties.md)

Defined in: [analytics-core/src/cookie/get-default-cookie-attributes.ts:11](https://github.com/Sitecore/content-sdk/blob/2bff473046a060366910aa0397f8f2e70caf088d/packages/analytics-core/src/cookie/get-default-cookie-attributes.ts#L11)

**`Internal`**

Gets the default cookie attributes.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `maxAge?` | `number` | `DEFAULT_COOKIE_EXPIRY_DAYS` | Sets the cookie "Max-Age" attribute in days. |
| `cookieDomain?` | `string` | `undefined` | Optional domain for the cookie. |

## Returns

[`CookieProperties`](../../utils/interfaces/CookieProperties.md)

The default configuration settings for the cookie string.
