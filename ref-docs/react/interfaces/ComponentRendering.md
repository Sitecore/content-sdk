[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / ComponentRendering

# Interface: ComponentRendering\<T\>

Defined in: packages/content/types/layout/models.d.ts:100

Definition of a component instance within a placeholder on a route

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | [`ComponentFields`](ComponentFields.md) |

## Properties

### componentName

> **componentName**: `string`

Defined in: packages/content/types/layout/models.d.ts:101

***

### dataSource?

> `optional` **dataSource?**: `string`

Defined in: packages/content/types/layout/models.d.ts:102

***

### fields?

> `optional` **fields?**: `T`

Defined in: packages/content/types/layout/models.d.ts:111

***

### isContentResolved?

> `optional` **isContentResolved?**: `boolean`

Defined in: packages/content/types/layout/models.d.ts:108

`true` when Layout Service resolved this rendering's datasource content.
`false` when resolution failed (for example because the item was deleted or archived).
Omitted by older Layout Service versions; absence preserves existing behavior.

***

### params?

> `optional` **params?**: [`ComponentParams`](ComponentParams.md)

Defined in: packages/content/types/layout/models.d.ts:112

***

### placeholders?

> `optional` **placeholders?**: `PlaceholdersData`\<`string`\>

Defined in: packages/content/types/layout/models.d.ts:110

***

### uid?

> `optional` **uid?**: `string`

Defined in: packages/content/types/layout/models.d.ts:109
