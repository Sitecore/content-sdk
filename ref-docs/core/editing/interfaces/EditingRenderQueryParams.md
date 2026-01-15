[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / EditingRenderQueryParams

# Interface: EditingRenderQueryParams

Defined in: packages/core/src/editing/models.ts:9

**`Internal`**

Query parameters appended to the page route URL
Appended when XMCloud Pages preview (editing) mode is used
`mode` is a special case as it serves editing and component library both

## Indexable

\[`key`: `string`\]: `unknown`

## Properties

### mode

> **mode**: [`Preview`](../../layout/enumerations/LayoutServicePageState.md#preview) \| [`Edit`](../../layout/enumerations/LayoutServicePageState.md#edit) \| [`DesignLibraryMode`](../enumerations/DesignLibraryMode.md)

Defined in: packages/core/src/editing/models.ts:16

***

### route

> **route**: `string`

Defined in: packages/core/src/editing/models.ts:15

***

### sc\_itemid

> **sc\_itemid**: `string`

Defined in: packages/core/src/editing/models.ts:13

***

### sc\_lang

> **sc\_lang**: `string`

Defined in: packages/core/src/editing/models.ts:12

***

### sc\_layoutKind?

> `optional` **sc\_layoutKind**: [`LayoutKind`](../enumerations/LayoutKind.md)

Defined in: packages/core/src/editing/models.ts:17

***

### sc\_site

> **sc\_site**: `string`

Defined in: packages/core/src/editing/models.ts:14

***

### sc\_variant?

> `optional` **sc\_variant**: `string`

Defined in: packages/core/src/editing/models.ts:18

***

### sc\_version?

> `optional` **sc\_version**: `string`

Defined in: packages/core/src/editing/models.ts:19

***

### secret

> **secret**: `string`

Defined in: packages/core/src/editing/models.ts:11
