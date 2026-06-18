[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / ExpressResponse

# Interface: ExpressResponse

Defined in: [packages/angular/src/config/http-types.ts:27](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/config/http-types.ts#L27)

Minimal Express Response interface for type safety without requiring Express as a dependency

## Methods

### cookie()?

> `optional` **cookie**(`name`, `value`, `options?`): `void`

Defined in: [packages/angular/src/config/http-types.ts:43](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/config/http-types.ts#L43)

Set a response cookie. Used by multisite middleware to set the site cookie.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `value` | `string` |
| `options?` | `CookieOptions` |

#### Returns

`void`

***

### json()

> **json**(`data`): `void`

Defined in: [packages/angular/src/config/http-types.ts:29](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/config/http-types.ts#L29)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `unknown` |

#### Returns

`void`

***

### send()?

> `optional` **send**(`body`): `void`

Defined in: [packages/angular/src/config/http-types.ts:34](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/config/http-types.ts#L34)

Send a raw response body (string, Buffer, null, etc.). Used for HTML
responses (editing render endpoint) and 204 no-content replies.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `body` | `unknown` |

#### Returns

`void`

***

### setHeader()?

> `optional` **setHeader**(`name`, `value`): `void`

Defined in: [packages/angular/src/config/http-types.ts:39](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/config/http-types.ts#L39)

Set a response header. Used by editing middleware to apply CORS / CSP
headers without depending on Express types directly.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `value` | `string` \| `string`[] |

#### Returns

`void`

***

### status()

> **status**(`code`): `ExpressResponse`

Defined in: [packages/angular/src/config/http-types.ts:28](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/config/http-types.ts#L28)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | `number` |

#### Returns

`ExpressResponse`
