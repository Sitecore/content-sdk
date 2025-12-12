[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingRenderMiddlewareConfig

# Type Alias: EditingRenderMiddlewareConfig

> **EditingRenderMiddlewareConfig** = `object`

Defined in: [nextjs/src/editing/editing-render-middleware.ts:29](https://github.com/Sitecore/content-sdk/blob/7aac741918fcea8b66b74d1b742cf4a79d490c91/packages/nextjs/src/editing/editing-render-middleware.ts#L29)

Configuration for the Editing Render Middleware.

## Properties

### resolvePageUrl()?

> `optional` **resolvePageUrl**: (`itemPath`) => `string`

Defined in: [nextjs/src/editing/editing-render-middleware.ts:37](https://github.com/Sitecore/content-sdk/blob/7aac741918fcea8b66b74d1b742cf4a79d490c91/packages/nextjs/src/editing/editing-render-middleware.ts#L37)

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

Defined in: [nextjs/src/editing/editing-render-middleware.ts:41](https://github.com/Sitecore/content-sdk/blob/7aac741918fcea8b66b74d1b742cf4a79d490c91/packages/nextjs/src/editing/editing-render-middleware.ts#L41)

The internal host URL for the Next.js application, used for server-side requests for page rendering during editing.
