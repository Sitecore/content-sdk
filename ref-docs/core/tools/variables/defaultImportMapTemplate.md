[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / defaultImportMapTemplate

# Variable: defaultImportMapTemplate()

> **defaultImportMapTemplate**: (`indexedImportMap`, `framework`) => `string` = `_defaultMapTemplate`

Defined in: [packages/core/src/tools/codegen/import-map.ts:34](https://github.com/Sitecore/content-sdk/blob/88ea2007457764e489c77332ca810c2d7a64fcd2/packages/core/src/tools/codegen/import-map.ts#L34)

**`Internal`**

Builds file contents for component map based on the default template

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `indexedImportMap` | `Map`\<`string`, [`ModuleExports`](../type-aliases/ModuleExports.md)\> | `undefined` | map to be processed into final component-map.ts file |
| `framework` | `string` | `'core'` | - |

## Returns

`string`

file code for component-map.ts
