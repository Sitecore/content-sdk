[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / PageMetaTagsProps

# Interface: PageMetaTagsProps

Defined in: [nextjs/src/components/PageMetaTags.tsx:10](https://github.com/Sitecore/content-sdk/blob/d6b8d754abd1b9d0b9c44ac6c3c4eb267322689a/packages/nextjs/src/components/PageMetaTags.tsx#L10)

Props for [PageMetaTags](../functions/PageMetaTags.md).

## Properties

### defaultTitle?

> `optional` **defaultTitle?**: `string`

Defined in: [nextjs/src/components/PageMetaTags.tsx:14](https://github.com/Sitecore/content-sdk/blob/d6b8d754abd1b9d0b9c44ac6c3c4eb267322689a/packages/nextjs/src/components/PageMetaTags.tsx#L14)

Fallback for `<title>` when the route has no `Title` field. Defaults to `'Page'`.

***

### route?

> `optional` **route?**: [`RouteData`](RouteData.md)\<[`PageMetadataRouteFields`](../type-aliases/PageMetadataRouteFields.md)\> \| `null`

Defined in: [nextjs/src/components/PageMetaTags.tsx:12](https://github.com/Sitecore/content-sdk/blob/d6b8d754abd1b9d0b9c44ac6c3c4eb267322689a/packages/nextjs/src/components/PageMetaTags.tsx#L12)

Route node from a Sitecore layout response (for example `page.layout.sitecore.route`).
