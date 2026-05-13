[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingRenderMiddlewareConfig

# Type Alias: EditingRenderMiddlewareConfig

> **EditingRenderMiddlewareConfig** = `object`

Defined in: [nextjs/src/editing/editing-render-middleware.ts:33](https://github.com/Sitecore/content-sdk/blob/18d75b895422fa8b46551735bb393e13cb8df0d2/packages/nextjs/src/editing/editing-render-middleware.ts#L33)

Configuration for the Editing Render Middleware.

## Properties

### allowedQueryParams?

> `optional` **allowedQueryParams?**: [`AllowedQueryParams`](AllowedQueryParams.md)

Defined in: [nextjs/src/editing/editing-render-middleware.ts:51](https://github.com/Sitecore/content-sdk/blob/18d75b895422fa8b46551735bb393e13cb8df0d2/packages/nextjs/src/editing/editing-render-middleware.ts#L51)

Query string parameters to allow and include in the preview data.
- Array: each item is a parameter name (string) or an object `{ name, required? }`.
- Function: receives the request's query parameter names and returns the list of allowed parameters.

***

### resolvePageUrl?

> `optional` **resolvePageUrl?**: (`itemPath`) => `string`

Defined in: [nextjs/src/editing/editing-render-middleware.ts:41](https://github.com/Sitecore/content-sdk/blob/18d75b895422fa8b46551735bb393e13cb8df0d2/packages/nextjs/src/editing/editing-render-middleware.ts#L41)

Function used to determine route/page URL to render.
This may be necessary for certain custom Next.js routing configurations.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` | The Sitecore relative item path e.g. '/styleguide' |

#### Returns

`string`

The URL to render

#### Default

`${itemPath}`

***

### sitecoreInternalEditingHostUrl?

> `optional` **sitecoreInternalEditingHostUrl?**: `string`

Defined in: [nextjs/src/editing/editing-render-middleware.ts:45](https://github.com/Sitecore/content-sdk/blob/18d75b895422fa8b46551735bb393e13cb8df0d2/packages/nextjs/src/editing/editing-render-middleware.ts#L45)

The internal host URL for the Next.js application, used for server-side requests for page rendering during editing.
