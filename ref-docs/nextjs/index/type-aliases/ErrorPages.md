[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / ErrorPages

# Type Alias: ErrorPages

> **ErrorPages** = `object`

Defined in: content/types/site/error-pages-service.d.ts:24

Object model of Error Pages result

## Properties

### notFoundPage

> **notFoundPage**: \{ `rendered`: [`LayoutServiceData`](../interfaces/LayoutServiceData.md); \} \| `null`

Defined in: content/types/site/error-pages-service.d.ts:29

Rendered 404 page layout.
Can be null if the site has no error handling configured for the requested language.

***

### notFoundPagePath

> **notFoundPagePath**: `string`

Defined in: content/types/site/error-pages-service.d.ts:32

***

### serverErrorPage

> **serverErrorPage**: \{ `rendered`: [`LayoutServiceData`](../interfaces/LayoutServiceData.md); \} \| `null`

Defined in: content/types/site/error-pages-service.d.ts:37

Rendered 500 page layout.
Can be null if the site has no error handling configured for the requested language.

***

### serverErrorPagePath

> **serverErrorPagePath**: `string`

Defined in: content/types/site/error-pages-service.d.ts:40
