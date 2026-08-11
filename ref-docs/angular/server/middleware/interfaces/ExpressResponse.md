[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / ExpressResponse

# Interface: ExpressResponse

Defined in: [packages/angular/src/config/http-types.ts:31](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/angular/src/config/http-types.ts#L31)

Minimal Express Response interface for type safety without requiring Express as a dependency

## Methods

### cookie()?

> `optional` **cookie**(`name`, `value`, `options?`): `void`

Defined in: [packages/angular/src/config/http-types.ts:53](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/angular/src/config/http-types.ts#L53)

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

Defined in: [packages/angular/src/config/http-types.ts:33](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/angular/src/config/http-types.ts#L33)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `unknown` |

#### Returns

`void`

***

### redirect()?

#### Call Signature

> `optional` **redirect**(`url`): `void`

Defined in: [packages/angular/src/config/http-types.ts:48](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/angular/src/config/http-types.ts#L48)

Redirect the client to another URL. Used by the sitemap middleware for 404 fallbacks and by
the redirects middleware (with an explicit status) for 301/302 redirects.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | `string` |

##### Returns

`void`

#### Call Signature

> `optional` **redirect**(`status`, `url`): `void`

Defined in: [packages/angular/src/config/http-types.ts:49](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/angular/src/config/http-types.ts#L49)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `status` | `number` |
| `url` | `string` |

##### Returns

`void`

***

### send()?

> `optional` **send**(`body`): `void`

Defined in: [packages/angular/src/config/http-types.ts:38](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/angular/src/config/http-types.ts#L38)

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

Defined in: [packages/angular/src/config/http-types.ts:43](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/angular/src/config/http-types.ts#L43)

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

Defined in: [packages/angular/src/config/http-types.ts:32](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/angular/src/config/http-types.ts#L32)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | `number` |

#### Returns

`ExpressResponse`
