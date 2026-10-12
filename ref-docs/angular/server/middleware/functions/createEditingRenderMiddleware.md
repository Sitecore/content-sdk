[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / createEditingRenderMiddleware

# Function: createEditingRenderMiddleware()

> **createEditingRenderMiddleware**(`options?`): [`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:217](https://github.com/Sitecore/content-sdk/blob/d153ea0b9ebac2083b9f58f493cfe6e81e7b4fb0/packages/angular/src/server/middleware/editing-render-middleware.ts#L217)

Express middleware that handles the editing render endpoint
(default path: `/api/editing/render`). On a valid editor request, it
validates CORS + secret + required params, stashes the preview data on the
request, sets the CSP header, rewrites `req.url` to the target route, and
hands the request off to the Angular SSR pipeline via `next()`.

No internal HTTP fetch is performed - the editing
payload travels alongside the Express request through the existing
middleware chain.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | [`CreateEditingRenderMiddlewareOptions`](../interfaces/CreateEditingRenderMiddlewareOptions.md) | Middleware options. |

## Returns

[`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

The middleware function.
