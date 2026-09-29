[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / AllowedQueryParamsResolver

# Type Alias: AllowedQueryParamsResolver

> **AllowedQueryParamsResolver** = (`queryParams`) => ([`AllowedQueryParam`](../interfaces/AllowedQueryParam.md) \| `string`)[]

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:35](https://github.com/Sitecore/content-sdk/blob/c7801c33fe661bb4b9b6f414c72a29794de8b26a/packages/angular/src/server/middleware/editing-render-middleware.ts#L35)

Resolver function: receives the names of every query parameter on the
incoming editing request and returns the list of parameters to forward.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `queryParams` | `string`[] |

## Returns

([`AllowedQueryParam`](../interfaces/AllowedQueryParam.md) \| `string`)[]
