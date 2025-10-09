[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / writeImportMap

# Function: writeImportMap()

> **writeImportMap**(`args`): () => `Promise`\<`void`\>

Defined in: [packages/core/src/tools/codegen/import-map.ts:323](https://github.com/Sitecore/content-sdk/blob/1c8f633c7651baec96c06fbaa0804ea244809879/packages/core/src/tools/codegen/import-map.ts#L323)

Entry point function for generating import-map. Parses provided paths and outputs the modules and imports from those files into .sitecore/import-map.ts

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WriteImportMapArgs` | include/exclude paths settings to be processed for import-map, and the Sitecore configuration |

## Returns

> (): `Promise`\<`void`\>

### Returns

`Promise`\<`void`\>
