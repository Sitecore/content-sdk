[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / ErrorPages

# Type Alias: ErrorPages

> **ErrorPages** = `object`

Defined in: [content/src/site/error-pages-service.ts:48](https://github.com/Sitecore/content-sdk/blob/48c97c4b8cd547e1668c820cb220274bc3e67af1/packages/content/src/site/error-pages-service.ts#L48)

Object model of Error Pages result

## Properties

### notFoundPage

> **notFoundPage**: \{ `rendered`: [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md); \} \| `null`

Defined in: [content/src/site/error-pages-service.ts:53](https://github.com/Sitecore/content-sdk/blob/48c97c4b8cd547e1668c820cb220274bc3e67af1/packages/content/src/site/error-pages-service.ts#L53)

Rendered 404 page layout.
Can be null if the site has no error handling configured for the requested language.

***

### notFoundPagePath

> **notFoundPagePath**: `string`

Defined in: [content/src/site/error-pages-service.ts:54](https://github.com/Sitecore/content-sdk/blob/48c97c4b8cd547e1668c820cb220274bc3e67af1/packages/content/src/site/error-pages-service.ts#L54)

***

### serverErrorPage

> **serverErrorPage**: \{ `rendered`: [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md); \} \| `null`

Defined in: [content/src/site/error-pages-service.ts:59](https://github.com/Sitecore/content-sdk/blob/48c97c4b8cd547e1668c820cb220274bc3e67af1/packages/content/src/site/error-pages-service.ts#L59)

Rendered 500 page layout.
Can be null if the site has no error handling configured for the requested language.

***

### serverErrorPagePath

> **serverErrorPagePath**: `string`

Defined in: [content/src/site/error-pages-service.ts:60](https://github.com/Sitecore/content-sdk/blob/48c97c4b8cd547e1668c820cb220274bc3e67af1/packages/content/src/site/error-pages-service.ts#L60)
