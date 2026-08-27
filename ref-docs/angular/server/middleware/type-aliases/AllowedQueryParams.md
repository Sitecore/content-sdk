[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / AllowedQueryParams

# Type Alias: AllowedQueryParams

> **AllowedQueryParams** = ([`AllowedQueryParam`](../interfaces/AllowedQueryParam.md) \| `string`)[] \| [`AllowedQueryParamsResolver`](AllowedQueryParamsResolver.md)

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:40](https://github.com/Sitecore/content-sdk/blob/fbd07f45d77bcc00772e33d09bde850e688b09b2/packages/angular/src/server/middleware/editing-render-middleware.ts#L40)

Allowed query parameters configuration for [createEditingRenderMiddleware](../functions/createEditingRenderMiddleware.md).
Either an array of parameter names / specs, or a resolver function.
