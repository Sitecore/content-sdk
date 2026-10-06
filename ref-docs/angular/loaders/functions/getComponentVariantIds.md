[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / getComponentVariantIds

# Function: getComponentVariantIds()

> **getComponentVariantIds**(`context`): `string`[]

Defined in: [packages/angular/src/loaders/context-helpers.ts:34](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/angular/src/loaders/context-helpers.ts#L34)

Read the component A/B test variant ids resolved for the current request
(personalize middleware → `scParams`). Empty when the request was not personalized.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | [`LoaderContext`](../type-aliases/LoaderContext.md) | Loader context. |

## Returns

`string`[]

Component-level variant ids.
