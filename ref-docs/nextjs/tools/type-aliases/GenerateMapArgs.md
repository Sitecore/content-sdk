[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / GenerateMapArgs

# Type Alias: GenerateMapArgs

> **GenerateMapArgs** = `object`

Defined in: core/types/tools/generate-map.d.ts:14

Arguments for the generateMap function.

## Properties

### clientComponentMap?

> `optional` **clientComponentMap**: `boolean`

Defined in: core/types/tools/generate-map.d.ts:21

Optional flag to generate separate client and server component maps. When true, generates both component-map.ts (all components) and component-map.client.ts (client + universal only). When false or undefined, generates single component-map.ts (traditional behavior).

***

### clientMapTemplate()?

> `optional` **clientMapTemplate**: (`components`, `componentImports?`) => `string`

Defined in: core/types/tools/generate-map.d.ts:20

Optional custom template function to generate the client component map content (only used when clientComponentMap is true).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `components` | `ComponentFileWithType`[] |
| `componentImports?` | [`ComponentImport`](../interfaces/ComponentImport.md)[] |

#### Returns

`string`

***

### componentImports?

> `optional` **componentImports**: [`ComponentImport`](../interfaces/ComponentImport.md)[]

Defined in: core/types/tools/generate-map.d.ts:17

Optional array of package definitions for component imports to include in the map.

***

### destination?

> `optional` **destination**: `string`

Defined in: core/types/tools/generate-map.d.ts:16

Destination folder path for the generated map.

***

### exclude?

> `optional` **exclude**: `string`[]

Defined in: core/types/tools/generate-map.d.ts:18

Optional array of glob paths to exclude from the map.

***

### mapTemplate()?

> `optional` **mapTemplate**: (`components`, `componentImports?`) => `string`

Defined in: core/types/tools/generate-map.d.ts:19

Optional custom template function to generate the main component map content.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `components` | [`ComponentFile`](../interfaces/ComponentFile.md)[] \| `ComponentFileWithType`[] |
| `componentImports?` | [`ComponentImport`](../interfaces/ComponentImport.md)[] |

#### Returns

`string`

***

### paths

> **paths**: `string`[]

Defined in: core/types/tools/generate-map.d.ts:15

Array of component paths to include in component map.
