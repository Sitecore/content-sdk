[**@sitecore-content-sdk/__core__**](../../README.md)

***

[@sitecore-content-sdk/__core__](../../README.md) / [internal](../README.md) / getCookieValueFromRequest

# Function: getCookieValueFromRequest()

> **getCookieValueFromRequest**\<`T`\>(`request`, `cookieName`): `string`

Defined in: [src/cookie/get-cookie-value-from-request.ts:15](https://github.com/Sitecore/content-sdk/blob/2646e29add542674aa036ec1a2cad4404a52dd59/packages/__core__/src/cookie/get-cookie-value-from-request.ts#L15)

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
