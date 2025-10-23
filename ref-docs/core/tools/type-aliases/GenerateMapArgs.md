[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / GenerateMapArgs

# Type Alias: GenerateMapArgs

> **GenerateMapArgs** = `object`

Defined in: [packages/core/src/tools/generate-map.ts:19](https://github.com/Sitecore/content-sdk/blob/685d5642934579f7870610a5d3e64f5d001ae881/packages/core/src/tools/generate-map.ts#L19)

Arguments for the generateMap function.

## Properties

### clientComponentMap?

> `optional` **clientComponentMap**: `boolean`

Defined in: [packages/core/src/tools/generate-map.ts:26](https://github.com/Sitecore/content-sdk/blob/685d5642934579f7870610a5d3e64f5d001ae881/packages/core/src/tools/generate-map.ts#L26)

Optional flag to generate separate client and server component maps. When true,
                                           generates both component-map.ts (all components) and component-map.client.ts (client + universal only).
                                           When false or undefined, generates single component-map.ts (traditional behavior).

***

### clientMapTemplate?

> `optional` **clientMapTemplate**: [`ComponentMapTemplate`](ComponentMapTemplate.md) \| [`EnhancedComponentMapTemplate`](EnhancedComponentMapTemplate.md)

Defined in: [packages/core/src/tools/generate-map.ts:25](https://github.com/Sitecore/content-sdk/blob/685d5642934579f7870610a5d3e64f5d001ae881/packages/core/src/tools/generate-map.ts#L25)

Optional custom template function to generate the client component map content (only used when clientComponentMap is true).

***

### componentImports?

> `optional` **componentImports**: [`ComponentImport`](../interfaces/ComponentImport.md)[]

Defined in: [packages/core/src/tools/generate-map.ts:22](https://github.com/Sitecore/content-sdk/blob/685d5642934579f7870610a5d3e64f5d001ae881/packages/core/src/tools/generate-map.ts#L22)

Optional array of package definitions for component imports to include in the map.

***

### destination?

> `optional` **destination**: `string`

Defined in: [packages/core/src/tools/generate-map.ts:21](https://github.com/Sitecore/content-sdk/blob/685d5642934579f7870610a5d3e64f5d001ae881/packages/core/src/tools/generate-map.ts#L21)

Destination folder path for the generated map.

***

### exclude?

> `optional` **exclude**: `string`[]

Defined in: [packages/core/src/tools/generate-map.ts:23](https://github.com/Sitecore/content-sdk/blob/685d5642934579f7870610a5d3e64f5d001ae881/packages/core/src/tools/generate-map.ts#L23)

Optional array of glob paths to exclude from the map.

***

### includeVariants?

> `optional` **includeVariants**: `boolean`

Defined in: [packages/core/src/tools/generate-map.ts:27](https://github.com/Sitecore/content-sdk/blob/685d5642934579f7870610a5d3e64f5d001ae881/packages/core/src/tools/generate-map.ts#L27)

Optional flag to include component's variants path in the component map.

***

### mapTemplate?

> `optional` **mapTemplate**: [`ComponentMapTemplate`](ComponentMapTemplate.md) \| [`EnhancedComponentMapTemplate`](EnhancedComponentMapTemplate.md)

Defined in: [packages/core/src/tools/generate-map.ts:24](https://github.com/Sitecore/content-sdk/blob/685d5642934579f7870610a5d3e64f5d001ae881/packages/core/src/tools/generate-map.ts#L24)

Optional custom template function to generate the main component map content.

***

### paths

> **paths**: `string`[]

Defined in: [packages/core/src/tools/generate-map.ts:20](https://github.com/Sitecore/content-sdk/blob/685d5642934579f7870610a5d3e64f5d001ae881/packages/core/src/tools/generate-map.ts#L20)

Array of component paths to include in component map.
