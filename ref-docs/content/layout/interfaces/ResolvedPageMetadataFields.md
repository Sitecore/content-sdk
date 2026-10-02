[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / ResolvedPageMetadataFields

# Interface: ResolvedPageMetadataFields

Defined in: [content/src/layout/page-metadata.ts:17](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/content/src/layout/page-metadata.ts#L17)

Field values shared by every metadata/Open Graph output shape (Next.js `Metadata`, `<head>`
tags, Angular `Meta` service, etc).

## Properties

### author?

> `optional` **author?**: `string`

Defined in: [content/src/layout/page-metadata.ts:27](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/content/src/layout/page-metadata.ts#L27)

Value for `<meta name="author">`, from `baseMetadataAuthor`.

***

### creationTime?

> `optional` **creationTime?**: `string`

Defined in: [content/src/layout/page-metadata.ts:41](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/content/src/layout/page-metadata.ts#L41)

Creation time (route `published`), only when `creationTimeTag` is defined.

***

### creationTimeTag?

> `optional` **creationTimeTag?**: `string`

Defined in: [content/src/layout/page-metadata.ts:39](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/content/src/layout/page-metadata.ts#L39)

Official Open Graph creation-time tag name (e.g. `article:published_time`), if `ogType` defines one.

***

### description?

> `optional` **description?**: `string`

Defined in: [content/src/layout/page-metadata.ts:23](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/content/src/layout/page-metadata.ts#L23)

Value for `<meta name="description">`, from `baseMetadataDescription`.

***

### keywords?

> `optional` **keywords?**: `string`

Defined in: [content/src/layout/page-metadata.ts:25](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/content/src/layout/page-metadata.ts#L25)

Value for `<meta name="keywords">`, from `baseMetadataKeywords`.

***

### metaTitle?

> `optional` **metaTitle?**: `string`

Defined in: [content/src/layout/page-metadata.ts:21](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/content/src/layout/page-metadata.ts#L21)

Value for `<meta name="title">`, from `baseMetadataTitle`.

***

### modifiedTime?

> `optional` **modifiedTime?**: `string`

Defined in: [content/src/layout/page-metadata.ts:45](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/content/src/layout/page-metadata.ts#L45)

Update time (route `updated`), only when `modifiedTimeTag` is defined.

***

### modifiedTimeTag?

> `optional` **modifiedTimeTag?**: `string`

Defined in: [content/src/layout/page-metadata.ts:43](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/content/src/layout/page-metadata.ts#L43)

Official Open Graph update-time tag name (e.g. `article:modified_time`), if `ogType` defines one.

***

### ogDescription?

> `optional` **ogDescription?**: `string`

Defined in: [content/src/layout/page-metadata.ts:31](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/content/src/layout/page-metadata.ts#L31)

Value for `og:description`, from `baseOgDescription`.

***

### ogImage?

> `optional` **ogImage?**: [`OpenGraphImageFieldValue`](OpenGraphImageFieldValue.md)

Defined in: [content/src/layout/page-metadata.ts:33](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/content/src/layout/page-metadata.ts#L33)

Full `baseOgImage` field value (`src`, `width`, `height`, `alt`).

***

### ogImageSrc?

> `optional` **ogImageSrc?**: `string`

Defined in: [content/src/layout/page-metadata.ts:35](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/content/src/layout/page-metadata.ts#L35)

Value for `og:image`, from `baseOgImage.src`.

***

### ogTitle?

> `optional` **ogTitle?**: `string`

Defined in: [content/src/layout/page-metadata.ts:29](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/content/src/layout/page-metadata.ts#L29)

Value for `og:title`, from `baseOgTitle`.

***

### ogType?

> `optional` **ogType?**: `string`

Defined in: [content/src/layout/page-metadata.ts:37](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/content/src/layout/page-metadata.ts#L37)

Value for `og:type`, from `baseOgType`.

***

### title

> **title**: `string`

Defined in: [content/src/layout/page-metadata.ts:19](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/content/src/layout/page-metadata.ts#L19)

Value for `<title>`, from the route's `Title` field or the provided default title.
