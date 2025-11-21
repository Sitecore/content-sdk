[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingRenderMiddlewareConfig

# Type Alias: EditingRenderMiddlewareConfig

> **EditingRenderMiddlewareConfig** = `object`

Defined in: [nextjs/src/editing/editing-render-middleware.ts:28](https://github.com/Sitecore/content-sdk/blob/d2abf18666fba089b9dcf62cea47b87eef22e96d/packages/nextjs/src/editing/editing-render-middleware.ts#L28)

Configuration for the Editing Render Middleware.

## Properties

### resolvePageUrl()?

> `optional` **resolvePageUrl**: (`itemPath`) => `string`

Defined in: [nextjs/src/editing/editing-render-middleware.ts:36](https://github.com/Sitecore/content-sdk/blob/d2abf18666fba089b9dcf62cea47b87eef22e96d/packages/nextjs/src/editing/editing-render-middleware.ts#L36)

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

> `optional` **sitecoreInternalEditingHostUrl**: `string`

Defined in: [nextjs/src/editing/editing-render-middleware.ts:40](https://github.com/Sitecore/content-sdk/blob/d2abf18666fba089b9dcf62cea47b87eef22e96d/packages/nextjs/src/editing/editing-render-middleware.ts#L40)

The internal host URL for the Next.js application, used for server-side requests for page rendering during editing.
