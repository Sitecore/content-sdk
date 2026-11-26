[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / CreateEditingRenderMiddlewareOptions

# Interface: CreateEditingRenderMiddlewareOptions

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:52](https://github.com/Sitecore/content-sdk/blob/3966c04d9148447d9abcf751cdefb214d74a9fb3/packages/angular/src/server/middleware/editing-render-middleware.ts#L52)

Options for [createEditingRenderMiddleware](../functions/createEditingRenderMiddleware.md).

## Properties

### allowedQueryParams?

> `optional` **allowedQueryParams?**: [`AllowedQueryParams`](../type-aliases/AllowedQueryParams.md)

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:72](https://github.com/Sitecore/content-sdk/blob/3966c04d9148447d9abcf751cdefb214d74a9fb3/packages/angular/src/server/middleware/editing-render-middleware.ts#L72)

Extra query parameters propagated into the editing preview data
(e.g. deployment-protection bypass tokens).

***

### editingSecret?

> `optional` **editingSecret?**: `string`

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:57](https://github.com/Sitecore/content-sdk/blob/3966c04d9148447d9abcf751cdefb214d74a9fb3/packages/angular/src/server/middleware/editing-render-middleware.ts#L57)

Editing secret to validate. Defaults to the `SITECORE_EDITING_SECRET`
environment variable.

***

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:59](https://github.com/Sitecore/content-sdk/blob/3966c04d9148447d9abcf751cdefb214d74a9fb3/packages/angular/src/server/middleware/editing-render-middleware.ts#L59)

Endpoint path; default `/api/editing/render`.

***

### resolvePageUrl?

> `optional` **resolvePageUrl?**: (`itemPath`, `previewData`) => `string`

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:67](https://github.com/Sitecore/content-sdk/blob/3966c04d9148447d9abcf751cdefb214d74a9fb3/packages/angular/src/server/middleware/editing-render-middleware.ts#L67)

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
