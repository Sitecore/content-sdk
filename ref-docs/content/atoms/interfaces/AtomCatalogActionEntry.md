[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / AtomCatalogActionEntry

# Interface: AtomCatalogActionEntry

Defined in: [content/src/atoms/types.ts:32](https://github.com/Sitecore/content-sdk/blob/2ebaba6454c3e55795d63c8d38a7bfd15c6ab5ac/packages/content/src/atoms/types.ts#L32)

**`Internal`**

Serialized action info, sent to Design Studio.

## Properties

### description

> **description**: `string` \| `undefined`

Defined in: [content/src/atoms/types.ts:38](https://github.com/Sitecore/content-sdk/blob/2ebaba6454c3e55795d63c8d38a7bfd15c6ab5ac/packages/content/src/atoms/types.ts#L38)

Human-readable description.

***

### legacy

> **legacy**: `boolean`

Defined in: [content/src/atoms/types.ts:40](https://github.com/Sitecore/content-sdk/blob/2ebaba6454c3e55795d63c8d38a7bfd15c6ab5ac/packages/content/src/atoms/types.ts#L40)

Whether the action is excluded from new AI component generations.

***

### name

> **name**: `string`

Defined in: [content/src/atoms/types.ts:34](https://github.com/Sitecore/content-sdk/blob/2ebaba6454c3e55795d63c8d38a7bfd15c6ab5ac/packages/content/src/atoms/types.ts#L34)

Action name (key in the catalog).

***

### paramsSchema?

> `optional` **paramsSchema?**: `object`

Defined in: [content/src/atoms/types.ts:36](https://github.com/Sitecore/content-sdk/blob/2ebaba6454c3e55795d63c8d38a7bfd15c6ab5ac/packages/content/src/atoms/types.ts#L36)

JSON Schema representation of the action params.
