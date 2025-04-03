[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingRenderMiddlewareConfig

# Type Alias: EditingRenderMiddlewareConfig

> **EditingRenderMiddlewareConfig**: `object`

Defined in: [nextjs/src/editing/editing-render-middleware.ts:21](https://github.com/Sitecore/content-sdk/blob/8372963af6d72e215aef15561296762273d04314/packages/nextjs/src/editing/editing-render-middleware.ts#L21)

Configuration for the Editing Render Middleware.

## Type declaration

### resolvePageUrl()?

> `optional` **resolvePageUrl**: (`itemPath`) => `string`

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
