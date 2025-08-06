[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / GenerateMapArgs

# Type Alias: GenerateMapArgs

> **GenerateMapArgs** = `object`

<<<<<<< HEAD
Defined in: [packages/core/src/tools/generate-map.ts:14](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/tools/generate-map.ts#L14)
=======
Defined in: [packages/core/src/tools/generate-map.ts:14](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/tools/generate-map.ts#L14)
>>>>>>> dd686bb50 (Update API docs)

Arguments for the generateMap function.

## Properties

### componentImports?

> `optional` **componentImports**: [`ComponentImport`](../interfaces/ComponentImport.md)[]

<<<<<<< HEAD
Defined in: [packages/core/src/tools/generate-map.ts:17](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/tools/generate-map.ts#L17)
=======
Defined in: [packages/core/src/tools/generate-map.ts:17](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/tools/generate-map.ts#L17)
>>>>>>> dd686bb50 (Update API docs)

Optional array of package definitions for component imports to include in the map.

***

### destination?

> `optional` **destination**: `string`

<<<<<<< HEAD
Defined in: [packages/core/src/tools/generate-map.ts:16](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/tools/generate-map.ts#L16)
=======
Defined in: [packages/core/src/tools/generate-map.ts:16](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/tools/generate-map.ts#L16)
>>>>>>> dd686bb50 (Update API docs)

Destination folder path for the generated map.

***

### exclude?

> `optional` **exclude**: `string`[]

<<<<<<< HEAD
Defined in: [packages/core/src/tools/generate-map.ts:18](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/tools/generate-map.ts#L18)
=======
Defined in: [packages/core/src/tools/generate-map.ts:18](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/tools/generate-map.ts#L18)
>>>>>>> dd686bb50 (Update API docs)

Optional array of glob paths to exclude from the map.

***

### mapTemplate()?

> `optional` **mapTemplate**: (`components`, `componentImports?`) => `string`

<<<<<<< HEAD
Defined in: [packages/core/src/tools/generate-map.ts:19](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/tools/generate-map.ts#L19)
=======
Defined in: [packages/core/src/tools/generate-map.ts:19](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/tools/generate-map.ts#L19)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/core/src/tools/generate-map.ts:15](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/tools/generate-map.ts#L15)
=======
Defined in: [packages/core/src/tools/generate-map.ts:15](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/tools/generate-map.ts#L15)
>>>>>>> dd686bb50 (Update API docs)

Array of component paths to include in component map.
