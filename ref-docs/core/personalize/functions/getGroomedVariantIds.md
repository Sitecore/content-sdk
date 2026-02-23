[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [personalize](../README.md) / getGroomedVariantIds

# Function: getGroomedVariantIds()

> **getGroomedVariantIds**(`variantIds`): [`PersonalizedRewriteData`](../type-aliases/PersonalizedRewriteData.md)

Defined in: [packages/core/src/personalize/utils.ts:49](https://github.com/Sitecore/content-sdk/blob/f0337b779d76d5d2127940f24a5b1cfb8174af76/packages/core/src/personalize/utils.ts#L49)

Parses a list of variantIds and divides into layout and component variants

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variantIds` | `string`[] | the list of variant IDs for a page |

## Returns

[`PersonalizedRewriteData`](../type-aliases/PersonalizedRewriteData.md)

object with variant IDs sorted
