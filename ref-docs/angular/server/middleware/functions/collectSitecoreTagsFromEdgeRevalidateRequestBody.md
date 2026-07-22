[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / collectSitecoreTagsFromEdgeRevalidateRequestBody

# Function: collectSitecoreTagsFromEdgeRevalidateRequestBody()

> **collectSitecoreTagsFromEdgeRevalidateRequestBody**(`body`, `options`): `string`[]

Defined in: [packages/angular/src/server/middleware/sitecore-edge-webhook-revalidation.ts:60](https://github.com/Sitecore/content-sdk/blob/ce897227369d7cdccf3cbb79b621c67585f7aff6/packages/angular/src/server/middleware/sitecore-edge-webhook-revalidation.ts#L60)

Maps an Experience Edge webhook JSON body to Sitecore cache tag strings.

Accepts fully qualified `sc:…` tags in `body.tags`, raw content identifiers
(with optional `-media`/`-layout` suffixes), and `updates[]` rows with
`identifier` + `entity_culture`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `body` | [`SitecoreEdgeRevalidateRequestBody`](../type-aliases/SitecoreEdgeRevalidateRequestBody.md) \| `null` \| `undefined` | Parsed webhook JSON body. |
| `options` | [`CollectSitecoreTagsFromEdgeBodyOptions`](../type-aliases/CollectSitecoreTagsFromEdgeBodyOptions.md) | Locale fallback when an update omits `entity_culture`. |

## Returns

`string`[]

Deduplicated Sitecore cache tags ready for `LoaderCache.invalidate`.
