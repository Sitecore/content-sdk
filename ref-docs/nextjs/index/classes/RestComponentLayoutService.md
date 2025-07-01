[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / RestComponentLayoutService

# Class: RestComponentLayoutService

Defined in: core/types/editing/rest-component-layout-service.d.ts:59

REST service that enables design Library functionality
Returns layoutData for one single rendered component

## Constructors

### Constructor

> **new RestComponentLayoutService**(`config`): `RestComponentLayoutService`

Defined in: core/types/editing/rest-component-layout-service.d.ts:61

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `RestComponentLayoutServiceConfig` |

#### Returns

`RestComponentLayoutService`

## Methods

### fetchComponentData()

> **fetchComponentData**(`params`): `Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

Defined in: core/types/editing/rest-component-layout-service.d.ts:62

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `ComponentLayoutRequestParams` |

#### Returns

`Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

***

### getComponentFetchParams()

> `protected` **getComponentFetchParams**(`params`): `any`

Defined in: core/types/editing/rest-component-layout-service.d.ts:63

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `ComponentLayoutRequestParams` |

#### Returns

`any`
