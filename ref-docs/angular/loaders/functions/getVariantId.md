[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / getVariantId

# Function: getVariantId()

> **getVariantId**(`context`): `string`

Defined in: [packages/angular/src/loaders/context-helpers.ts:23](https://github.com/Sitecore/content-sdk/blob/2f14286ddbb524cc49993783ef29cc66d697e78d/packages/angular/src/loaders/context-helpers.ts#L23)

Read the page-level personalization variant id resolved for the current request
(personalize middleware → `scParams`). Returns the default variant id when the
request was not personalized.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | [`LoaderContext`](../type-aliases/LoaderContext.md) | Loader context. |

## Returns

`string`

Page-level variant id.
