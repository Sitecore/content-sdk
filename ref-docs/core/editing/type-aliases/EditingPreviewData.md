[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / EditingPreviewData

# Type Alias: EditingPreviewData

> **EditingPreviewData**: `object`

Defined in: [packages/core/src/editing/models.ts:61](https://github.com/Sitecore/content-sdk/blob/f6db146e94b4d93e3130198881311b56027bf1b4/packages/core/src/editing/models.ts#L61)

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
