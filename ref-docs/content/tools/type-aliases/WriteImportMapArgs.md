[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / WriteImportMapArgs

# Type Alias: WriteImportMapArgs

> **WriteImportMapArgs** = `object`

Defined in: [content/src/tools/codegen/import-map.ts:76](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/content/src/tools/codegen/import-map.ts#L76)

Args for import map generation
Specifies paths to include and exclude when generating imports

## Properties

### exclude?

> `optional` **exclude**: `string`[]

Defined in: [content/src/tools/codegen/import-map.ts:82](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/content/src/tools/codegen/import-map.ts#L82)

***

### paths

> **paths**: `string`[]

Defined in: [content/src/tools/codegen/import-map.ts:77](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/content/src/tools/codegen/import-map.ts#L77)

***

### ~~scConfig?~~

> `optional` **scConfig**: [`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md)

Defined in: [content/src/tools/codegen/import-map.ts:81](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/content/src/tools/codegen/import-map.ts#L81)

#### Deprecated

Pass `config` to the `defineCliConfig` function instead. This argument will be removed in the next major version.
