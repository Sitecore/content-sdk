[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / ClientLoaderDataService

# Class: ClientLoaderDataService

Defined in: [packages/angular/src/loaders/client-loader-data.service.ts:28](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/client-loader-data.service.ts#L28)

Loader data client for browser loader data resolution. POSTs to the `/_data` endpoint and holds
short-lived prefetched responses for parallel navigation prefetching.
Not aware of the server-side [LoaderCache](../interfaces/LoaderCache.md).

## Constructors

### Constructor

> **new ClientLoaderDataService**(): `ClientLoaderDataService`

#### Returns

`ClientLoaderDataService`

## Methods

### getData()

> **getData**(`request`): `Promise`\<[`LoaderApiResponse`](../type-aliases/LoaderApiResponse.md)\>

Defined in: [packages/angular/src/loaders/client-loader-data.service.ts:66](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/client-loader-data.service.ts#L66)

Get data for the given request, using staged prefetched responses or fetching if needed.
If a request is already pending for this URL/loader combination,
waits for it to complete instead of making a duplicate request.
Consumes (removes) staged responses after retrieval.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `request` | [`LoaderPayload`](../type-aliases/LoaderPayload.md) | The loader data request |

#### Returns

`Promise`\<[`LoaderApiResponse`](../type-aliases/LoaderApiResponse.md)\>

Promise resolving to the API response

***

### prefetch()

> **prefetch**(`loaderRequest`): `void`

Defined in: [packages/angular/src/loaders/client-loader-data.service.ts:43](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/client-loader-data.service.ts#L43)

Prefetch loader data for the given request without consuming staged responses.
If a response is already staged or a request is pending, does nothing.
Otherwise starts a fetch and stores the result for a later getData() call.
Used by PreLoaderDataService to warm responses for all loaders in a route in parallel.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `loaderRequest` | [`LoaderPayload`](../type-aliases/LoaderPayload.md) | The loader data request |

#### Returns

`void`
