[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / PageMetadataRouteFields

# Type Alias: PageMetadataRouteFields

> **PageMetadataRouteFields** = [`PageMetadataFields`](../interfaces/PageMetadataFields.md) & `object`

Defined in: [nextjs/src/metadata/resolve-page-metadata-fields.ts:14](https://github.com/Sitecore/content-sdk/blob/d153ea0b9ebac2083b9f58f493cfe6e81e7b4fb0/packages/nextjs/src/metadata/resolve-page-metadata-fields.ts#L14)

Route fields consumed when resolving page metadata: the page's `Title` plus the metadata/Open
Graph fields Sitecore returns as siblings of `Title` in the route's `fields`.

## Type Declaration

### Title?

> `optional` **Title?**: [`Field`](../interfaces/Field.md)
