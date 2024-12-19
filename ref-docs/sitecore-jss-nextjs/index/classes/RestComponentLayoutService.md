[**@sitecore-jss/sitecore-jss-nextjs**](../../README.md) • **Docs**

***

[@sitecore-jss/sitecore-jss-nextjs](../../README.md) / [index](../README.md) / RestComponentLayoutService

# Class: RestComponentLayoutService

REST service that enables Component Library functioality
Makes a request to /sitecore/api/layout/component in 'library' mode in Pages.
Returns layoutData for one single rendered component

## Extends

- `RestLayoutService`

## Constructors

### new RestComponentLayoutService()

> **new RestComponentLayoutService**(`config`): [`RestComponentLayoutService`](RestComponentLayoutService.md)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `RestLayoutServiceConfig` |

#### Returns

[`RestComponentLayoutService`](RestComponentLayoutService.md)

#### Overrides

`RestLayoutService.constructor`

#### Defined in

sitecore-jss/types/editing/rest-component-layout-service.d.ts:53

## Properties

### getDefaultFetcher()

> `protected` **getDefaultFetcher**: \<`T`\>(`req`?, `res`?) => (`url`, `data`?) => `Promise`\<`AxiosResponse`\<`T`\>\>

Provides default

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req`? | `IncomingMessage` | Request instance |
| `res`? | `ServerResponse`\<`IncomingMessage`\> | Response instance |

#### Returns

`Function`

default fetcher

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | `string` |
| `data`? | `unknown` |

##### Returns

`Promise`\<`AxiosResponse`\<`T`\>\>

#### See

AxiosDataFetcher data fetcher

#### Inherited from

`RestLayoutService.getDefaultFetcher`

#### Defined in

sitecore-jss/types/layout/rest-layout-service.d.ts:97

***

### getFetcher()

> `protected` **getFetcher**: (`req`?, `res`?) => [`HttpDataFetcher`](../type-aliases/HttpDataFetcher.md)\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req`? | `IncomingMessage` |
| `res`? | `ServerResponse`\<`IncomingMessage`\> |

#### Returns

[`HttpDataFetcher`](../type-aliases/HttpDataFetcher.md)\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

#### Inherited from

`RestLayoutService.getFetcher`

#### Defined in

sitecore-jss/types/layout/rest-layout-service.d.ts:84

***

### getFetchParams()

> `protected` **getFetchParams**: (`language`?) => `FetchParams`

Provides fetch options in order to fetch data

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `language`? | `string` | language will be applied to `sc_lang` param |

#### Returns

`FetchParams`

fetch options

#### Inherited from

`RestLayoutService.getFetchParams`

#### Defined in

sitecore-jss/types/layout/rest-layout-service.d.ts:83

## Methods

### fetchComponentData()

> **fetchComponentData**(`params`, `req`?, `res`?): `Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `ComponentLayoutRequestParams` |
| `req`? | `IncomingMessage` |
| `res`? | `ServerResponse`\<`IncomingMessage`\> |

#### Returns

`Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

#### Defined in

sitecore-jss/types/editing/rest-component-layout-service.d.ts:54

***

### fetchLayoutData()

> **fetchLayoutData**(`itemPath`, `language`?, `req`?, `res`?): `Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

Fetch layout data for an item.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` | item path to fetch layout data for. |
| `language`? | `string` | the language to fetch layout data for. |
| `req`? | `IncomingMessage` | Request instance |
| `res`? | `ServerResponse`\<`IncomingMessage`\> | Response instance |

#### Returns

`Promise`\<[`LayoutServiceData`](../interfaces/LayoutServiceData.md)\>

layout service data

#### Throws

the item with the specified path is not found

#### Inherited from

`RestLayoutService.fetchLayoutData`

#### Defined in

sitecore-jss/types/layout/rest-layout-service.d.ts:65

***

### fetchPlaceholderData()

> **fetchPlaceholderData**(`placeholderName`, `itemPath`, `language`?, `req`?, `res`?): `Promise`\<[`PlaceholderData`](../interfaces/PlaceholderData.md)\>

Fetch layout data for a particular placeholder.
Makes a request to Sitecore Layout Service for the specified placeholder in
a specific route item. Allows you to retrieve rendered data for individual placeholders instead of entire routes.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `placeholderName` | `string` | the name of the placeholder to fetch layout data for. |
| `itemPath` | `string` | the path to the item to fetch layout data for. |
| `language`? | `string` | the language to fetch data for. |
| `req`? | `IncomingMessage` | Request instance |
| `res`? | `ServerResponse`\<`IncomingMessage`\> | Response instance |

#### Returns

`Promise`\<[`PlaceholderData`](../interfaces/PlaceholderData.md)\>

placeholder data

#### Inherited from

`RestLayoutService.fetchPlaceholderData`

#### Defined in

sitecore-jss/types/layout/rest-layout-service.d.ts:77

***

### getComponentFetchParams()

> `protected` **getComponentFetchParams**(`params`): `any`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `ComponentLayoutRequestParams` |

#### Returns

`any`

#### Defined in

sitecore-jss/types/editing/rest-component-layout-service.d.ts:55

***

### resolveLayoutServiceUrl()

> `protected` **resolveLayoutServiceUrl**(`apiType`): `string`

Resolves layout service url

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `apiType` | `"render"` \| `"placeholder"` \| `"component"` | which layout service API to call ('render' or 'placeholder') |

#### Returns

`string`

the layout service url

#### Inherited from

`RestLayoutService.resolveLayoutServiceUrl`

#### Defined in

sitecore-jss/types/layout/rest-layout-service.d.ts:90

***

### setupReqHeaders()

> `protected` **setupReqHeaders**(`req`): (`reqConfig`) => `AxiosRequestConfig`

Setup request headers

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `IncomingMessage` | Request instance |

#### Returns

`Function`

axios request config

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `reqConfig` | `AxiosRequestConfig` |

##### Returns

`AxiosRequestConfig`

#### Inherited from

`RestLayoutService.setupReqHeaders`

#### Defined in

sitecore-jss/types/layout/rest-layout-service.d.ts:103

***

### setupResHeaders()

> `protected` **setupResHeaders**(`res`): (`serverRes`) => `AxiosResponse`\<`any`\>

Setup response headers based on response from layout service

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `res` | `ServerResponse`\<`IncomingMessage`\> | Response instance |

#### Returns

`Function`

response

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `serverRes` | `AxiosResponse`\<`any`\> |

##### Returns

`AxiosResponse`\<`any`\>

#### Inherited from

`RestLayoutService.setupResHeaders`

#### Defined in

sitecore-jss/types/layout/rest-layout-service.d.ts:109
