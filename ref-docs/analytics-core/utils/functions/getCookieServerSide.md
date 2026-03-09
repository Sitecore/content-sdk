[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [utils](../README.md) / getCookieServerSide

# Function: getCookieServerSide()

> **getCookieServerSide**(`cookiesHeader`, `cookieName`): \{ `name`: `string`; `value`: `string`; \} \| `undefined`

Defined in: [analytics-core/src/utils/cookies/get-cookie-server-side.ts:10](https://github.com/Sitecore/content-sdk/blob/a50d13a7a644b3d4245c574d05c845cda27de456/packages/analytics-core/src/utils/cookies/get-cookie-server-side.ts#L10)

**`Internal`**

Retrieves a cookie from the server-side request header string.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cookiesHeader` | `string` \| `undefined` | Raw `cookie` header contents. |
| `cookieName` | `string` | The cookie name to look up. |

## Returns

\{ `name`: `string`; `value`: `string`; \} \| `undefined`

The resolved cookie information when found.
