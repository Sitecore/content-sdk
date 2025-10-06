[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / GenerateMapArgs

# Type Alias: GenerateMapArgs

> **GenerateMapArgs** = `object`

Defined in: [packages/core/src/tools/generate-map.ts:16](https://github.com/Sitecore/content-sdk/blob/c6d79fb7cf099c2bccf76e3f383b969340251618/packages/core/src/tools/generate-map.ts#L16)

Arguments for the generateMap function.

## Properties

### clientComponentMap?

> `optional` **clientComponentMap**: `boolean`

Defined in: [packages/core/src/tools/generate-map.ts:23](https://github.com/Sitecore/content-sdk/blob/c6d79fb7cf099c2bccf76e3f383b969340251618/packages/core/src/tools/generate-map.ts#L23)

Optional flag to generate separate client and server component maps. When true, generates both component-map.ts (all components) and component-map.client.ts (client + universal only). When false or undefined, generates single component-map.ts (traditional behavior).

***

### clientMapTemplate()?

> `optional` **clientMapTemplate**: (`components`, `componentImports?`) => `string`

Defined in: [packages/core/src/tools/generate-map.ts:22](https://github.com/Sitecore/content-sdk/blob/c6d79fb7cf099c2bccf76e3f383b969340251618/packages/core/src/tools/generate-map.ts#L22)

Optional custom template function to generate the client component map content (only used when clientComponentMap is true).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `components` | [`ComponentFileWithType`](../interfaces/ComponentFileWithType.md)[] |
| `componentImports?` | [`ComponentImport`](../interfaces/ComponentImport.md)[] |

#### Returns

`string`

***

### componentImports?

> `optional` **componentImports**: [`ComponentImport`](../interfaces/ComponentImport.md)[]

Defined in: [packages/core/src/tools/generate-map.ts:19](https://github.com/Sitecore/content-sdk/blob/c6d79fb7cf099c2bccf76e3f383b969340251618/packages/core/src/tools/generate-map.ts#L19)

Optional array of package definitions for component imports to include in the map.

***

### destination?

> `optional` **destination**: `string`

Defined in: [packages/core/src/tools/generate-map.ts:18](https://github.com/Sitecore/content-sdk/blob/c6d79fb7cf099c2bccf76e3f383b969340251618/packages/core/src/tools/generate-map.ts#L18)

Destination folder path for the generated map.

***

### exclude?

> `optional` **exclude**: `string`[]

Defined in: [packages/core/src/tools/generate-map.ts:20](https://github.com/Sitecore/content-sdk/blob/c6d79fb7cf099c2bccf76e3f383b969340251618/packages/core/src/tools/generate-map.ts#L20)

Optional array of glob paths to exclude from the map.

***

### mapTemplate()?

> `optional` **mapTemplate**: (`components`, `componentImports?`) => `string`

Defined in: [packages/core/src/tools/generate-map.ts:21](https://github.com/Sitecore/content-sdk/blob/c6d79fb7cf099c2bccf76e3f383b969340251618/packages/core/src/tools/generate-map.ts#L21)

Optional custom template function to generate the main component map content.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `components` | [`ComponentFile`](../interfaces/ComponentFile.md)[] \| [`ComponentFileWithType`](../interfaces/ComponentFileWithType.md)[] |
| `componentImports?` | [`ComponentImport`](../interfaces/ComponentImport.md)[] |

#### Returns

`string`

***

### paths

> **paths**: `string`[]

Defined in: [packages/core/src/tools/generate-map.ts:17](https://github.com/Sitecore/content-sdk/blob/c6d79fb7cf099c2bccf76e3f383b969340251618/packages/core/src/tools/generate-map.ts#L17)

Array of component paths to include in component map.
