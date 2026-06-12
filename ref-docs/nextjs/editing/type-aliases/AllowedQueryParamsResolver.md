[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / AllowedQueryParamsResolver

# Type Alias: AllowedQueryParamsResolver

> **AllowedQueryParamsResolver** = (`queryParams`) => ([`AllowedQueryParam`](../interfaces/AllowedQueryParam.md) \| `string`)[]

Defined in: [nextjs/src/editing/types.ts:22](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/nextjs/src/editing/types.ts#L22)

Resolver function for allowed query parameters, which can be used to extract additional parameters from the query string beyond the required editing parameters.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `queryParams` | `string`[] | Array of query parameters from incoming URL. |

## Returns

([`AllowedQueryParam`](../interfaces/AllowedQueryParam.md) \| `string`)[]

Allowed query editing parameters.
