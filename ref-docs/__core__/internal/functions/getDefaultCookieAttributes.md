[**@sitecore-content-sdk/__core__**](../../README.md)

***

[@sitecore-content-sdk/__core__](../../README.md) / [internal](../README.md) / getDefaultCookieAttributes

# Function: getDefaultCookieAttributes()

> **getDefaultCookieAttributes**(`maxAge?`, `cookieDomain?`): `CookieProperties`

Defined in: [src/cookie/get-default-cookie-attributes.ts:10](https://github.com/Sitecore/content-sdk/blob/0047c4587b25d5bd56acc3affb1056399099369e/packages/__core__/src/cookie/get-default-cookie-attributes.ts#L10)

Gets the default cookie attributes.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `maxAge?` | `number` | `DEFAULT_COOKIE_EXPIRY_DAYS` | Sets the cookie "Max-Age" attribute in days. |
| `cookieDomain?` | `string` | `undefined` | Optional domain for the cookie. |

## Returns

`CookieProperties`

The default configuration settings for the cookie string.
