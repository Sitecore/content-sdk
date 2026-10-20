[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / SerializedCatalog

# Interface: SerializedCatalog

Defined in: [content/src/atoms/types.ts:53](https://github.com/Sitecore/content-sdk/blob/3e573fc42ab394415c9745258970d127cda84bbd/packages/content/src/atoms/types.ts#L53)

**`Internal`**

Full catalog payload sent to Design Studio.

## Properties

### actions

> **actions**: [`AtomCatalogActionEntry`](AtomCatalogActionEntry.md)[]

Defined in: [content/src/atoms/types.ts:61](https://github.com/Sitecore/content-sdk/blob/3e573fc42ab394415c9745258970d127cda84bbd/packages/content/src/atoms/types.ts#L61)

Serialized action entries.

***

### components

> **components**: [`AtomCatalogComponentEntry`](AtomCatalogComponentEntry.md)[]

Defined in: [content/src/atoms/types.ts:59](https://github.com/Sitecore/content-sdk/blob/3e573fc42ab394415c9745258970d127cda84bbd/packages/content/src/atoms/types.ts#L59)

Serialized component entries.

***

### stylingSolution

> **stylingSolution**: [`AtomsStylingSolution`](../type-aliases/AtomsStylingSolution.md)

Defined in: [content/src/atoms/types.ts:57](https://github.com/Sitecore/content-sdk/blob/3e573fc42ab394415c9745258970d127cda84bbd/packages/content/src/atoms/types.ts#L57)

Styling solution used to style the app, from `defineAtomsCatalog`. Always present (defaults to `'inline-css'`).

***

### version?

> `optional` **version?**: `string`

Defined in: [content/src/atoms/types.ts:55](https://github.com/Sitecore/content-sdk/blob/3e573fc42ab394415c9745258970d127cda84bbd/packages/content/src/atoms/types.ts#L55)

Catalog root version from `defineAtomsCatalog`. Absent when not declared.
