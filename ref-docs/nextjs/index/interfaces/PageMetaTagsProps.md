[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / PageMetaTagsProps

# Interface: PageMetaTagsProps

Defined in: [nextjs/src/components/PageMetaTags.tsx:11](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/nextjs/src/components/PageMetaTags.tsx#L11)

Props for [PageMetaTags](../functions/PageMetaTags.md).

## Properties

### defaultTitle?

> `optional` **defaultTitle?**: `string`

Defined in: [nextjs/src/components/PageMetaTags.tsx:15](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/nextjs/src/components/PageMetaTags.tsx#L15)

Fallback for `<title>` when the route has no `Title` field. Defaults to `'Page'`.

***

### route?

> `optional` **route?**: [`RouteData`](RouteData.md)\<[`PageMetadataRouteFields`](../type-aliases/PageMetadataRouteFields.md)\> \| `null`

Defined in: [nextjs/src/components/PageMetaTags.tsx:13](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/nextjs/src/components/PageMetaTags.tsx#L13)

Route node from a Sitecore layout response (for example `page.layout.sitecore.route`).
