[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / ClientLoaderDataService

# Class: ClientLoaderDataService

Defined in: [packages/angular/src/loaders/client-loader-data.service.ts:28](https://github.com/Sitecore/content-sdk/blob/84866ded66f6f8f69e7f007b2311494e086b493b/packages/angular/src/loaders/client-loader-data.service.ts#L28)

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

Defined in: [packages/angular/src/loaders/client-loader-data.service.ts:76](https://github.com/Sitecore/content-sdk/blob/84866ded66f6f8f69e7f007b2311494e086b493b/packages/angular/src/loaders/client-loader-data.service.ts#L76)

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

> **prefetch**(`loaderRequest`, `options?`): `void`

Defined in: [packages/angular/src/loaders/client-loader-data.service.ts:50](https://github.com/Sitecore/content-sdk/blob/84866ded66f6f8f69e7f007b2311494e086b493b/packages/angular/src/loaders/client-loader-data.service.ts#L50)

Prefetch loader data for the given request without consuming staged responses.
If a request is already pending for this key, does nothing (avoids two overlapping HTTP
calls for the identical in-flight ask). Otherwise starts a fetch and stores the result for
a later getData() call, overwriting any existing staged entry with the fresh one.

By default (`force: false`) also skips the fetch when a response is already staged and
unconsumed. Pass `force: true` to always re-ask regardless of an existing staged entry —
used by hover prefetch, since hover is a fresh, repeatable signal of intent that a
possibly-stale staged answer shouldn't suppress.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `loaderRequest` | [`LoaderPayload`](../type-aliases/LoaderPayload.md) | The loader data request |
| `options?` | \{ `force?`: `boolean`; \} | Prefetch options |
| `options.force?` | `boolean` | When true, bypass the staged-response check (still coalesces concurrent in-flight requests) |

#### Returns

`void`
