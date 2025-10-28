[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / GenerateMapArgs

# Type Alias: GenerateMapArgs

> **GenerateMapArgs** = `object`

Defined in: core/types/tools/generate-map.d.ts:12

Arguments for the generateMap function.

## Properties

### componentImports?

> `optional` **componentImports**: [`ComponentImport`](../interfaces/ComponentImport.md)[]

Defined in: core/types/tools/generate-map.d.ts:15

Optional array of package definitions for component imports to include in the map.

***

### destination?

> `optional` **destination**: `string`

Defined in: core/types/tools/generate-map.d.ts:14

Destination folder path for the generated map.

***

### exclude?

> `optional` **exclude**: `string`[]

Defined in: core/types/tools/generate-map.d.ts:16

Optional array of glob paths to exclude from the map.

***

### mapTemplate()?

> `optional` **mapTemplate**: (`components`, `componentImports?`) => `string`

Defined in: core/types/tools/generate-map.d.ts:17

Optional custom template function to generate the component map content.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `components` | [`ComponentFile`](../interfaces/ComponentFile.md)[] |
| `componentImports?` | [`ComponentImport`](../interfaces/ComponentImport.md)[] |

#### Returns

`string`

***

### paths

> **paths**: `string`[]

Defined in: core/types/tools/generate-map.d.ts:13

Array of component paths to include in component map.
