[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / collectSitecoreTagsFromEdgeRevalidateRequestBody

# Function: collectSitecoreTagsFromEdgeRevalidateRequestBody()

> **collectSitecoreTagsFromEdgeRevalidateRequestBody**(`body`, `options`): `string`[]

Defined in: [packages/angular/src/server/middleware/sitecore-edge-webhook-revalidation.ts:138](https://github.com/Sitecore/content-sdk/blob/df0ab91f7e1cc1e11e1d2458da0d151ccdbea3af/packages/angular/src/server/middleware/sitecore-edge-webhook-revalidation.ts#L138)

Maps an Experience Edge webhook JSON body to Sitecore cache tag strings.

Accepts `updates[]` rows with `identifier` (with optional `-media`/`-layout` suffixes) + `entity_culture`,
mapped to `sc:item:…` tags — except rows where `entity_definition` is `"DictionaryEntry"`, which map to
`sc:dict:<site>:<locale>` for the site resolved from the identifier via `siteNames` (skipped, with a
debug log, when no configured site matches). Only updates that are actually Dictionary changes
revalidate dictionary tags — a webhook for an unrelated item never touches them.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `body` | [`SitecoreEdgeRevalidateRequestBody`](../type-aliases/SitecoreEdgeRevalidateRequestBody.md) \| `null` \| `undefined` | Parsed webhook JSON body. |
| `options` | [`CollectSitecoreTagsFromEdgeBodyOptions`](../type-aliases/CollectSitecoreTagsFromEdgeBodyOptions.md) | Default locale, and site names for Dictionary entry updates. |

## Returns

`string`[]

Deduplicated Sitecore cache tags ready for `LoaderCache.invalidate`.
