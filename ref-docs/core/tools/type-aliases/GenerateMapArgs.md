[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / GenerateMapArgs

# Type Alias: GenerateMapArgs

> **GenerateMapArgs** = `object`

Defined in: [packages/core/src/tools/generate-map.ts:14](https://github.com/Sitecore/content-sdk/blob/a574c2b59cc278151cdc430bb5bb42a9b7428d10/packages/core/src/tools/generate-map.ts#L14)

Arguments for the generateMap function.

## Properties

### componentImports?

> `optional` **componentImports**: [`ComponentImport`](../interfaces/ComponentImport.md)[]

Defined in: [packages/core/src/tools/generate-map.ts:17](https://github.com/Sitecore/content-sdk/blob/a574c2b59cc278151cdc430bb5bb42a9b7428d10/packages/core/src/tools/generate-map.ts#L17)

Optional array of package definitions for component imports to include in the map.

***

### destination?

> `optional` **destination**: `string`

Defined in: [packages/core/src/tools/generate-map.ts:16](https://github.com/Sitecore/content-sdk/blob/a574c2b59cc278151cdc430bb5bb42a9b7428d10/packages/core/src/tools/generate-map.ts#L16)

Destination folder path for the generated map.

***

### exclude?

> `optional` **exclude**: `string`[]

Defined in: [packages/core/src/tools/generate-map.ts:18](https://github.com/Sitecore/content-sdk/blob/a574c2b59cc278151cdc430bb5bb42a9b7428d10/packages/core/src/tools/generate-map.ts#L18)

Optional array of glob paths to exclude from the map.

***

### mapTemplate()?

> `optional` **mapTemplate**: (`components`, `componentImports?`) => `string`

Defined in: [packages/core/src/tools/generate-map.ts:19](https://github.com/Sitecore/content-sdk/blob/a574c2b59cc278151cdc430bb5bb42a9b7428d10/packages/core/src/tools/generate-map.ts#L19)

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

Defined in: [packages/core/src/tools/generate-map.ts:15](https://github.com/Sitecore/content-sdk/blob/a574c2b59cc278151cdc430bb5bb42a9b7428d10/packages/core/src/tools/generate-map.ts#L15)

Array of component paths to include in component map.
