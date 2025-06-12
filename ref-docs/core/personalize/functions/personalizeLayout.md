[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [personalize](../README.md) / personalizeLayout

# Function: personalizeLayout()

> **personalizeLayout**(`layout`, `variantId`, `componentVariantIds?`): `undefined` \| [`PlaceholdersData`](../../layout/type-aliases/PlaceholdersData.md)\<`string`\>

Defined in: [packages/core/src/personalize/layout-personalizer.ts:20](https://github.com/Sitecore/content-sdk/blob/470be402934dbc14c631d24f46582617f7ea8694/packages/core/src/personalize/layout-personalizer.ts#L20)

Apply personalization to layout data. This will recursively go through all placeholders/components, check experiences nodes and replace default with object from specific experience.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layout` | [`LayoutServiceData`](../../layout/interfaces/LayoutServiceData.md) | Layout data |
| `variantId` | `string` | variant id |
| `componentVariantIds?` | `string`[] | component variant ids |

## Returns

`undefined` \| [`PlaceholdersData`](../../layout/type-aliases/PlaceholdersData.md)\<`string`\>
