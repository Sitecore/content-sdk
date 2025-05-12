[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [personalize](../README.md) / getGroomedVariantIds

# Function: getGroomedVariantIds()

> **getGroomedVariantIds**(`variantIds`): [`PersonalizedRewriteData`](../type-aliases/PersonalizedRewriteData.md)

Defined in: [packages/core/src/personalize/utils.ts:43](https://github.com/Sitecore/xmc-jss-dev/blob/e071b5c5bcc29ad3f8f0d1250181261d976b39d1/packages/core/src/personalize/utils.ts#L43)

Parses a list of variantIds and divides into layout and component variants

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variantIds` | `string`[] | the list of variant IDs for a page |

## Returns

[`PersonalizedRewriteData`](../type-aliases/PersonalizedRewriteData.md)

object with variant IDs sorted
