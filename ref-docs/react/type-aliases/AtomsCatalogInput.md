[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / AtomsCatalogInput

# Type Alias: AtomsCatalogInput

> **AtomsCatalogInput** = `BaseCatalog` & `object`

Defined in: [packages/react/src/atoms/types.ts:38](https://github.com/Sitecore/content-sdk/blob/5b6de22f85fe8291e5526ff894ecf1aa2f7ab37c/packages/react/src/atoms/types.ts#L38)

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
