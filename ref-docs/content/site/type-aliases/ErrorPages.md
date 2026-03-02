[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / ErrorPages

# Type Alias: ErrorPages

> **ErrorPages** = `object`

Defined in: [content/src/site/error-pages-service.ts:48](https://github.com/Sitecore/content-sdk/blob/88593e741a650b6b128479a0f5ae31aa36f73ec5/packages/content/src/site/error-pages-service.ts#L48)

Object model of Error Pages result

## Properties

### notFoundPage

> **notFoundPage**: \{ `rendered`: [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md); \} \| `null`

Defined in: [content/src/site/error-pages-service.ts:53](https://github.com/Sitecore/content-sdk/blob/88593e741a650b6b128479a0f5ae31aa36f73ec5/packages/content/src/site/error-pages-service.ts#L53)

Rendered 404 page layout.
Can be null if the site has no error handling configured for the requested language.

***

### notFoundPagePath

> **notFoundPagePath**: `string`

Defined in: [content/src/site/error-pages-service.ts:54](https://github.com/Sitecore/content-sdk/blob/88593e741a650b6b128479a0f5ae31aa36f73ec5/packages/content/src/site/error-pages-service.ts#L54)

***

### serverErrorPage

> **serverErrorPage**: \{ `rendered`: [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md); \} \| `null`

Defined in: [content/src/site/error-pages-service.ts:59](https://github.com/Sitecore/content-sdk/blob/88593e741a650b6b128479a0f5ae31aa36f73ec5/packages/content/src/site/error-pages-service.ts#L59)

Rendered 500 page layout.
Can be null if the site has no error handling configured for the requested language.

***

### serverErrorPagePath

> **serverErrorPagePath**: `string`

Defined in: [content/src/site/error-pages-service.ts:60](https://github.com/Sitecore/content-sdk/blob/88593e741a650b6b128479a0f5ae31aa36f73ec5/packages/content/src/site/error-pages-service.ts#L60)
