[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [atoms](../README.md) / SerializedCatalog

# Interface: SerializedCatalog

Defined in: [content/src/atoms/types.ts:43](https://github.com/Sitecore/content-sdk/blob/935d69d056b753a906f23541fe4b788acdc743ae/packages/content/src/atoms/types.ts#L43)

**`Internal`**

Full catalog payload sent to Design Studio.

## Properties

### actions

> **actions**: [`AtomCatalogActionEntry`](AtomCatalogActionEntry.md)[]

Defined in: [content/src/atoms/types.ts:49](https://github.com/Sitecore/content-sdk/blob/935d69d056b753a906f23541fe4b788acdc743ae/packages/content/src/atoms/types.ts#L49)

Serialized action entries.

***

### components

> **components**: [`AtomCatalogComponentEntry`](AtomCatalogComponentEntry.md)[]

Defined in: [content/src/atoms/types.ts:47](https://github.com/Sitecore/content-sdk/blob/935d69d056b753a906f23541fe4b788acdc743ae/packages/content/src/atoms/types.ts#L47)

Serialized component entries.

***

### version?

> `optional` **version?**: `string`

Defined in: [content/src/atoms/types.ts:45](https://github.com/Sitecore/content-sdk/blob/935d69d056b753a906f23541fe4b788acdc743ae/packages/content/src/atoms/types.ts#L45)

Catalog root version from `defineAtomsCatalog`. Absent when not declared.
