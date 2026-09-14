[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / getComponentVariantIds

# Function: getComponentVariantIds()

> **getComponentVariantIds**(`context`): `string`[]

Defined in: [packages/angular/src/loaders/context-helpers.ts:34](https://github.com/Sitecore/content-sdk/blob/df0ab91f7e1cc1e11e1d2458da0d151ccdbea3af/packages/angular/src/loaders/context-helpers.ts#L34)

Read the component A/B test variant ids resolved for the current request
(personalize middleware → `scParams`). Empty when the request was not personalized.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | [`LoaderContext`](../type-aliases/LoaderContext.md) | Loader context. |

## Returns

`string`[]

Component-level variant ids.
