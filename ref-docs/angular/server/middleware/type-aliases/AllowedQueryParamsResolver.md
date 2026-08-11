[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / AllowedQueryParamsResolver

# Type Alias: AllowedQueryParamsResolver

> **AllowedQueryParamsResolver** = (`queryParams`) => ([`AllowedQueryParam`](../interfaces/AllowedQueryParam.md) \| `string`)[]

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:31](https://github.com/Sitecore/content-sdk/blob/6777bd573a801c6d8822657b5b3406a0469068be/packages/angular/src/server/middleware/editing-render-middleware.ts#L31)

Resolver function: receives the names of every query parameter on the
incoming editing request and returns the list of parameters to forward.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `queryParams` | `string`[] |

## Returns

([`AllowedQueryParam`](../interfaces/AllowedQueryParam.md) \| `string`)[]
