[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/express](../README.md) / ExpressResponse

# Interface: ExpressResponse

Defined in: [packages/angular/src/server/models.ts:38](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/server/models.ts#L38)

Minimal Express Response interface for type safety without requiring Express as a dependency

## Methods

### json()

> **json**(`data`): `void`

Defined in: [packages/angular/src/server/models.ts:40](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/server/models.ts#L40)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `unknown` |

#### Returns

`void`

***

### send()?

> `optional` **send**(`body`): `void`

Defined in: [packages/angular/src/server/models.ts:45](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/server/models.ts#L45)

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

Defined in: [packages/angular/src/server/models.ts:50](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/server/models.ts#L50)

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

Defined in: [packages/angular/src/server/models.ts:39](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/server/models.ts#L39)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | `number` |

#### Returns

`ExpressResponse`
