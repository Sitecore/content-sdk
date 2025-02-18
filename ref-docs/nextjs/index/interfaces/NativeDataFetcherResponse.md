[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / NativeDataFetcherResponse

# Interface: NativeDataFetcherResponse\<T\>

Defined in: core/types/native-fetcher.d.ts:20

Response data for an HTTP request sent to an API

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | the type of data model requested |

## Properties

### data

> **data**: `T`

Defined in: core/types/native-fetcher.d.ts:26

Response content

***

### headers?

> `optional` **headers**: `HeadersInit`

Defined in: core/types/native-fetcher.d.ts:28

Response headers

***

### status

> **status**: `number`

Defined in: core/types/native-fetcher.d.ts:22

HTTP status code of the response (i.e. 200, 404)

***

### statusText

> **statusText**: `string`

Defined in: core/types/native-fetcher.d.ts:24

HTTP status text of the response (i.e. 'OK', 'Bad Request')
