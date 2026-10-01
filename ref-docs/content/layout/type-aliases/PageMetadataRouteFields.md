[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / PageMetadataRouteFields

# Type Alias: PageMetadataRouteFields

> **PageMetadataRouteFields** = [`PageMetadataFields`](../interfaces/PageMetadataFields.md) & `object`

Defined in: [content/src/layout/page-metadata.ts:10](https://github.com/Sitecore/content-sdk/blob/d6b8d754abd1b9d0b9c44ac6c3c4eb267322689a/packages/content/src/layout/page-metadata.ts#L10)

Route fields consumed when resolving page metadata: the page's `Title` plus the metadata/Open
Graph fields Sitecore returns as siblings of `Title` in the route's `fields`.

## Type Declaration

### Title?

> `optional` **Title?**: [`Field`](../interfaces/Field.md)
