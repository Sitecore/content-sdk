[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / PageMetaTagsProps

# Interface: PageMetaTagsProps

Defined in: [nextjs/src/components/PageMetaTags.tsx:11](https://github.com/Sitecore/content-sdk/blob/6320ef720fd2c837d6aad938ce6e7c5806cb2aa6/packages/nextjs/src/components/PageMetaTags.tsx#L11)

Props for [PageMetaTags](../functions/PageMetaTags.md).

## Properties

### defaultTitle?

> `optional` **defaultTitle?**: `string`

Defined in: [nextjs/src/components/PageMetaTags.tsx:15](https://github.com/Sitecore/content-sdk/blob/6320ef720fd2c837d6aad938ce6e7c5806cb2aa6/packages/nextjs/src/components/PageMetaTags.tsx#L15)

Fallback for `<title>` when the route has no `Title` field. Defaults to `'Page'`.

***

### route?

> `optional` **route?**: [`RouteData`](RouteData.md)\<[`PageMetadataRouteFields`](../type-aliases/PageMetadataRouteFields.md)\> \| `null`

Defined in: [nextjs/src/components/PageMetaTags.tsx:13](https://github.com/Sitecore/content-sdk/blob/6320ef720fd2c837d6aad938ce6e7c5806cb2aa6/packages/nextjs/src/components/PageMetaTags.tsx#L13)

Route node from a Sitecore layout response (for example `page.layout.sitecore.route`).
