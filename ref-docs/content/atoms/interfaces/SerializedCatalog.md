[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / SerializedCatalog

# Interface: SerializedCatalog

Defined in: [content/src/atoms/types.ts:49](https://github.com/Sitecore/content-sdk/blob/eb4a5a9ee099182eed23366c9fea12d5faf5c541/packages/content/src/atoms/types.ts#L49)

**`Internal`**

Full catalog payload sent to Design Studio.

## Properties

### actions

> **actions**: [`AtomCatalogActionEntry`](AtomCatalogActionEntry.md)[]

Defined in: [content/src/atoms/types.ts:57](https://github.com/Sitecore/content-sdk/blob/eb4a5a9ee099182eed23366c9fea12d5faf5c541/packages/content/src/atoms/types.ts#L57)

Serialized action entries.

***

### components

> **components**: [`AtomCatalogComponentEntry`](AtomCatalogComponentEntry.md)[]

Defined in: [content/src/atoms/types.ts:55](https://github.com/Sitecore/content-sdk/blob/eb4a5a9ee099182eed23366c9fea12d5faf5c541/packages/content/src/atoms/types.ts#L55)

Serialized component entries.

***

### stylingSolution

> **stylingSolution**: [`AtomsStylingSolution`](../type-aliases/AtomsStylingSolution.md)

Defined in: [content/src/atoms/types.ts:53](https://github.com/Sitecore/content-sdk/blob/eb4a5a9ee099182eed23366c9fea12d5faf5c541/packages/content/src/atoms/types.ts#L53)

Styling solution used to style the app, from `defineAtomsCatalog`. Always present (defaults to `'inline-css'`).

***

### version?

> `optional` **version?**: `string`

Defined in: [content/src/atoms/types.ts:51](https://github.com/Sitecore/content-sdk/blob/eb4a5a9ee099182eed23366c9fea12d5faf5c541/packages/content/src/atoms/types.ts#L51)

Catalog root version from `defineAtomsCatalog`. Absent when not declared.
