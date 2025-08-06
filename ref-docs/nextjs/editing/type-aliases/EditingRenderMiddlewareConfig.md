[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingRenderMiddlewareConfig

# Type Alias: EditingRenderMiddlewareConfig

> **EditingRenderMiddlewareConfig** = `object`

<<<<<<< HEAD
Defined in: [nextjs/src/editing/editing-render-middleware.ts:22](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/editing/editing-render-middleware.ts#L22)
=======
Defined in: [nextjs/src/editing/editing-render-middleware.ts:22](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/editing/editing-render-middleware.ts#L22)
>>>>>>> dd686bb50 (Update API docs)

Configuration for the Editing Render Middleware.

## Properties

### resolvePageUrl()?

> `optional` **resolvePageUrl**: (`itemPath`) => `string`

<<<<<<< HEAD
Defined in: [nextjs/src/editing/editing-render-middleware.ts:30](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/editing/editing-render-middleware.ts#L30)
=======
Defined in: [nextjs/src/editing/editing-render-middleware.ts:30](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/editing/editing-render-middleware.ts#L30)
>>>>>>> dd686bb50 (Update API docs)

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
