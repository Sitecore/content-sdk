[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / AtomsCatalogInput

# Type Alias: AtomsCatalogInput

> **AtomsCatalogInput** = `BaseCatalog` & `object`

Defined in: [packages/react/src/atoms/types.ts:34](https://github.com/Sitecore/content-sdk/blob/12c0a210ef65690d61f7ca0dbaa89ebf79d5ebb3/packages/react/src/atoms/types.ts#L34)

Input shape for defineAtomsCatalog.
Extends json-render's base catalog input with Sitecore-specific fields.

## Type Declaration

### actions

> **actions**: `Record`\<`string`, [`AtomActionDefinition`](AtomActionDefinition.md)\>

Action definitions keyed by name (required).

### components

> **components**: `Record`\<`string`, [`AtomComponentDefinition`](AtomComponentDefinition.md)\>

Component definitions keyed by name.

### stylingSolution?

> `optional` **stylingSolution?**: [`AtomsStylingSolution`](AtomsStylingSolution.md)

Styling solution used to style the app.

#### Default

```ts
'inline-css'
```

### version?

> `optional` **version?**: `string`

Semver version of the catalog as a whole. Used by the lock file and Design Studio.
