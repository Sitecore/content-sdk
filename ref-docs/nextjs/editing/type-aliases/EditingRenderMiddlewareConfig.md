[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingRenderMiddlewareConfig

# Type Alias: EditingRenderMiddlewareConfig

> **EditingRenderMiddlewareConfig** = `object`

Defined in: [nextjs/src/editing/editing-render-middleware.ts:22](https://github.com/Sitecore/content-sdk/blob/48a62ac9202e17ce82f8b49dbe7816a096a9747e/packages/nextjs/src/editing/editing-render-middleware.ts#L22)

Configuration for the Editing Render Middleware.

## Properties

### resolvePageUrl()?

> `optional` **resolvePageUrl**: (`itemPath`) => `string`

Defined in: [nextjs/src/editing/editing-render-middleware.ts:30](https://github.com/Sitecore/content-sdk/blob/48a62ac9202e17ce82f8b49dbe7816a096a9747e/packages/nextjs/src/editing/editing-render-middleware.ts#L30)

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
