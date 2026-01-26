[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / getCookieValueFromRequest

# Function: getCookieValueFromRequest()

> **getCookieValueFromRequest**\<`T`\>(`request`, `cookieName`): `string`

Defined in: [src/cookie/get-cookie-value-from-request.ts:11](https://github.com/Sitecore/content-sdk/blob/c20313995d1da0b945f07f6cca98ae0c9ec5ea79/packages/analytics-core/src/cookie/get-cookie-value-from-request.ts#L11)

Retrieves the cookie value from the provided request object, using the specified `cookieName`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Request` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | `T` | The request object, either a middleware request or an HTTP request. |
| `cookieName` | `string` | The name of the cookie to retrieve the cookie value from. |

## Returns

`string`

The cookie value extracted from the cookie or an empty string if not found.
