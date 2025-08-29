[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingRenderMiddlewareConfig

# Type Alias: EditingRenderMiddlewareConfig

> **EditingRenderMiddlewareConfig** = `object`

Defined in: [nextjs/src/editing/editing-render-middleware.ts:23](https://github.com/Sitecore/content-sdk/blob/234dc8363ba417aaccafe59c3c15290368f78da8/packages/nextjs/src/editing/editing-render-middleware.ts#L23)

Configuration for the Editing Render Middleware.

## Properties

### resolvePageUrl()?

> `optional` **resolvePageUrl**: (`itemPath`) => `string`

Defined in: [nextjs/src/editing/editing-render-middleware.ts:31](https://github.com/Sitecore/content-sdk/blob/234dc8363ba417aaccafe59c3c15290368f78da8/packages/nextjs/src/editing/editing-render-middleware.ts#L31)

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

Defined in: [nextjs/src/editing/editing-render-middleware.ts:35](https://github.com/Sitecore/content-sdk/blob/234dc8363ba417aaccafe59c3c15290368f78da8/packages/nextjs/src/editing/editing-render-middleware.ts#L35)

The internal host URL for the Next.js application, used for server-side requests for page rendering during editing.
