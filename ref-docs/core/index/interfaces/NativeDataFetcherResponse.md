[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / NativeDataFetcherResponse

# Interface: NativeDataFetcherResponse\<T\>

Defined in: [packages/core/src/native-fetcher.ts:25](https://github.com/Sitecore/content-sdk/blob/3966c04d9148447d9abcf751cdefb214d74a9fb3/packages/core/src/native-fetcher.ts#L25)

Response data for an HTTP request sent to an API

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | the type of data model requested |

## Properties

### data

> **data**: `T`

Defined in: [packages/core/src/native-fetcher.ts:31](https://github.com/Sitecore/content-sdk/blob/3966c04d9148447d9abcf751cdefb214d74a9fb3/packages/core/src/native-fetcher.ts#L31)

Response content

***

### headers?

> `optional` **headers?**: `HeadersInit`

Defined in: [packages/core/src/native-fetcher.ts:33](https://github.com/Sitecore/content-sdk/blob/3966c04d9148447d9abcf751cdefb214d74a9fb3/packages/core/src/native-fetcher.ts#L33)

Response headers

***

### status

> **status**: `number`

Defined in: [packages/core/src/native-fetcher.ts:27](https://github.com/Sitecore/content-sdk/blob/3966c04d9148447d9abcf751cdefb214d74a9fb3/packages/core/src/native-fetcher.ts#L27)

HTTP status code of the response (i.e. 200, 404)

***

### statusText

> **statusText**: `string`

Defined in: [packages/core/src/native-fetcher.ts:29](https://github.com/Sitecore/content-sdk/blob/3966c04d9148447d9abcf751cdefb214d74a9fb3/packages/core/src/native-fetcher.ts#L29)

HTTP status text of the response (i.e. 'OK', 'Bad Request')
