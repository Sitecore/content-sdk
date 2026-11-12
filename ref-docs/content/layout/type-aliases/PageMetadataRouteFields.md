[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / PageMetadataRouteFields

# Type Alias: PageMetadataRouteFields

> **PageMetadataRouteFields** = [`PageMetadataFields`](../interfaces/PageMetadataFields.md) & `object`

Defined in: [content/src/layout/page-metadata.ts:10](https://github.com/Sitecore/content-sdk/blob/d7a3c5aad0610817ec39a8d7adbdbdc09d785aad/packages/content/src/layout/page-metadata.ts#L10)

Route fields consumed when resolving page metadata: the page's `Title` plus the metadata/Open
Graph fields Sitecore returns as siblings of `Title` in the route's `fields`.

## Type Declaration

### Title?

> `optional` **Title?**: [`Field`](../interfaces/Field.md)
