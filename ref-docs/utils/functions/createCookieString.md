[**@sitecore-content-sdk/utils**](../README.md)

***

[@sitecore-content-sdk/utils](../README.md) / createCookieString

# Function: createCookieString()

> **createCookieString**(`name`, `value`, `attributes`): `string`

Defined in: [cookies/create-cookie-string.ts:10](https://github.com/Sitecore/content-sdk/blob/8e5f2b9913cec1e148485adebc3da876466ee643/packages/utils/src/cookies/create-cookie-string.ts#L10)

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
