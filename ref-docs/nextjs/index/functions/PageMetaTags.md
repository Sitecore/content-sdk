[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / PageMetaTags

# Function: PageMetaTags()

> **PageMetaTags**(`props`): `Element`

Defined in: [nextjs/src/components/PageMetaTags.tsx:27](https://github.com/Sitecore/content-sdk/blob/16e405f3667f5f05e5fd97b8174bd2b99de45db6/packages/nextjs/src/components/PageMetaTags.tsx#L27)

Renders `<title>` and the metadata/Open Graph `<meta>` tags for a Sitecore route via `next/head`,
for use in Pages Router layouts. Field-mapping/omission rules match `getPageMetadata` (the App
Router equivalent): `<title>` always comes from the route's `Title` field; `baseMetadataTitle`
renders its own `<meta name="title">` instead; every other field independently maps to exactly
one tag with no cross-field fallback.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | [`PageMetaTagsProps`](../interfaces/PageMetaTagsProps.md) | Component props. |

## Returns

`Element`
