[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / ComponentLayoutService

# Class: ComponentLayoutService

Defined in: [packages/core/src/editing/component-layout-service.ts:71](https://github.com/Sitecore/content-sdk/blob/1895b0f9c2d1368b07383f85311d808a73aac7bd/packages/core/src/editing/component-layout-service.ts#L71)

REST service that enables Design Library functionality.
Returns layout data for a single rendered component.

## Constructors

### Constructor

> **new ComponentLayoutService**(`config`): `ComponentLayoutService`

Defined in: [packages/core/src/editing/component-layout-service.ts:72](https://github.com/Sitecore/content-sdk/blob/1895b0f9c2d1368b07383f85311d808a73aac7bd/packages/core/src/editing/component-layout-service.ts#L72)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `ComponentLayoutServiceConfig` |

#### Returns

`ComponentLayoutService`

## Methods

### fetchComponentData()

> **fetchComponentData**(`params`): `Promise`\<[`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)\>

Defined in: [packages/core/src/editing/component-layout-service.ts:74](https://github.com/Sitecore/content-sdk/blob/1895b0f9c2d1368b07383f85311d808a73aac7bd/packages/core/src/editing/component-layout-service.ts#L74)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`ComponentLayoutRequestParams`](../interfaces/ComponentLayoutRequestParams.md) |

#### Returns

`Promise`\<[`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)\>

***

### getComponentFetchParams()

> `protected` **getComponentFetchParams**(`params`): `any`

Defined in: [packages/core/src/editing/component-layout-service.ts:99](https://github.com/Sitecore/content-sdk/blob/1895b0f9c2d1368b07383f85311d808a73aac7bd/packages/core/src/editing/component-layout-service.ts#L99)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`ComponentLayoutRequestParams`](../interfaces/ComponentLayoutRequestParams.md) |

#### Returns

`any`
