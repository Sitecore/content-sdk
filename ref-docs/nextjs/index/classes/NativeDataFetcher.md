[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / NativeDataFetcher

# Class: NativeDataFetcher

Defined in: core/types/native-fetcher.d.ts:47

Native data fetcher class

## Constructors

### Constructor

> **new NativeDataFetcher**(`config?`): `NativeDataFetcher`

Defined in: core/types/native-fetcher.d.ts:50

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config?` | [`NativeDataFetcherConfig`](../type-aliases/NativeDataFetcherConfig.md) |

#### Returns

`NativeDataFetcher`

## Properties

### config

> `protected` **config**: [`NativeDataFetcherConfig`](../type-aliases/NativeDataFetcherConfig.md)

Defined in: core/types/native-fetcher.d.ts:48

## Methods

### delete()

> **delete**\<`T`\>(`url`, `options?`): `Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

Defined in: core/types/native-fetcher.d.ts:79

Perform a DELETE request

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | The URL to request (may include query string) |
| `options?` | `RequestInit` | Fetch options |

#### Returns

`Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

response

***

### extractDebugHeaders()

> `protected` **extractDebugHeaders**(`incomingHeaders?`): `object`

Defined in: core/types/native-fetcher.d.ts:106

Safely extract all headers for debug logging

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `incomingHeaders?` | `HeadersInit` | Incoming headers |

#### Returns

`object`

Object with headers as key/value pairs

***

### fetch()

> **fetch**\<`T`\>(`url`, `options?`): `Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

Defined in: core/types/native-fetcher.d.ts:57

Implements a data fetcher.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | The URL to request (may include query string) |
| `options?` | `RequestInit` | Optional fetch options |

#### Returns

`Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

response

***

### get()

> **get**\<`T`\>(`url`, `options?`): `Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

Defined in: core/types/native-fetcher.d.ts:64

Perform a GET request

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | The URL to request (may include query string) |
| `options?` | `RequestInit` | Fetch options |

#### Returns

`Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

response

***

### getRequestInit()

> `protected` **getRequestInit**(`init?`): `RequestInit`

Defined in: core/types/native-fetcher.d.ts:100

Determines settings for the request

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `init?` | `RequestInit` | Custom settings for request |

#### Returns

`RequestInit`

The final request settings

***

### head()

> **head**\<`T`\>(`url`, `options?`): `Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

Defined in: core/types/native-fetcher.d.ts:94

Perform a HEAD request

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | The URL to request (may include query string) |
| `options?` | `RequestInit` | Fetch options |

#### Returns

`Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

response

***

### post()

> **post**\<`T`\>(`url`, `body`, `options?`): `Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

Defined in: core/types/native-fetcher.d.ts:72

Perform a POST request

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | The URL to request (may include query string) |
| `body` | `unknown` | The data to send with the request |
| `options?` | `RequestInit` | Fetch options |

#### Returns

`Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

response

***

### put()

> **put**\<`T`\>(`url`, `body`, `options?`): `Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

Defined in: core/types/native-fetcher.d.ts:87

Perform a PUT request

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | The URL to request (may include query string) |
| `body` | `unknown` | The data to send with the request |
| `options?` | `RequestInit` | Fetch options |

#### Returns

`Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

response
