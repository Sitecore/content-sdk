[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / NativeDataFetcherResponse

# Interface: NativeDataFetcherResponse\<T\>

Defined in: [packages/core/src/native-fetcher.ts:24](https://github.com/Sitecore/content-sdk/blob/0047c4587b25d5bd56acc3affb1056399099369e/packages/core/src/native-fetcher.ts#L24)

Response data for an HTTP request sent to an API

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | the type of data model requested |

## Properties

### data

> **data**: `T`

Defined in: [packages/core/src/native-fetcher.ts:30](https://github.com/Sitecore/content-sdk/blob/0047c4587b25d5bd56acc3affb1056399099369e/packages/core/src/native-fetcher.ts#L30)

Response content

***

### headers?

> `optional` **headers**: `HeadersInit`

Defined in: [packages/core/src/native-fetcher.ts:32](https://github.com/Sitecore/content-sdk/blob/0047c4587b25d5bd56acc3affb1056399099369e/packages/core/src/native-fetcher.ts#L32)

Response headers

***

### status

> **status**: `number`

Defined in: [packages/core/src/native-fetcher.ts:26](https://github.com/Sitecore/content-sdk/blob/0047c4587b25d5bd56acc3affb1056399099369e/packages/core/src/native-fetcher.ts#L26)

HTTP status code of the response (i.e. 200, 404)

***

### statusText

> **statusText**: `string`

Defined in: [packages/core/src/native-fetcher.ts:28](https://github.com/Sitecore/content-sdk/blob/0047c4587b25d5bd56acc3affb1056399099369e/packages/core/src/native-fetcher.ts#L28)

HTTP status text of the response (i.e. 'OK', 'Bad Request')
