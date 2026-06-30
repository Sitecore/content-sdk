[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / writeImportMap

# Function: writeImportMap()

> **writeImportMap**(`args`): (`__namedParameters`) => `Promise`\<`void`\>

Defined in: [nextjs/src/tools/codegen/import-map.ts:25](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/nextjs/src/tools/codegen/import-map.ts#L25)

Entry point function for generating import-map. Parses provided paths and outputs the modules and imports from those files into .sitecore/import-map.ts

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WriteImportMapArgs` | include/exclude paths settings to be processed for import-map, and the Sitecore configuration. |

## Returns

(`__namedParameters`) => `Promise`\<`void`\>
