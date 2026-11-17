[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [personalize](../README.md) / getGroomedVariantIds

# Function: getGroomedVariantIds()

> **getGroomedVariantIds**(`variantIds`): [`PersonalizedRewriteData`](../type-aliases/PersonalizedRewriteData.md)

Defined in: [content/src/personalize/utils.ts:49](https://github.com/Sitecore/content-sdk/blob/3cc9fabc565ee4e80b1eeb351dbd97c802dd1fad/packages/content/src/personalize/utils.ts#L49)

Parses a list of variantIds and divides into layout and component variants

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variantIds` | `string`[] | the list of variant IDs for a page |

## Returns

[`PersonalizedRewriteData`](../type-aliases/PersonalizedRewriteData.md)

object with variant IDs sorted
