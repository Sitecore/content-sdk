[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / ComponentLayoutService

# Class: ComponentLayoutService

Defined in: [packages/core/src/editing/component-layout-service.ts:66](https://github.com/Sitecore/content-sdk/blob/ac18aa626926b59845cdeeca2e9297ea0848eb52/packages/core/src/editing/component-layout-service.ts#L66)

REST service that enables design Library functionality
Returns layoutData for one single rendered component

## Constructors

### Constructor

> **new ComponentLayoutService**(`config`): `ComponentLayoutService`

Defined in: [packages/core/src/editing/component-layout-service.ts:67](https://github.com/Sitecore/content-sdk/blob/ac18aa626926b59845cdeeca2e9297ea0848eb52/packages/core/src/editing/component-layout-service.ts#L67)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `ComponentLayoutServiceConfig` |

#### Returns

`ComponentLayoutService`

## Methods

### fetchComponentData()

> **fetchComponentData**(`params`): `Promise`\<[`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)\>

Defined in: [packages/core/src/editing/component-layout-service.ts:69](https://github.com/Sitecore/content-sdk/blob/ac18aa626926b59845cdeeca2e9297ea0848eb52/packages/core/src/editing/component-layout-service.ts#L69)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`ComponentLayoutRequestParams`](../interfaces/ComponentLayoutRequestParams.md) |

#### Returns

`Promise`\<[`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)\>

***

### getComponentFetchParams()

> `protected` **getComponentFetchParams**(`params`): `any`

Defined in: [packages/core/src/editing/component-layout-service.ts:101](https://github.com/Sitecore/content-sdk/blob/ac18aa626926b59845cdeeca2e9297ea0848eb52/packages/core/src/editing/component-layout-service.ts#L101)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`ComponentLayoutRequestParams`](../interfaces/ComponentLayoutRequestParams.md) |

#### Returns

`any`
