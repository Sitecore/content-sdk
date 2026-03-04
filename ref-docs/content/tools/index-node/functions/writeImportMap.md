[**@sitecore-content-sdk/content**](../../../README.md)

***

[@sitecore-content-sdk/content](../../../README.md) / [tools/index-node](../README.md) / writeImportMap

# Function: writeImportMap()

> **writeImportMap**(`args`): (`__namedParameters`) => `Promise`\<`void`\>

Defined in: [content/src/tools/codegen/import-map.ts:384](https://github.com/Sitecore/content-sdk/blob/6636e785a81bcfd5e1d8256028ed9f3db7bd96d8/packages/content/src/tools/codegen/import-map.ts#L384)

Entry point function for generating import-map. Parses provided paths and outputs the modules and imports from those files into .sitecore/import-map.ts

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | [`WriteImportMapArgsInternal`](../type-aliases/WriteImportMapArgsInternal.md) | include/exclude paths settings to be processed for import-map, and the Sitecore configuration. |

## Returns

> (`__namedParameters`): `Promise`\<`void`\>

### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | \{ `scConfig`: [`SitecoreConfig`](../../../config/type-aliases/SitecoreConfig.md); \} |
| `__namedParameters.scConfig` | [`SitecoreConfig`](../../../config/type-aliases/SitecoreConfig.md) |

### Returns

`Promise`\<`void`\>
