[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / AtomsCatalogInput

# Type Alias: AtomsCatalogInput

> **AtomsCatalogInput** = `BaseCatalog` & `object`

Defined in: [packages/react/src/atoms/types.ts:50](https://github.com/Sitecore/content-sdk/blob/ce87c676fc99682dfe788e7ca7dc2a0c95e8cb51/packages/react/src/atoms/types.ts#L50)

Input shape for defineAtomsCatalog.
Extends json-render's base catalog input with Sitecore-specific fields.

## Type Declaration

### actions

> **actions**: `Record`\<`string`, [`AtomActionDefinition`](AtomActionDefinition.md)\>

Action definitions keyed by name (required).

### components

> **components**: `Record`\<`string`, [`AtomComponentDefinition`](AtomComponentDefinition.md)\>

Component definitions keyed by name.

### version?

> `optional` **version?**: `string`

Semver version of the catalog as a whole. Used by the lock file and Design Studio.
