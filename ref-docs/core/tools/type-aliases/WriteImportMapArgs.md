[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / WriteImportMapArgs

# Type Alias: WriteImportMapArgs

> **WriteImportMapArgs** = `object`

Defined in: packages/core/src/tools/codegen/import-map.ts:76

Args for import map generation
Specifies paths to include and exclude when generating imports

## Properties

### exclude?

> `optional` **exclude**: `string`[]

Defined in: packages/core/src/tools/codegen/import-map.ts:82

***

### paths

> **paths**: `string`[]

Defined in: packages/core/src/tools/codegen/import-map.ts:77

***

### ~~scConfig?~~

> `optional` **scConfig**: [`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md)

Defined in: packages/core/src/tools/codegen/import-map.ts:81

#### Deprecated

Pass `config` to the `defineCliConfig` function instead. This argument will be removed in the next major version.
