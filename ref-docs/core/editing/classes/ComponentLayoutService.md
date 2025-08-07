[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / ComponentLayoutService

# Class: ComponentLayoutService

Defined in: [packages/core/src/editing/component-layout-service.ts:72](https://github.com/Sitecore/content-sdk/blob/ae819759c6e7c39e054c147681b8ed7674a5243e/packages/core/src/editing/component-layout-service.ts#L72)

REST service that enables Design Library functionality.
Returns layout data for a single rendered component.

## Constructors

### Constructor

> **new ComponentLayoutService**(`config`): `ComponentLayoutService`

Defined in: [packages/core/src/editing/component-layout-service.ts:73](https://github.com/Sitecore/content-sdk/blob/ae819759c6e7c39e054c147681b8ed7674a5243e/packages/core/src/editing/component-layout-service.ts#L73)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `ComponentLayoutServiceConfig` |

#### Returns

`ComponentLayoutService`

## Methods

### fetchComponentData()

> **fetchComponentData**(`params`, `fetchOptions?`): `Promise`\<[`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)\>

Defined in: [packages/core/src/editing/component-layout-service.ts:75](https://github.com/Sitecore/content-sdk/blob/ae819759c6e7c39e054c147681b8ed7674a5243e/packages/core/src/editing/component-layout-service.ts#L75)

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

Defined in: [packages/core/src/editing/component-layout-service.ts:107](https://github.com/Sitecore/content-sdk/blob/ae819759c6e7c39e054c147681b8ed7674a5243e/packages/core/src/editing/component-layout-service.ts#L107)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`ComponentLayoutRequestParams`](../interfaces/ComponentLayoutRequestParams.md) |

#### Returns

`any`
