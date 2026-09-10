[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / getPageMetadata

# Function: getPageMetadata()

> **getPageMetadata**(`route?`, `defaultTitle?`): `Metadata`

Defined in: [nextjs/src/metadata/page-metadata.ts:30](https://github.com/Sitecore/content-sdk/blob/ccaa42fb0ef4df028b4e3a0cdf13355c3673c639/packages/nextjs/src/metadata/page-metadata.ts#L30)

Builds a Next.js `Metadata` object (`<title>`, description/keywords/author meta, and Open Graph
tags) from a Sitecore route, for direct use as the return value of a page's `generateMetadata`.

`<title>` always comes from the route's `Title` field (falling back to `defaultTitle`);
`baseMetadataTitle` never feeds `<title>` and instead renders its own `<meta name="title">`
(via `other.title`). Every other field independently maps to exactly one tag with no
cross-field fallback: a field with no value simply omits its tag.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `route?` | [`RouteData`](../interfaces/RouteData.md)\<[`PageMetadataRouteFields`](../type-aliases/PageMetadataRouteFields.md)\> \| `null` | `undefined` | Route node from a Sitecore layout response (for example `page?.layout.sitecore.route`). |
| `defaultTitle?` | `string` | `'Page'` | Fallback for `<title>` when the route has no `Title` field. |

## Returns

`Metadata`
