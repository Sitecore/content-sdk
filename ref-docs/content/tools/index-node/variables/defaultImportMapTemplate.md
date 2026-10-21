[**@sitecore-content-sdk/content**](../../../README.md)

***

[@sitecore-content-sdk/content](../../../README.md) / [tools/index-node](../README.md) / defaultImportMapTemplate

# Variable: defaultImportMapTemplate

> **defaultImportMapTemplate**: (`indexedImportMap`, `framework`, `defaultImportEntriesImport`) => `string` = `_defaultMapTemplate`

Defined in: [content/src/tools/codegen/import-map.ts:38](https://github.com/Sitecore/content-sdk/blob/f0d8e2f2a4d2702c275ba74dc0030e61bf69fd01/packages/content/src/tools/codegen/import-map.ts#L38)

**`Internal`**

Builds file contents for component map based on the default template

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `indexedImportMap` | `Map`\<`string`, [`ModuleExports`](../type-aliases/ModuleExports.md)\> | `undefined` | map to be processed into final component-map.ts file |
| `framework` | `string` | `'core'` | - |
| `defaultImportEntriesImport` | `string` | `'defaultImportEntries'` | - |

## Returns

`string`

file code for component-map.ts
