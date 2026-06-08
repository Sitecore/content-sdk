[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / WriteImportMapArgs

# Type Alias: WriteImportMapArgs

> **WriteImportMapArgs** = `object`

Defined in: [packages/core/src/tools/codegen/import-map.ts:76](https://github.com/Sitecore/content-sdk/blob/ced9004d90ba6b8b63f83181298ad2b2cc675297/packages/core/src/tools/codegen/import-map.ts#L76)

Args for import map generation
Specifies paths to include and exclude when generating imports

## Properties

### exclude?

> `optional` **exclude**: `string`[]

Defined in: [packages/core/src/tools/codegen/import-map.ts:82](https://github.com/Sitecore/content-sdk/blob/ced9004d90ba6b8b63f83181298ad2b2cc675297/packages/core/src/tools/codegen/import-map.ts#L82)

***

### paths

> **paths**: `string`[]

Defined in: [packages/core/src/tools/codegen/import-map.ts:77](https://github.com/Sitecore/content-sdk/blob/ced9004d90ba6b8b63f83181298ad2b2cc675297/packages/core/src/tools/codegen/import-map.ts#L77)

***

### ~~scConfig?~~

> `optional` **scConfig**: [`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md)

Defined in: [packages/core/src/tools/codegen/import-map.ts:81](https://github.com/Sitecore/content-sdk/blob/ced9004d90ba6b8b63f83181298ad2b2cc675297/packages/core/src/tools/codegen/import-map.ts#L81)

#### Deprecated

Pass `config` to the `defineCliConfig` function instead. This argument will be removed in the next major version.
