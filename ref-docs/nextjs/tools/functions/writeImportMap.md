[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / writeImportMap

# Function: writeImportMap()

> **writeImportMap**(`args`): (`__namedParameters`) => `Promise`\<`void`\>

Defined in: [nextjs/src/tools/codegen/import-map.ts:25](https://github.com/Sitecore/content-sdk/blob/3746e90462f2207927cf04da92b0c6dc4ff879fc/packages/nextjs/src/tools/codegen/import-map.ts#L25)

Entry point function for generating import-map. Parses provided paths and outputs the modules and imports from those files into .sitecore/import-map.ts

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WriteImportMapArgs` | include/exclude paths settings to be processed for import-map, and the Sitecore configuration. |

## Returns

> (`__namedParameters`): `Promise`\<`void`\>

### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | \{ `scConfig`: `SitecoreConfig`; \} |
| `__namedParameters.scConfig` | `SitecoreConfig` |

### Returns

`Promise`\<`void`\>
