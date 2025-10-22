[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingRenderMiddlewareConfig

# Type Alias: EditingRenderMiddlewareConfig

> **EditingRenderMiddlewareConfig** = `object`

Defined in: [nextjs/src/editing/editing-render-middleware.ts:27](https://github.com/Sitecore/content-sdk/blob/6dc8e98dbbb7b7e5be9ff8107e95237d8311c7dc/packages/nextjs/src/editing/editing-render-middleware.ts#L27)

Configuration for the Editing Render Middleware.

## Properties

### resolvePageUrl()?

> `optional` **resolvePageUrl**: (`itemPath`) => `string`

Defined in: [nextjs/src/editing/editing-render-middleware.ts:35](https://github.com/Sitecore/content-sdk/blob/6dc8e98dbbb7b7e5be9ff8107e95237d8311c7dc/packages/nextjs/src/editing/editing-render-middleware.ts#L35)

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

Defined in: [nextjs/src/editing/editing-render-middleware.ts:39](https://github.com/Sitecore/content-sdk/blob/6dc8e98dbbb7b7e5be9ff8107e95237d8311c7dc/packages/nextjs/src/editing/editing-render-middleware.ts#L39)

The internal host URL for the Next.js application, used for server-side requests for page rendering during editing.
