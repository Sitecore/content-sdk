[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / writeImportMap

# Variable: writeImportMap()

> `const` **writeImportMap**: (`args`) => (`{ scConfig }?`) => `Promise`\<`void`\>

Defined in: core/types/tools/codegen/import-map.d.ts:66

Entry point function for generating import-map. Parses provided paths and outputs the modules and imports from those files into .sitecore/import-map.ts

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WriteImportMapArgs` | include/exclude paths settings to be processed for import-map, and the Sitecore configuration |

## Returns

> (`{ scConfig }?`): `Promise`\<`void`\>

### Parameters

| Parameter | Type |
| ------ | ------ |
| `{ scConfig }?` | \{ `scConfig?`: `SitecoreConfig`; \} |
| `{ scConfig }.scConfig?` | `SitecoreConfig` |

### Returns

`Promise`\<`void`\>
