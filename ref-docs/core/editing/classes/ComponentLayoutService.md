[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / ComponentLayoutService

# Class: ComponentLayoutService

Defined in: [packages/core/src/editing/component-layout-service.ts:79](https://github.com/Sitecore/content-sdk/blob/569b47a581c50a1e9c14edbc69edab69a694783a/packages/core/src/editing/component-layout-service.ts#L79)

REST service that enables Design Library functionality.
Returns layout data for a single rendered component.

## Constructors

### Constructor

> **new ComponentLayoutService**(`config`): `ComponentLayoutService`

Defined in: [packages/core/src/editing/component-layout-service.ts:80](https://github.com/Sitecore/content-sdk/blob/569b47a581c50a1e9c14edbc69edab69a694783a/packages/core/src/editing/component-layout-service.ts#L80)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`ComponentLayoutServiceConfig`](../interfaces/ComponentLayoutServiceConfig.md) |

#### Returns

`ComponentLayoutService`

## Methods

### fetchComponentData()

> **fetchComponentData**(`params`, `fetchOptions?`): `Promise`\<[`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)\>

Defined in: [packages/core/src/editing/component-layout-service.ts:82](https://github.com/Sitecore/content-sdk/blob/569b47a581c50a1e9c14edbc69edab69a694783a/packages/core/src/editing/component-layout-service.ts#L82)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`ComponentLayoutRequestParams`](../interfaces/ComponentLayoutRequestParams.md) |
| `fetchOptions?` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) |

#### Returns

`Promise`\<[`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)\>

***

### getComponentFetchParams()

> `protected` **getComponentFetchParams**(`params`): `any`

Defined in: [packages/core/src/editing/component-layout-service.ts:114](https://github.com/Sitecore/content-sdk/blob/569b47a581c50a1e9c14edbc69edab69a694783a/packages/core/src/editing/component-layout-service.ts#L114)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`ComponentLayoutRequestParams`](../interfaces/ComponentLayoutRequestParams.md) |

#### Returns

`any`
