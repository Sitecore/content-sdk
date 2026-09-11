[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / ComponentRendering

# Interface: ComponentRendering\<T\>

Defined in: [content/src/layout/models.ts:109](https://github.com/Sitecore/content-sdk/blob/b858df1f6f27c4f7a00a2d33c81c5e5233790233/packages/content/src/layout/models.ts#L109)

Definition of a component instance within a placeholder on a route

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | [`ComponentFields`](ComponentFields.md) |

## Properties

### componentName

> **componentName**: `string`

Defined in: [content/src/layout/models.ts:110](https://github.com/Sitecore/content-sdk/blob/b858df1f6f27c4f7a00a2d33c81c5e5233790233/packages/content/src/layout/models.ts#L110)

***

### dataSource?

> `optional` **dataSource?**: `string`

Defined in: [content/src/layout/models.ts:111](https://github.com/Sitecore/content-sdk/blob/b858df1f6f27c4f7a00a2d33c81c5e5233790233/packages/content/src/layout/models.ts#L111)

***

### fields?

> `optional` **fields?**: `T`

Defined in: [content/src/layout/models.ts:120](https://github.com/Sitecore/content-sdk/blob/b858df1f6f27c4f7a00a2d33c81c5e5233790233/packages/content/src/layout/models.ts#L120)

***

### isContentResolved?

> `optional` **isContentResolved?**: `boolean`

Defined in: [content/src/layout/models.ts:117](https://github.com/Sitecore/content-sdk/blob/b858df1f6f27c4f7a00a2d33c81c5e5233790233/packages/content/src/layout/models.ts#L117)

`true` when Layout Service resolved this rendering's datasource content.
`false` when resolution failed (for example because the item was deleted or archived).
Omitted by older Layout Service versions; absence preserves existing behavior.

***

### params?

> `optional` **params?**: [`ComponentParams`](ComponentParams.md)

Defined in: [content/src/layout/models.ts:121](https://github.com/Sitecore/content-sdk/blob/b858df1f6f27c4f7a00a2d33c81c5e5233790233/packages/content/src/layout/models.ts#L121)

***

### placeholders?

> `optional` **placeholders?**: [`PlaceholdersData`](../type-aliases/PlaceholdersData.md)\<`string`\>

Defined in: [content/src/layout/models.ts:119](https://github.com/Sitecore/content-sdk/blob/b858df1f6f27c4f7a00a2d33c81c5e5233790233/packages/content/src/layout/models.ts#L119)

***

### uid?

> `optional` **uid?**: `string`

Defined in: [content/src/layout/models.ts:118](https://github.com/Sitecore/content-sdk/blob/b858df1f6f27c4f7a00a2d33c81c5e5233790233/packages/content/src/layout/models.ts#L118)
