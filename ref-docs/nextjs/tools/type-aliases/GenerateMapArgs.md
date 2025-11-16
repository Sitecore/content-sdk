[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / GenerateMapArgs

# Type Alias: GenerateMapArgs

> **GenerateMapArgs** = `object`

Defined in: core/types/tools/generate-map.d.ts:13

Arguments for the generateMap function.

## Remarks

This type defines all configuration options for generating Sitecore component maps.
Component maps can be generated as a single file or split into server/client variants.

## Properties

### clientComponentMap?

> `optional` **clientComponentMap**: `boolean`

Defined in: core/types/tools/generate-map.d.ts:33

Optional flag to generate separate client and server component maps. When true,
generates both component-map.ts (all components) and component-map.client.ts (client + universal only).
When false or undefined, generates single component-map.ts (traditional behavior).

***

### clientMapTemplate?

> `optional` **clientMapTemplate**: `ComponentMapTemplate` \| `EnhancedComponentMapTemplate`

Defined in: core/types/tools/generate-map.d.ts:27

Optional custom template function to generate the client component map content (only used when clientComponentMap is true).

***

### componentImports?

> `optional` **componentImports**: [`ComponentImport`](../interfaces/ComponentImport.md)[]

Defined in: core/types/tools/generate-map.d.ts:19

Optional array of package definitions for component imports to include in the map.

***

### destination?

> `optional` **destination**: `string`

Defined in: core/types/tools/generate-map.d.ts:17

Destination folder path for the generated map.

#### Default Value

```ts
'src/.sitecore'
```

***

### exclude?

> `optional` **exclude**: `string`[]

Defined in: core/types/tools/generate-map.d.ts:21

Optional array of glob paths to exclude from the map.

***

### includeVariants?

> `optional` **includeVariants**: `boolean`

Defined in: core/types/tools/generate-map.d.ts:35

Optional flag to include component's variants path in the component map.

***

### mapTemplate?

> `optional` **mapTemplate**: `ComponentMapTemplate` \| `EnhancedComponentMapTemplate`

Defined in: core/types/tools/generate-map.d.ts:23

Optional custom template function to generate the main component map content.

***

### paths

> **paths**: `string`[]

Defined in: core/types/tools/generate-map.d.ts:15

Array of component paths to include in component map.
