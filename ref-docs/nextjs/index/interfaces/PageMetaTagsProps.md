[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / PageMetaTagsProps

# Interface: PageMetaTagsProps

Defined in: [nextjs/src/components/PageMetaTags.tsx:10](https://github.com/Sitecore/content-sdk/blob/aafdea48268ff14c60c3419c32fb6aeb10a2b118/packages/nextjs/src/components/PageMetaTags.tsx#L10)

Props for [PageMetaTags](../functions/PageMetaTags.md).

## Properties

### defaultTitle?

> `optional` **defaultTitle?**: `string`

Defined in: [nextjs/src/components/PageMetaTags.tsx:14](https://github.com/Sitecore/content-sdk/blob/aafdea48268ff14c60c3419c32fb6aeb10a2b118/packages/nextjs/src/components/PageMetaTags.tsx#L14)

Fallback for `<title>` when the route has no `Title` field. Defaults to `'Page'`.

***

### route?

> `optional` **route?**: [`RouteData`](RouteData.md)\<[`PageMetadataRouteFields`](../type-aliases/PageMetadataRouteFields.md)\> \| `null`

Defined in: [nextjs/src/components/PageMetaTags.tsx:12](https://github.com/Sitecore/content-sdk/blob/aafdea48268ff14c60c3419c32fb6aeb10a2b118/packages/nextjs/src/components/PageMetaTags.tsx#L12)

Route node from a Sitecore layout response (for example `page.layout.sitecore.route`).
