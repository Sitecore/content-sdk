[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/cache](../README.md) / buildSitecoreItemCacheTag

# Function: buildSitecoreItemCacheTag()

> **buildSitecoreItemCacheTag**(`params`): `string`

Defined in: [packages/angular/src/server/cache/cache-tags.ts:34](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/angular/src/server/cache/cache-tags.ts#L34)

Builds an item-scoped revalidation tag: `sc:item:<id>:<locale>`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`BuildSitecoreItemCacheTagParams`](../type-aliases/BuildSitecoreItemCacheTagParams.md) | Item id and locale. |

## Returns

`string`

Sitecore item cache tag.
