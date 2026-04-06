[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / ComponentLayoutService

# Class: ComponentLayoutService

Defined in: [content/src/editing/component-layout-service.ts:79](https://github.com/Sitecore/content-sdk/blob/6637a5cdd65fb19a328565a2dd7accc61598d2f1/packages/content/src/editing/component-layout-service.ts#L79)

REST service that enables Design Library functionality.
Returns layout data for a single rendered component.

## Constructors

### Constructor

> **new ComponentLayoutService**(`config`): `ComponentLayoutService`

Defined in: [content/src/editing/component-layout-service.ts:80](https://github.com/Sitecore/content-sdk/blob/6637a5cdd65fb19a328565a2dd7accc61598d2f1/packages/content/src/editing/component-layout-service.ts#L80)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`ComponentLayoutServiceConfig`](../interfaces/ComponentLayoutServiceConfig.md) |

#### Returns

`ComponentLayoutService`

## Methods

### fetchComponentData()

> **fetchComponentData**(`params`, `fetchOptions?`): `Promise`\<[`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)\>

Defined in: [content/src/editing/component-layout-service.ts:82](https://github.com/Sitecore/content-sdk/blob/6637a5cdd65fb19a328565a2dd7accc61598d2f1/packages/content/src/editing/component-layout-service.ts#L82)

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

Defined in: [content/src/editing/component-layout-service.ts:122](https://github.com/Sitecore/content-sdk/blob/6637a5cdd65fb19a328565a2dd7accc61598d2f1/packages/content/src/editing/component-layout-service.ts#L122)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`ComponentLayoutRequestParams`](../interfaces/ComponentLayoutRequestParams.md) |

#### Returns

`any`
