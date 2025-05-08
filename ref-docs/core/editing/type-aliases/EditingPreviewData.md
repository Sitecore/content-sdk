[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / EditingPreviewData

# Type Alias: EditingPreviewData

> **EditingPreviewData**: `object`

Defined in: [packages/core/src/editing/models.ts:61](https://github.com/Sitecore/content-sdk/blob/16d7bfcebf3663c684474111de6fcfda72223cec/packages/core/src/editing/models.ts#L61)

Data for Preview (Editing) Mode.

## Type declaration

### itemId

> **itemId**: `string`

### language

> **language**: `string`

### layoutKind?

> `optional` **layoutKind**: [`LayoutKind`](../enumerations/LayoutKind.md)

### mode

> **mode**: `Exclude`\<[`LayoutServicePageState`](../../layout/enumerations/LayoutServicePageState.md), `"Normal"`\>

### site

> **site**: `string`

### variantIds

> **variantIds**: `string`[]

### version?

> `optional` **version**: `string`
