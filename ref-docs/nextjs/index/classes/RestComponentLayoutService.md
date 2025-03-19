[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / RestComponentLayoutService

# Class: RestComponentLayoutService

Defined in: core/types/editing/rest-component-layout-service.d.ts:82

REST service that enables Design Library functioality
Makes a request to /sitecore/api/layout/component in 'library' mode in Pages.
Returns layoutData for one single rendered component

## Constructors

### new RestComponentLayoutService()

> **new RestComponentLayoutService**(`config`): [`RestComponentLayoutService`](RestComponentLayoutService.md)

Defined in: core/types/editing/rest-component-layout-service.d.ts:84

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `RestLayoutServiceConfig` |

#### Returns

[`RestComponentLayoutService`](RestComponentLayoutService.md)

## Properties

### getDefaultFetcher()

> `protected` **getDefaultFetcher**: \<`T`\>(`req`?) => (`url`, `data`?) => `Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

Defined in: core/types/editing/rest-component-layout-service.d.ts:98

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

`Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

#### See

NativeDataFetcher data fetcher

***

### getFetcher()

> `protected` **getFetcher**: (`req`?, `res`?) => `HttpDataFetcher`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\> \| (`url`, `data`?) => `Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>\>

Defined in: core/types/editing/rest-component-layout-service.d.ts:86

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req`? | `IncomingMessage` |
| `res`? | `ServerResponse` |

#### Returns

`HttpDataFetcher`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\> \| (`url`, `data`?) => `Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>\>

## Methods

### fetchComponentData()

> **fetchComponentData**(`params`, `req`?, `res`?): `Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

Defined in: core/types/editing/rest-component-layout-service.d.ts:85

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `ComponentLayoutRequestParams` |
| `req`? | `IncomingMessage` |
| `res`? | `ServerResponse` |

#### Returns

`Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

***

### getComponentFetchParams()

> `protected` **getComponentFetchParams**(`params`): `any`

Defined in: core/types/editing/rest-component-layout-service.d.ts:99

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `ComponentLayoutRequestParams` |

#### Returns

`any`

***

### resolveLayoutServiceUrl()

> `protected` **resolveLayoutServiceUrl**(`apiType`): `string`

Defined in: core/types/editing/rest-component-layout-service.d.ts:92

Resolves layout service url

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `apiType` | `string` | which layout service API to call ('render' or 'placeholder') |

#### Returns

`string`

the layout service url
