[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [utils](../README.md) / createCookieString

# Function: createCookieString()

> **createCookieString**(`name`, `value`, `attributes`): `string`

Defined in: [analytics-core/src/utils/cookies/create-cookie-string.ts:11](https://github.com/Sitecore/content-sdk/blob/f81ac302196d17f88b825b61a78d1f683cc0cb7b/packages/analytics-core/src/utils/cookies/create-cookie-string.ts#L11)

**`Internal`**

Creates a cookie string with the provided attributes.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Cookie name. |
| `value` | `string` | Cookie value. |
| `attributes` | [`CookieProperties`](../interfaces/CookieProperties.md) | Supported cookie attributes. |

## Returns

`string`

Serialized cookie ready to be assigned to `document.cookie`.
