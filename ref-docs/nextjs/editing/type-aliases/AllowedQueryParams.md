[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / AllowedQueryParams

# Type Alias: AllowedQueryParams

> **AllowedQueryParams** = ([`AllowedQueryParam`](../interfaces/AllowedQueryParam.md) \| `string`)[] \| [`AllowedQueryParamsResolver`](AllowedQueryParamsResolver.md)

Defined in: [nextjs/src/editing/types.ts:30](https://github.com/Sitecore/content-sdk/blob/0a0329383af69f84aabe08a1dceb0b75ccb35504/packages/nextjs/src/editing/types.ts#L30)

Allowed query parameters which can be defined as an array of parameter names or objects, or a resolver function which can be used to extract additional parameters from the query string beyond the required editing parameters.
