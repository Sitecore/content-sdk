[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / EditingRenderQueryParams

# Interface: EditingRenderQueryParams

Defined in: [content/src/editing/models.ts:9](https://github.com/Sitecore/content-sdk/blob/3a21c1285ac924b2e5a0de164e3e0443e587c7f7/packages/content/src/editing/models.ts#L9)

**`Internal`**

Query parameters appended to the page route URL
Appended when XMCloud Pages preview (editing) mode is used
`mode` is a special case as it serves editing and component library both

## Indexable

> \[`key`: `string`\]: `unknown`

## Properties

### mode

> **mode**: [`Preview`](../../layout/enumerations/LayoutServicePageState.md#preview) \| [`Edit`](../../layout/enumerations/LayoutServicePageState.md#edit) \| [`DesignLibraryMode`](../enumerations/DesignLibraryMode.md)

Defined in: [content/src/editing/models.ts:16](https://github.com/Sitecore/content-sdk/blob/3a21c1285ac924b2e5a0de164e3e0443e587c7f7/packages/content/src/editing/models.ts#L16)

***

### route

> **route**: `string`

Defined in: [content/src/editing/models.ts:15](https://github.com/Sitecore/content-sdk/blob/3a21c1285ac924b2e5a0de164e3e0443e587c7f7/packages/content/src/editing/models.ts#L15)

***

### sc\_itemid

> **sc\_itemid**: `string`

Defined in: [content/src/editing/models.ts:13](https://github.com/Sitecore/content-sdk/blob/3a21c1285ac924b2e5a0de164e3e0443e587c7f7/packages/content/src/editing/models.ts#L13)

***

### sc\_lang

> **sc\_lang**: `string`

Defined in: [content/src/editing/models.ts:12](https://github.com/Sitecore/content-sdk/blob/3a21c1285ac924b2e5a0de164e3e0443e587c7f7/packages/content/src/editing/models.ts#L12)

***

### sc\_layoutKind?

> `optional` **sc\_layoutKind?**: [`LayoutKind`](../enumerations/LayoutKind.md)

Defined in: [content/src/editing/models.ts:17](https://github.com/Sitecore/content-sdk/blob/3a21c1285ac924b2e5a0de164e3e0443e587c7f7/packages/content/src/editing/models.ts#L17)

***

### sc\_previewTime?

> `optional` **sc\_previewTime?**: `string`

Defined in: [content/src/editing/models.ts:20](https://github.com/Sitecore/content-sdk/blob/3a21c1285ac924b2e5a0de164e3e0443e587c7f7/packages/content/src/editing/models.ts#L20)

***

### sc\_site

> **sc\_site**: `string`

Defined in: [content/src/editing/models.ts:14](https://github.com/Sitecore/content-sdk/blob/3a21c1285ac924b2e5a0de164e3e0443e587c7f7/packages/content/src/editing/models.ts#L14)

***

### sc\_variant?

> `optional` **sc\_variant?**: `string`

Defined in: [content/src/editing/models.ts:18](https://github.com/Sitecore/content-sdk/blob/3a21c1285ac924b2e5a0de164e3e0443e587c7f7/packages/content/src/editing/models.ts#L18)

***

### sc\_version?

> `optional` **sc\_version?**: `string`

Defined in: [content/src/editing/models.ts:19](https://github.com/Sitecore/content-sdk/blob/3a21c1285ac924b2e5a0de164e3e0443e587c7f7/packages/content/src/editing/models.ts#L19)

***

### secret

> **secret**: `string`

Defined in: [content/src/editing/models.ts:11](https://github.com/Sitecore/content-sdk/blob/3a21c1285ac924b2e5a0de164e3e0443e587c7f7/packages/content/src/editing/models.ts#L11)
