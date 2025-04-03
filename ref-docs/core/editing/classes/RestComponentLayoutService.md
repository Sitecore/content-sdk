[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / RestComponentLayoutService

# Class: RestComponentLayoutService

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:91](https://github.com/Sitecore/content-sdk/blob/8372963af6d72e215aef15561296762273d04314/packages/core/src/editing/rest-component-layout-service.ts#L91)

REST service that enables Design Library functioality
Makes a request to /sitecore/api/layout/component in 'library' mode in Pages.
Returns layoutData for one single rendered component

## Constructors

### new RestComponentLayoutService()

> **new RestComponentLayoutService**(`config`): [`RestComponentLayoutService`](RestComponentLayoutService.md)

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:92](https://github.com/Sitecore/content-sdk/blob/8372963af6d72e215aef15561296762273d04314/packages/core/src/editing/rest-component-layout-service.ts#L92)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `RestLayoutServiceConfig` |

#### Returns

[`RestComponentLayoutService`](RestComponentLayoutService.md)

## Methods

### fetchComponentData()

> **fetchComponentData**(`params`, `req`?, `res`?): `Promise`\<[`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)\>

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:94](https://github.com/Sitecore/content-sdk/blob/8372963af6d72e215aef15561296762273d04314/packages/core/src/editing/rest-component-layout-service.ts#L94)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`ComponentLayoutRequestParams`](../interfaces/ComponentLayoutRequestParams.md) |
| `req`? | `IncomingMessage` |
| `res`? | `ServerResponse` |

#### Returns

`Promise`\<[`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)\>

***

### getComponentFetchParams()

> `protected` **getComponentFetchParams**(`params`): `any`

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:160](https://github.com/Sitecore/content-sdk/blob/8372963af6d72e215aef15561296762273d04314/packages/core/src/editing/rest-component-layout-service.ts#L160)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | [`ComponentLayoutRequestParams`](../interfaces/ComponentLayoutRequestParams.md) |

#### Returns

`any`

***

### getDefaultFetcher()

> `protected` **getDefaultFetcher**\<`T`\>(`req`?): (`url`, `data`?) => `Promise`\<[`NativeDataFetcherResponse`](../../index/interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:143](https://github.com/Sitecore/content-sdk/blob/8372963af6d72e215aef15561296762273d04314/packages/core/src/editing/rest-component-layout-service.ts#L143)

Provides default

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req`? | `IncomingMessage` | Request instance |

#### Returns

`Function`

default fetcher

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | `string` |
| `data`? | `RequestInit` |

##### Returns

`Promise`\<[`NativeDataFetcherResponse`](../../index/interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

#### See

NativeDataFetcher data fetcher

***

### getFetcher()

> `protected` **getFetcher**(`req`?, `res`?): `HttpDataFetcher`\<[`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)\> \| (`url`, `data`?) => `Promise`\<[`NativeDataFetcherResponse`](../../index/interfaces/NativeDataFetcherResponse.md)\<[`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)\>\>

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:121](https://github.com/Sitecore/content-sdk/blob/8372963af6d72e215aef15561296762273d04314/packages/core/src/editing/rest-component-layout-service.ts#L121)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req`? | `IncomingMessage` |
| `res`? | `ServerResponse` |

#### Returns

`HttpDataFetcher`\<[`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)\> \| (`url`, `data`?) => `Promise`\<[`NativeDataFetcherResponse`](../../index/interfaces/NativeDataFetcherResponse.md)\<[`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md)\>\>

***

### resolveLayoutServiceUrl()

> `protected` **resolveLayoutServiceUrl**(`apiType`): `string`

Defined in: [packages/core/src/editing/rest-component-layout-service.ts:132](https://github.com/Sitecore/content-sdk/blob/8372963af6d72e215aef15561296762273d04314/packages/core/src/editing/rest-component-layout-service.ts#L132)

Resolves layout service url

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `apiType` | `string` | which layout service API to call ('render' or 'placeholder') |

#### Returns

`string`

the layout service url
