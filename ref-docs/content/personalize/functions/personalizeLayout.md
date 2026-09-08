[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [personalize](../README.md) / personalizeLayout

# Function: personalizeLayout()

> **personalizeLayout**(`layout`, `variantId`, `componentVariantIds?`): [`PlaceholdersData`](../../layout/type-aliases/PlaceholdersData.md)\<`string`\> \| `undefined`

Defined in: [content/src/personalize/layout-personalizer.ts:21](https://github.com/Sitecore/content-sdk/blob/ccaa42fb0ef4df028b4e3a0cdf13355c3673c639/packages/content/src/personalize/layout-personalizer.ts#L21)

Apply personalization to layout data. This will recursively go through all placeholders/components, check experiences nodes and replace default with object from specific experience.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layout` | [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md) | Layout data |
| `variantId` | `string` | variant id |
| `componentVariantIds?` | `string`[] | component variant ids |

## Returns

[`PlaceholdersData`](../../layout/type-aliases/PlaceholdersData.md)\<`string`\> \| `undefined`
