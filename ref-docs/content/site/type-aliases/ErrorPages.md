[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / ErrorPages

# Type Alias: ErrorPages

> **ErrorPages** = `object`

Defined in: [content/src/site/error-pages-service.ts:49](https://github.com/Sitecore/content-sdk/blob/cc697f1b79c7ea3d0da73c83f919cdbb67d0d0c9/packages/content/src/site/error-pages-service.ts#L49)

Object model of Error Pages result

## Properties

### notFoundPage

> **notFoundPage**: \{ `rendered`: [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md); \} \| `null`

Defined in: [content/src/site/error-pages-service.ts:54](https://github.com/Sitecore/content-sdk/blob/cc697f1b79c7ea3d0da73c83f919cdbb67d0d0c9/packages/content/src/site/error-pages-service.ts#L54)

Rendered 404 page layout.
Can be null if the site has no error handling configured for the requested language.

***

### notFoundPagePath

> **notFoundPagePath**: `string`

Defined in: [content/src/site/error-pages-service.ts:55](https://github.com/Sitecore/content-sdk/blob/cc697f1b79c7ea3d0da73c83f919cdbb67d0d0c9/packages/content/src/site/error-pages-service.ts#L55)

***

### serverErrorPage

> **serverErrorPage**: \{ `rendered`: [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md); \} \| `null`

Defined in: [content/src/site/error-pages-service.ts:60](https://github.com/Sitecore/content-sdk/blob/cc697f1b79c7ea3d0da73c83f919cdbb67d0d0c9/packages/content/src/site/error-pages-service.ts#L60)

Rendered 500 page layout.
Can be null if the site has no error handling configured for the requested language.

***

### serverErrorPagePath

> **serverErrorPagePath**: `string`

Defined in: [content/src/site/error-pages-service.ts:61](https://github.com/Sitecore/content-sdk/blob/cc697f1b79c7ea3d0da73c83f919cdbb67d0d0c9/packages/content/src/site/error-pages-service.ts#L61)
