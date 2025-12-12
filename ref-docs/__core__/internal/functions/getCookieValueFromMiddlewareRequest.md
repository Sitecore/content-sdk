[**@sitecore-content-sdk/__core__**](../../README.md)

***

[@sitecore-content-sdk/__core__](../../README.md) / [internal](../README.md) / getCookieValueFromMiddlewareRequest

# Function: getCookieValueFromMiddlewareRequest()

> **getCookieValueFromMiddlewareRequest**(`request`, `cookieName`): `string` \| `undefined`

Defined in: [src/cookie/get-cookie-value-from-middleware-request.ts:11](https://github.com/Sitecore/content-sdk/blob/0047c4587b25d5bd56acc3affb1056399099369e/packages/__core__/src/cookie/get-cookie-value-from-middleware-request.ts#L11)

Extracts the cookie value from the provided middleware request by reading the
given `cookieName`. The function first checks for Next.js v12 cookie values,
and if not found, it checks for Next.js v13 cookie values.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `MiddlewareRequest` | The middleware request object. |
| `cookieName` | `string` | The name of the cookie to retrieve. |

## Returns

`string` \| `undefined`

The cookie value extracted from the cookie, or undefined if not found.
