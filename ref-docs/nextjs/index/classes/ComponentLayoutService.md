[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / ComponentLayoutService

# Class: ComponentLayoutService

Defined in: core/types/editing/component-layout-service.d.ts:69

REST service that enables Design Library functionality.
Returns layout data for a single rendered component.

## Constructors

### Constructor

> **new ComponentLayoutService**(`config`): `ComponentLayoutService`

Defined in: core/types/editing/component-layout-service.d.ts:71

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `ComponentLayoutServiceConfig` |

#### Returns

`ComponentLayoutService`

## Methods

### fetchComponentData()

> **fetchComponentData**(`params`, `fetchOptions?`): `Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

Defined in: core/types/editing/component-layout-service.d.ts:72

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `ComponentLayoutRequestParams` |
| `fetchOptions?` | `FetchOptions` |

#### Returns

`Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

***

### getComponentFetchParams()

> `protected` **getComponentFetchParams**(`params`): `any`

Defined in: core/types/editing/component-layout-service.d.ts:73

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `ComponentLayoutRequestParams` |

#### Returns

`any`
