[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / getDefaultCookieAttributes

# Function: getDefaultCookieAttributes()

> **getDefaultCookieAttributes**(`maxAge?`, `cookieDomain?`): [`CookieProperties`](../../utils/interfaces/CookieProperties.md)

Defined in: [analytics-core/src/cookie/get-default-cookie-attributes.ts:11](https://github.com/Sitecore/content-sdk/blob/12c0a210ef65690d61f7ca0dbaa89ebf79d5ebb3/packages/analytics-core/src/cookie/get-default-cookie-attributes.ts#L11)

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
