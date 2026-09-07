[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / AtomsCatalogInput

# Type Alias: AtomsCatalogInput

> **AtomsCatalogInput** = `BaseCatalog` & `object`

Defined in: [packages/react/src/atoms/types.ts:31](https://github.com/Sitecore/content-sdk/blob/ca7272bc1a009ef1f2cccf0a06e430177d67b266/packages/react/src/atoms/types.ts#L31)

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
