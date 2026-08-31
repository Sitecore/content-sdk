[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / CreateEditingRenderMiddlewareOptions

# Interface: CreateEditingRenderMiddlewareOptions

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:50](https://github.com/Sitecore/content-sdk/blob/6320ef720fd2c837d6aad938ce6e7c5806cb2aa6/packages/angular/src/server/middleware/editing-render-middleware.ts#L50)

Options for [createEditingRenderMiddleware](../functions/createEditingRenderMiddleware.md).

## Properties

### allowedQueryParams?

> `optional` **allowedQueryParams?**: [`AllowedQueryParams`](../type-aliases/AllowedQueryParams.md)

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:70](https://github.com/Sitecore/content-sdk/blob/6320ef720fd2c837d6aad938ce6e7c5806cb2aa6/packages/angular/src/server/middleware/editing-render-middleware.ts#L70)

Extra query parameters propagated into the editing preview data
(e.g. deployment-protection bypass tokens).

***

### editingSecret?

> `optional` **editingSecret?**: `string`

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:55](https://github.com/Sitecore/content-sdk/blob/6320ef720fd2c837d6aad938ce6e7c5806cb2aa6/packages/angular/src/server/middleware/editing-render-middleware.ts#L55)

Editing secret to validate. Defaults to the `SITECORE_EDITING_SECRET`
environment variable.

***

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:57](https://github.com/Sitecore/content-sdk/blob/6320ef720fd2c837d6aad938ce6e7c5806cb2aa6/packages/angular/src/server/middleware/editing-render-middleware.ts#L57)

Endpoint path; default `/api/editing/render`.

***

### resolvePageUrl?

> `optional` **resolvePageUrl?**: (`itemPath`, `previewData`) => `string`

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:65](https://github.com/Sitecore/content-sdk/blob/6320ef720fd2c837d6aad938ce6e7c5806cb2aa6/packages/angular/src/server/middleware/editing-render-middleware.ts#L65)

Allows apps to remap the editor's `route` query parameter to their own URL
shape (e.g. injecting a locale prefix).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` | Decoded route from the query parameter. |
| `previewData` | `EditingRenderPreviewData` | Preview data parsed from the request. |

#### Returns

`string`

The route the Angular SSR engine should render.
