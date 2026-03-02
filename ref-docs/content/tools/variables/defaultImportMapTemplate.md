[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / defaultImportMapTemplate

# Variable: defaultImportMapTemplate()

> **defaultImportMapTemplate**: (`indexedImportMap`, `framework`, `defaultImportEntriesImport`) => `string` = `_defaultMapTemplate`

Defined in: [content/src/tools/codegen/import-map.ts:34](https://github.com/Sitecore/content-sdk/blob/a62a1f22ed28ce75629a695b9a29f5908e48b767/packages/content/src/tools/codegen/import-map.ts#L34)

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
