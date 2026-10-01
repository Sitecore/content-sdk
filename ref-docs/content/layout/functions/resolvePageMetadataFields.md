[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / resolvePageMetadataFields

# Function: resolvePageMetadataFields()

> **resolvePageMetadataFields**(`route?`, `defaultTitle`): [`ResolvedPageMetadataFields`](../interfaces/ResolvedPageMetadataFields.md)

Defined in: [content/src/layout/page-metadata.ts:58](https://github.com/Sitecore/content-sdk/blob/d6b8d754abd1b9d0b9c44ac6c3c4eb267322689a/packages/content/src/layout/page-metadata.ts#L58)

Derives the metadata/Open Graph field values for a Sitecore route, for consumption by any
rendering layer (Next.js, React, Angular, etc). No cross-field fallback: a field with no value
simply resolves to `undefined`. `title` always comes from the route's `Title` field (falling
back to `defaultTitle`) — `baseMetadataTitle` never feeds it and resolves to `metaTitle` instead.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `route?` | [`RouteData`](../interfaces/RouteData.md)\<[`PageMetadataRouteFields`](../type-aliases/PageMetadataRouteFields.md)\> \| `null` | Route node from a Sitecore layout response. |
| `defaultTitle?` | `string` | Fallback for `title` when the route has no `Title` field. |

## Returns

[`ResolvedPageMetadataFields`](../interfaces/ResolvedPageMetadataFields.md)

resolved metadata/Open Graph field values
