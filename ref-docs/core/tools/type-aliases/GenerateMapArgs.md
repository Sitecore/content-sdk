[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / GenerateMapArgs

# Type Alias: GenerateMapArgs

> **GenerateMapArgs** = `object`

Defined in: packages/core/src/tools/generate-map.ts:14

Arguments for the generateMap function.
This type defines all configuration options for generating Sitecore component maps.
Component maps can be generated as a single file or split into server/client variants.

## Properties

### clientComponentMap?

> `optional` **clientComponentMap**: `boolean`

Defined in: packages/core/src/tools/generate-map.ts:34

Optional flag to generate separate client and server component maps. When true,
generates both component-map.ts (all components) and component-map.client.ts (client + universal only).
When false or undefined, generates single component-map.ts (traditional behavior).

***

### clientMapTemplate?

> `optional` **clientMapTemplate**: [`ComponentMapTemplate`](ComponentMapTemplate.md) \| [`EnhancedComponentMapTemplate`](EnhancedComponentMapTemplate.md)

Defined in: packages/core/src/tools/generate-map.ts:28

Optional custom template function to generate the client component map content (only used when clientComponentMap is true).

***

### componentImports?

> `optional` **componentImports**: [`ComponentImport`](../interfaces/ComponentImport.md)[]

Defined in: packages/core/src/tools/generate-map.ts:20

Optional array of package definitions for component imports to include in the map.

***

### destination?

> `optional` **destination**: `string`

Defined in: packages/core/src/tools/generate-map.ts:18

Destination folder path for the generated map.

#### Default Value

```ts
'src/.sitecore'
```

***

### exclude?

> `optional` **exclude**: `string`[]

Defined in: packages/core/src/tools/generate-map.ts:22

Optional array of glob paths to exclude from the map.

***

### includeVariants?

> `optional` **includeVariants**: `boolean`

Defined in: packages/core/src/tools/generate-map.ts:36

Optional flag to include component's variants path in the component map.

***

### mapTemplate?

> `optional` **mapTemplate**: [`ComponentMapTemplate`](ComponentMapTemplate.md) \| [`EnhancedComponentMapTemplate`](EnhancedComponentMapTemplate.md)

Defined in: packages/core/src/tools/generate-map.ts:24

Optional custom template function to generate the main component map content.

***

### paths

> **paths**: `string`[]

Defined in: packages/core/src/tools/generate-map.ts:16

Array of component paths to include in component map.
