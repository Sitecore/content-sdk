[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / ComponentLayoutService

# Class: ComponentLayoutService

Defined in: [content/src/editing/component-layout-service.ts:77](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/content/src/editing/component-layout-service.ts#L77)

REST service that enables Design Library functionality.
Returns layout data for a single rendered component.

## Constructors

### Constructor

> **new ComponentLayoutService**(`config`): `ComponentLayoutService`

Defined in: [content/src/editing/component-layout-service.ts:78](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/content/src/editing/component-layout-service.ts#L78)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`ComponentLayoutServiceConfig`](../interfaces/ComponentLayoutServiceConfig.md) |

#### Returns

`ComponentLayoutService`

## Methods

### fetchComponentData()

> **fetchComponentData**(`params`, `fetchOptions?`): `Promise`\<[`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)\>

Defined in: [content/src/editing/component-layout-service.ts:80](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/content/src/editing/component-layout-service.ts#L80)

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

Defined in: [content/src/editing/component-layout-service.ts:123](https://github.com/Sitecore/content-sdk/blob/b45166fa9eae2a8af06824103f648e810054a2a5/packages/content/src/editing/component-layout-service.ts#L123)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`ComponentLayoutRequestParams`](../interfaces/ComponentLayoutRequestParams.md) |

#### Returns

`any`
