[**@sitecore-content-sdk/utils**](../README.md)

***

[@sitecore-content-sdk/utils](../README.md) / getCookieServerSide

# Function: getCookieServerSide()

> **getCookieServerSide**(`cookiesHeader`, `cookieName`): \{ `name`: `string`; `value`: `string`; \} \| `undefined`

Defined in: [cookies/get-cookie-server-side.ts:9](https://github.com/Sitecore/content-sdk/blob/6eb16655f677d9f2c9f82dbf67e6f8a92dd58ada/packages/utils/src/cookies/get-cookie-server-side.ts#L9)

Retrieves a cookie from the server-side request header string.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cookiesHeader` | `string` \| `undefined` | Raw `cookie` header contents. |
| `cookieName` | `string` | The cookie name to look up. |

## Returns

\{ `name`: `string`; `value`: `string`; \} \| `undefined`

The resolved cookie information when found.
