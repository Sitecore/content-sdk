[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / writeImportMap

# Function: writeImportMap()

> **writeImportMap**(`args`): () => `Promise`\<`void`\>

<<<<<<< HEAD
Defined in: [nextjs/src/tools/codegen/import-map.ts:259](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/tools/codegen/import-map.ts#L259)
=======
Defined in: [nextjs/src/tools/codegen/import-map.ts:259](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/tools/codegen/import-map.ts#L259)
>>>>>>> dd686bb50 (Update API docs)

Entry point function for generating import-map. Parses provided paths and outputs the modules and imports from those files into .sitecore/import-map.ts

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WriteImportMapArgs` | include/exclude paths settings to be processed for import-map, and the Sitecore configuration |

## Returns

> (): `Promise`\<`void`\>

### Returns

`Promise`\<`void`\>
