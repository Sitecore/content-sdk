[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / AllowedQueryParams

# Type Alias: AllowedQueryParams

> **AllowedQueryParams** = ([`AllowedQueryParam`](../interfaces/AllowedQueryParam.md) \| `string`)[] \| [`AllowedQueryParamsResolver`](AllowedQueryParamsResolver.md)

Defined in: [nextjs/src/editing/types.ts:30](https://github.com/Sitecore/content-sdk/blob/855bd4d7f25d36c9c4a22021da6d73fb13ad812f/packages/nextjs/src/editing/types.ts#L30)

Allowed query parameters which can be defined as an array of parameter names or objects, or a resolver function which can be used to extract additional parameters from the query string beyond the required editing parameters.
