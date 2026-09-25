---
'@sitecore-content-sdk/content': minor
'@sitecore-content-sdk/nextjs': patch
'@sitecore-content-sdk/angular': minor
'create-content-sdk-app': patch
---

[angular] Metadata, Open Graph and Schema.org & JSON-LD Support

- `@sitecore-content-sdk/content`: `resolvePageMetadataFields` (with `PageMetadataRouteFields` / `ResolvedPageMetadataFields`) moved from `@sitecore-content-sdk/nextjs` to `@sitecore-content-sdk/content/layout`, so every framework shares the same field-to-tag rules. `@sitecore-content-sdk/nextjs` keeps re-exporting `PageMetadataRouteFields`.
- `@sitecore-content-sdk/angular`: added `PageMetadataService` + `<sc-page-meta-tags [route]>` (`<title>`, metadata and Open Graph `<meta>` tags via Angular's `Title`/`Meta` services) and `JsonLdSchemaService` + `<sc-json-ld-schema [page]>` (a single `<script type="application/ld+json">` in `<head>`, normal mode only). Re-exported the `PageMetadataFields`, `MetadataFields`, `OpenGraphFields`, `OpenGraphImageField(Value)` and `PageMetadataRouteFields` types.
- Angular template: `LayoutComponent` renders both components; `RouteFields` extends `PageMetadataFields`.
