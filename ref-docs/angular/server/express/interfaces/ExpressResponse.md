[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/express](../README.md) / ExpressResponse

# Interface: ExpressResponse

Defined in: [packages/angular/src/server/models.ts:38](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/server/models.ts#L38)

Minimal Express Response interface for type safety without requiring Express as a dependency

## Methods

### json()

> **json**(`data`): `void`

Defined in: [packages/angular/src/server/models.ts:40](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/server/models.ts#L40)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `unknown` |

#### Returns

`void`

***

### status()

> **status**(`code`): `ExpressResponse`

Defined in: [packages/angular/src/server/models.ts:39](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/server/models.ts#L39)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | `number` |

#### Returns

`ExpressResponse`
