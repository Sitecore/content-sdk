[**@sitecore-content-sdk/content**](../../../README.md)

***

[@sitecore-content-sdk/content](../../../README.md) / [tools/index-node](../README.md) / writeImportMap

# Function: writeImportMap()

> **writeImportMap**(`args`): (`__namedParameters`) => `Promise`\<`void`\>

Defined in: [content/src/tools/codegen/import-map.ts:411](https://github.com/Sitecore/content-sdk/blob/84866ded66f6f8f69e7f007b2311494e086b493b/packages/content/src/tools/codegen/import-map.ts#L411)

Entry point function for generating import-map. Parses provided paths and outputs the modules and imports from those files into .sitecore/import-map.ts

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | [`WriteImportMapArgsInternal`](../type-aliases/WriteImportMapArgsInternal.md) | include/exclude paths settings to be processed for import-map, and the Sitecore configuration. |

## Returns

(`__namedParameters`) => `Promise`\<`void`\>
