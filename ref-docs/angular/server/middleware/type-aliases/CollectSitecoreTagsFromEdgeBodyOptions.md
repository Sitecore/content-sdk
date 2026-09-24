[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / CollectSitecoreTagsFromEdgeBodyOptions

# Type Alias: CollectSitecoreTagsFromEdgeBodyOptions

> **CollectSitecoreTagsFromEdgeBodyOptions** = `object`

Defined in: [packages/angular/src/server/middleware/sitecore-edge-webhook-revalidation.ts:112](https://github.com/Sitecore/content-sdk/blob/ab9e875d0e7b49a2476a9634f4e57b1fe6847d09/packages/angular/src/server/middleware/sitecore-edge-webhook-revalidation.ts#L112)

Options for [collectSitecoreTagsFromEdgeRevalidateRequestBody](../functions/collectSitecoreTagsFromEdgeRevalidateRequestBody.md).

## Properties

### defaultLocale

> **defaultLocale**: `string`

Defined in: [packages/angular/src/server/middleware/sitecore-edge-webhook-revalidation.ts:116](https://github.com/Sitecore/content-sdk/blob/ab9e875d0e7b49a2476a9634f4e57b1fe6847d09/packages/angular/src/server/middleware/sitecore-edge-webhook-revalidation.ts#L116)

Used when an update omits `entity_culture`.

***

### siteNames?

> `optional` **siteNames?**: readonly `string`[]

Defined in: [packages/angular/src/server/middleware/sitecore-edge-webhook-revalidation.ts:122](https://github.com/Sitecore/content-sdk/blob/ab9e875d0e7b49a2476a9634f4e57b1fe6847d09/packages/angular/src/server/middleware/sitecore-edge-webhook-revalidation.ts#L122)

Configured site names (e.g. from `.sitecore/sites.json`), used only to resolve which site a
Dictionary entry update (`entity_definition: "DictionaryEntry"`) belongs to. When omitted (or when
an identifier matches none of them), that update's Dictionary tag is skipped rather than guessed.
