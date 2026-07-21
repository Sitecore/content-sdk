[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / AtomCatalogActionEntry

# Interface: AtomCatalogActionEntry

Defined in: [content/src/atoms/types.ts:30](https://github.com/Sitecore/content-sdk/blob/b144b81e7600e42e4de922c8a39635d9a9ecf1ba/packages/content/src/atoms/types.ts#L30)

**`Internal`**

Serialized action info, sent to Design Studio.

## Properties

### description

> **description**: `string` \| `undefined`

Defined in: [content/src/atoms/types.ts:36](https://github.com/Sitecore/content-sdk/blob/b144b81e7600e42e4de922c8a39635d9a9ecf1ba/packages/content/src/atoms/types.ts#L36)

Human-readable description.

***

### name

> **name**: `string`

Defined in: [content/src/atoms/types.ts:32](https://github.com/Sitecore/content-sdk/blob/b144b81e7600e42e4de922c8a39635d9a9ecf1ba/packages/content/src/atoms/types.ts#L32)

Action name (key in the catalog).

***

### paramsSchema?

> `optional` **paramsSchema?**: `object`

Defined in: [content/src/atoms/types.ts:34](https://github.com/Sitecore/content-sdk/blob/b144b81e7600e42e4de922c8a39635d9a9ecf1ba/packages/content/src/atoms/types.ts#L34)

JSON Schema representation of the action params.
