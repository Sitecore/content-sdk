[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / writeImportMap

# Function: writeImportMap()

> **writeImportMap**(`args`): () => `Promise`\<`void`\>

Defined in: [nextjs/src/tools/codegen/import-map.ts:261](https://github.com/Sitecore/content-sdk/blob/07b4e06d905b3449e7af39083888c975ab2e1a04/packages/nextjs/src/tools/codegen/import-map.ts#L261)

Entry point function for generating import-map. Parses provided paths and outputs the modules and imports from those files into .sitecore/import-map.ts

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WriteImportMapArgs` | include/exclude paths settings to be processed for import-map, and the Sitecore configuration |

## Returns

> (): `Promise`\<`void`\>

### Returns

`Promise`\<`void`\>
