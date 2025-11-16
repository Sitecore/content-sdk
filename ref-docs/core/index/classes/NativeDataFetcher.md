[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / NativeDataFetcher

# Class: NativeDataFetcher

Defined in: [packages/core/src/native-fetcher.ts:43](https://github.com/Sitecore/content-sdk/blob/2717352d92cf699951612a7f62785ea6697f83ae/packages/core/src/native-fetcher.ts#L43)

## Constructors

### Constructor

> **new NativeDataFetcher**(`config`): `NativeDataFetcher`

Defined in: [packages/core/src/native-fetcher.ts:46](https://github.com/Sitecore/content-sdk/blob/2717352d92cf699951612a7f62785ea6697f83ae/packages/core/src/native-fetcher.ts#L46)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`NativeDataFetcherConfig`](../type-aliases/NativeDataFetcherConfig.md) |

#### Returns

`NativeDataFetcher`

## Properties

### config

> `protected` **config**: [`NativeDataFetcherConfig`](../type-aliases/NativeDataFetcherConfig.md) = `{}`

Defined in: [packages/core/src/native-fetcher.ts:46](https://github.com/Sitecore/content-sdk/blob/2717352d92cf699951612a7f62785ea6697f83ae/packages/core/src/native-fetcher.ts#L46)

## Methods

### delete()

> **delete**\<`T`\>(`url`, `options?`): `Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

Defined in: [packages/core/src/native-fetcher.ts:139](https://github.com/Sitecore/content-sdk/blob/2717352d92cf699951612a7f62785ea6697f83ae/packages/core/src/native-fetcher.ts#L139)

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

> `protected` **extractDebugHeaders**(`incomingHeaders`): `object`

Defined in: [packages/core/src/native-fetcher.ts:191](https://github.com/Sitecore/content-sdk/blob/2717352d92cf699951612a7f62785ea6697f83ae/packages/core/src/native-fetcher.ts#L191)

Safely extract all headers for debug logging

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `incomingHeaders` | `HeadersInit` | Incoming headers |

#### Returns

`object`

Object with headers as key/value pairs

***

### fetch()

> **fetch**\<`T`\>(`url`, `options?`): `Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

Defined in: [packages/core/src/native-fetcher.ts:54](https://github.com/Sitecore/content-sdk/blob/2717352d92cf699951612a7f62785ea6697f83ae/packages/core/src/native-fetcher.ts#L54)

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

Defined in: [packages/core/src/native-fetcher.ts:114](https://github.com/Sitecore/content-sdk/blob/2717352d92cf699951612a7f62785ea6697f83ae/packages/core/src/native-fetcher.ts#L114)

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

> `protected` **getRequestInit**(`init`): `RequestInit`

Defined in: [packages/core/src/native-fetcher.ts:173](https://github.com/Sitecore/content-sdk/blob/2717352d92cf699951612a7f62785ea6697f83ae/packages/core/src/native-fetcher.ts#L173)

Determines settings for the request

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `init` | `RequestInit` | Custom settings for request |

#### Returns

`RequestInit`

The final request settings

***

### head()

> **head**\<`T`\>(`url`, `options?`): `Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

Defined in: [packages/core/src/native-fetcher.ts:164](https://github.com/Sitecore/content-sdk/blob/2717352d92cf699951612a7f62785ea6697f83ae/packages/core/src/native-fetcher.ts#L164)

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

Defined in: [packages/core/src/native-fetcher.ts:125](https://github.com/Sitecore/content-sdk/blob/2717352d92cf699951612a7f62785ea6697f83ae/packages/core/src/native-fetcher.ts#L125)

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

Defined in: [packages/core/src/native-fetcher.ts:150](https://github.com/Sitecore/content-sdk/blob/2717352d92cf699951612a7f62785ea6697f83ae/packages/core/src/native-fetcher.ts#L150)

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
