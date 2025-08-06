[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / NativeDataFetcher

# Class: NativeDataFetcher

<<<<<<< HEAD
Defined in: [packages/core/src/native-fetcher.ts:43](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/native-fetcher.ts#L43)
=======
Defined in: [packages/core/src/native-fetcher.ts:43](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/native-fetcher.ts#L43)
>>>>>>> dd686bb50 (Update API docs)

## Constructors

### Constructor

> **new NativeDataFetcher**(`config`): `NativeDataFetcher`

<<<<<<< HEAD
Defined in: [packages/core/src/native-fetcher.ts:46](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/native-fetcher.ts#L46)
=======
Defined in: [packages/core/src/native-fetcher.ts:46](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/native-fetcher.ts#L46)
>>>>>>> dd686bb50 (Update API docs)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`NativeDataFetcherConfig`](../type-aliases/NativeDataFetcherConfig.md) |

#### Returns

`NativeDataFetcher`

## Properties

### config

> `protected` **config**: [`NativeDataFetcherConfig`](../type-aliases/NativeDataFetcherConfig.md) = `{}`

<<<<<<< HEAD
Defined in: [packages/core/src/native-fetcher.ts:46](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/native-fetcher.ts#L46)
=======
Defined in: [packages/core/src/native-fetcher.ts:46](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/native-fetcher.ts#L46)
>>>>>>> dd686bb50 (Update API docs)

## Methods

### delete()

> **delete**\<`T`\>(`url`, `options?`): `Promise`\<[`NativeDataFetcherResponse`](../interfaces/NativeDataFetcherResponse.md)\<`T`\>\>

<<<<<<< HEAD
Defined in: [packages/core/src/native-fetcher.ts:134](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/native-fetcher.ts#L134)
=======
Defined in: [packages/core/src/native-fetcher.ts:134](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/native-fetcher.ts#L134)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/core/src/native-fetcher.ts:186](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/native-fetcher.ts#L186)
=======
Defined in: [packages/core/src/native-fetcher.ts:186](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/native-fetcher.ts#L186)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/core/src/native-fetcher.ts:54](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/native-fetcher.ts#L54)
=======
Defined in: [packages/core/src/native-fetcher.ts:54](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/native-fetcher.ts#L54)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/core/src/native-fetcher.ts:109](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/native-fetcher.ts#L109)
=======
Defined in: [packages/core/src/native-fetcher.ts:109](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/native-fetcher.ts#L109)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/core/src/native-fetcher.ts:168](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/native-fetcher.ts#L168)
=======
Defined in: [packages/core/src/native-fetcher.ts:168](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/native-fetcher.ts#L168)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/core/src/native-fetcher.ts:159](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/native-fetcher.ts#L159)
=======
Defined in: [packages/core/src/native-fetcher.ts:159](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/native-fetcher.ts#L159)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/core/src/native-fetcher.ts:120](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/native-fetcher.ts#L120)
=======
Defined in: [packages/core/src/native-fetcher.ts:120](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/native-fetcher.ts#L120)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/core/src/native-fetcher.ts:145](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/native-fetcher.ts#L145)
=======
Defined in: [packages/core/src/native-fetcher.ts:145](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/native-fetcher.ts#L145)
>>>>>>> dd686bb50 (Update API docs)

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
