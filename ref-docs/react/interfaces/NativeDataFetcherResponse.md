[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / NativeDataFetcherResponse

# Interface: NativeDataFetcherResponse\<T\>

Defined in: packages/core/types/native-fetcher.d.ts:21

Response data for an HTTP request sent to an API

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | the type of data model requested |

## Properties

### data

> **data**: `T`

Defined in: packages/core/types/native-fetcher.d.ts:27

Response content

***

### headers?

> `optional` **headers?**: `HeadersInit`

Defined in: packages/core/types/native-fetcher.d.ts:29

Response headers

***

### status

> **status**: `number`

Defined in: packages/core/types/native-fetcher.d.ts:23

HTTP status code of the response (i.e. 200, 404)

***

### statusText

> **statusText**: `string`

Defined in: packages/core/types/native-fetcher.d.ts:25

HTTP status text of the response (i.e. 'OK', 'Bad Request')
