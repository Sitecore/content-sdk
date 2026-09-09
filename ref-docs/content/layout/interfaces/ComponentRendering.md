[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / ComponentRendering

# Interface: ComponentRendering\<T\>

Defined in: [content/src/layout/models.ts:107](https://github.com/Sitecore/content-sdk/blob/ccaa42fb0ef4df028b4e3a0cdf13355c3673c639/packages/content/src/layout/models.ts#L107)

Definition of a component instance within a placeholder on a route

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | [`ComponentFields`](ComponentFields.md) |

## Properties

### componentName

> **componentName**: `string`

Defined in: [content/src/layout/models.ts:108](https://github.com/Sitecore/content-sdk/blob/ccaa42fb0ef4df028b4e3a0cdf13355c3673c639/packages/content/src/layout/models.ts#L108)

***

### dataSource?

> `optional` **dataSource?**: `string`

Defined in: [content/src/layout/models.ts:109](https://github.com/Sitecore/content-sdk/blob/ccaa42fb0ef4df028b4e3a0cdf13355c3673c639/packages/content/src/layout/models.ts#L109)

***

### fields?

> `optional` **fields?**: `T`

Defined in: [content/src/layout/models.ts:118](https://github.com/Sitecore/content-sdk/blob/ccaa42fb0ef4df028b4e3a0cdf13355c3673c639/packages/content/src/layout/models.ts#L118)

***

### isContentResolved?

> `optional` **isContentResolved?**: `boolean`

Defined in: [content/src/layout/models.ts:115](https://github.com/Sitecore/content-sdk/blob/ccaa42fb0ef4df028b4e3a0cdf13355c3673c639/packages/content/src/layout/models.ts#L115)

`true` when Layout Service resolved this rendering's datasource content.
`false` when resolution failed (for example because the item was deleted or archived).
Omitted by older Layout Service versions; absence preserves existing behavior.

***

### params?

> `optional` **params?**: [`ComponentParams`](ComponentParams.md)

Defined in: [content/src/layout/models.ts:119](https://github.com/Sitecore/content-sdk/blob/ccaa42fb0ef4df028b4e3a0cdf13355c3673c639/packages/content/src/layout/models.ts#L119)

***

### placeholders?

> `optional` **placeholders?**: [`PlaceholdersData`](../type-aliases/PlaceholdersData.md)\<`string`\>

Defined in: [content/src/layout/models.ts:117](https://github.com/Sitecore/content-sdk/blob/ccaa42fb0ef4df028b4e3a0cdf13355c3673c639/packages/content/src/layout/models.ts#L117)

***

### uid?

> `optional` **uid?**: `string`

Defined in: [content/src/layout/models.ts:116](https://github.com/Sitecore/content-sdk/blob/ccaa42fb0ef4df028b4e3a0cdf13355c3673c639/packages/content/src/layout/models.ts#L116)
