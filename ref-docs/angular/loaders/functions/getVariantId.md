[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / getVariantId

# Function: getVariantId()

> **getVariantId**(`context`): `string`

Defined in: [packages/angular/src/loaders/context-helpers.ts:23](https://github.com/Sitecore/content-sdk/blob/081959dae5f50b36abd9af8b5e9d111d2d12fc2d/packages/angular/src/loaders/context-helpers.ts#L23)

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
