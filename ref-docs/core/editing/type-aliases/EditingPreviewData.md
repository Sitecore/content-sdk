[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / EditingPreviewData

# Type Alias: EditingPreviewData

> **EditingPreviewData**: `object`

Defined in: [packages/core/src/editing/models.ts:61](https://github.com/Sitecore/xmc-jss-dev/blob/3977926a625263337e3b7cdaaa92a610ea43e8f1/packages/core/src/editing/models.ts#L61)

Data for Preview (Editing) Mode.

## Type declaration

### itemId

> **itemId**: `string`

### language

> **language**: `string`

### layoutKind?

> `optional` **layoutKind**: [`LayoutKind`](../enumerations/LayoutKind.md)

### pageState

> **pageState**: `Exclude`\<[`LayoutServicePageState`](../../layout/enumerations/LayoutServicePageState.md), `"Normal"`\>

### site

> **site**: `string`

### variantIds

> **variantIds**: `string`[]

### version?

> `optional` **version**: `string`
