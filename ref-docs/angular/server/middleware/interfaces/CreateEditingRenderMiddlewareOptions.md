[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / CreateEditingRenderMiddlewareOptions

# Interface: CreateEditingRenderMiddlewareOptions

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:48](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/middleware/editing-render-middleware.ts#L48)

Options for [createEditingRenderMiddleware](../functions/createEditingRenderMiddleware.md).

## Properties

### allowedQueryParams?

> `optional` **allowedQueryParams?**: [`AllowedQueryParams`](../type-aliases/AllowedQueryParams.md)

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:68](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/middleware/editing-render-middleware.ts#L68)

Extra query parameters propagated into the editing preview data
(e.g. deployment-protection bypass tokens).

***

### editingSecret?

> `optional` **editingSecret?**: `string`

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:53](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/middleware/editing-render-middleware.ts#L53)

Editing secret to validate. Defaults to the `SITECORE_EDITING_SECRET`
environment variable.

***

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:55](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/middleware/editing-render-middleware.ts#L55)

Endpoint path; default `/api/editing/render`.

***

### resolvePageUrl?

> `optional` **resolvePageUrl?**: (`itemPath`, `previewData`) => `string`

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:63](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/middleware/editing-render-middleware.ts#L63)

Allows apps to remap the editor's `route` query parameter to their own URL
shape (e.g. injecting a locale prefix).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` | Decoded route from the query parameter. |
| `previewData` | `EditingPreviewData` | Preview data parsed from the request. |

#### Returns

`string`

The route the Angular SSR engine should render.
