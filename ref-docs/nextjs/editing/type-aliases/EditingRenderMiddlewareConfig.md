[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingRenderMiddlewareConfig

# Type Alias: EditingRenderMiddlewareConfig

> **EditingRenderMiddlewareConfig** = `object`

Defined in: [nextjs/src/editing/editing-render-middleware.ts:34](https://github.com/Sitecore/content-sdk/blob/debe2bd42d32c053245463d40ceb5cb4e1f31690/packages/nextjs/src/editing/editing-render-middleware.ts#L34)

Configuration for the Editing Render Middleware.

## Properties

### allowedQueryParams?

> `optional` **allowedQueryParams?**: [`AllowedQueryParams`](AllowedQueryParams.md)

Defined in: [nextjs/src/editing/editing-render-middleware.ts:52](https://github.com/Sitecore/content-sdk/blob/debe2bd42d32c053245463d40ceb5cb4e1f31690/packages/nextjs/src/editing/editing-render-middleware.ts#L52)

Query string parameters to allow and include in the preview data.
- Array: each item is a parameter name (string) or an object `{ name, required? }`.
- Function: receives the request's query parameter names and returns the list of allowed parameters.

***

### resolvePageUrl?

> `optional` **resolvePageUrl?**: (`itemPath`) => `string`

Defined in: [nextjs/src/editing/editing-render-middleware.ts:42](https://github.com/Sitecore/content-sdk/blob/debe2bd42d32c053245463d40ceb5cb4e1f31690/packages/nextjs/src/editing/editing-render-middleware.ts#L42)

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

Defined in: [nextjs/src/editing/editing-render-middleware.ts:46](https://github.com/Sitecore/content-sdk/blob/debe2bd42d32c053245463d40ceb5cb4e1f31690/packages/nextjs/src/editing/editing-render-middleware.ts#L46)

The internal host URL for the Next.js application, used for server-side requests for page rendering during editing.
