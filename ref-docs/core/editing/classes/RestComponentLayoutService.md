[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / RestComponentLayoutService

# Class: RestComponentLayoutService

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:61](https://github.com/Sitecore/content-sdk/blob/439267f739dcf95c3ad760634459881e9038f20d/packages/core/src/editing/rest-component-layout-service.ts#L61)

REST service that enables design Library functionality
Returns layoutData for one single rendered component

## Constructors

### Constructor

> **new RestComponentLayoutService**(`config`): `RestComponentLayoutService`

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:62](https://github.com/Sitecore/content-sdk/blob/439267f739dcf95c3ad760634459881e9038f20d/packages/core/src/editing/rest-component-layout-service.ts#L62)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `RestComponentLayoutServiceConfig` |

#### Returns

`RestComponentLayoutService`

## Methods

### fetchComponentData()

> **fetchComponentData**(`params`): `Promise`\<[`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)\>

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:64](https://github.com/Sitecore/content-sdk/blob/439267f739dcf95c3ad760634459881e9038f20d/packages/core/src/editing/rest-component-layout-service.ts#L64)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`ComponentLayoutRequestParams`](../interfaces/ComponentLayoutRequestParams.md) |

#### Returns

`Promise`\<[`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)\>

***

### getComponentFetchParams()

> `protected` **getComponentFetchParams**(`params`): `any`

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:92](https://github.com/Sitecore/content-sdk/blob/439267f739dcf95c3ad760634459881e9038f20d/packages/core/src/editing/rest-component-layout-service.ts#L92)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`ComponentLayoutRequestParams`](../interfaces/ComponentLayoutRequestParams.md) |

#### Returns

`any`
