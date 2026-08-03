[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / AtomCatalogActionEntry

# Interface: AtomCatalogActionEntry

Defined in: [content/src/atoms/types.ts:30](https://github.com/Sitecore/content-sdk/blob/6953fcad50ce4e3d8b089190f6aed2a6b0cfd4e2/packages/content/src/atoms/types.ts#L30)

**`Internal`**

Serialized action info, sent to Design Studio.

## Properties

### description

> **description**: `string` \| `undefined`

Defined in: [content/src/atoms/types.ts:36](https://github.com/Sitecore/content-sdk/blob/6953fcad50ce4e3d8b089190f6aed2a6b0cfd4e2/packages/content/src/atoms/types.ts#L36)

Human-readable description.

***

### name

> **name**: `string`

Defined in: [content/src/atoms/types.ts:32](https://github.com/Sitecore/content-sdk/blob/6953fcad50ce4e3d8b089190f6aed2a6b0cfd4e2/packages/content/src/atoms/types.ts#L32)

Action name (key in the catalog).

***

### paramsSchema?

> `optional` **paramsSchema?**: `object`

Defined in: [content/src/atoms/types.ts:34](https://github.com/Sitecore/content-sdk/blob/6953fcad50ce4e3d8b089190f6aed2a6b0cfd4e2/packages/content/src/atoms/types.ts#L34)

JSON Schema representation of the action params.
