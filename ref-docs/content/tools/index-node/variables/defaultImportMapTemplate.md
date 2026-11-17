[**@sitecore-content-sdk/content**](../../../README.md)

***

[@sitecore-content-sdk/content](../../../README.md) / [tools/index-node](../README.md) / defaultImportMapTemplate

# Variable: defaultImportMapTemplate

> **defaultImportMapTemplate**: (`indexedImportMap`, `framework`, `defaultImportEntriesImport`) => `string` = `_defaultMapTemplate`

Defined in: [content/src/tools/codegen/import-map.ts:37](https://github.com/Sitecore/content-sdk/blob/5991f1a4c56e3c96ca4c21000f5f32eaf78f2644/packages/content/src/tools/codegen/import-map.ts#L37)

**`Internal`**

Builds file contents for component map based on the default template

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `indexedImportMap` | `Map`\<`string`, [`ModuleExports`](../type-aliases/ModuleExports.md)\> | `undefined` | map to be processed into final component-map.ts file |
| `framework?` | `string` | `'core'` | - |
| `defaultImportEntriesImport?` | `string` | `'defaultImportEntries'` | - |

## Returns

`string`

file code for component-map.ts
