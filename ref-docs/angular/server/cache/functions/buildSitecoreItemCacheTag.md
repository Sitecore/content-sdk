[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/cache](../README.md) / buildSitecoreItemCacheTag

# Function: buildSitecoreItemCacheTag()

> **buildSitecoreItemCacheTag**(`params`): `string`

Defined in: [packages/angular/src/server/cache/cache-tags.ts:34](https://github.com/Sitecore/content-sdk/blob/10c92fa4a2d5b496313949dc30b1527d5cd4c787/packages/angular/src/server/cache/cache-tags.ts#L34)

Builds an item-scoped revalidation tag: `sc:item:<id>:<locale>`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`BuildSitecoreItemCacheTagParams`](../type-aliases/BuildSitecoreItemCacheTagParams.md) | Item id and locale. |

## Returns

`string`

Sitecore item cache tag.
