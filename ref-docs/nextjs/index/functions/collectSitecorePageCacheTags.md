[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / collectSitecorePageCacheTags

# Function: collectSitecorePageCacheTags()

> **collectSitecorePageCacheTags**(`params`): `string`[]

Defined in: [nextjs/src/cache/sitecore-page-cache-tags.ts:63](https://github.com/Sitecore/content-sdk/blob/5ecdcaf8b7fae916353dcb4b755a48712bde6ab7/packages/nextjs/src/cache/sitecore-page-cache-tags.ts#L63)

Builds cache tags for a Sitecore page read (`getPage`): the route tag and the route's item tag.
Dictionary data is not part of `getPage`; tag dictionary fetches separately (for example with
`buildSitecoreDictionaryCacheTag` on a dedicated `use cache` helper).

Registers **`sc:route:…`** and **`sc:item:…`** (when layout has `itemId`). Edge-style webhooks emit
item ids, which the Sitecore revalidate route handler maps to **`sc:item:…`**; route tags are only
invalidated when callers send the full `sc:route:…` strings in the `tags[]` array of the same revalidate request.

Personalization variants are isolated naturally by URL path (each variant rewrite yields a distinct
Cache Components key) so no `sc:pvv:…` tag is added here. If a personalize-specific webhook is wired
up later, build that tag in the dedicated helper and add it on top of these.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`CollectSitecorePageCacheTagsParams`](../type-aliases/CollectSitecorePageCacheTagsParams.md) | Site, locale, path, and route metadata. |

## Returns

`string`[]
