[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / WriteImportMapArgs

# Type Alias: WriteImportMapArgs

> **WriteImportMapArgs** = `object`

Defined in: [packages/core/src/tools/codegen/import-map.ts:76](https://github.com/Sitecore/content-sdk/blob/88ea2007457764e489c77332ca810c2d7a64fcd2/packages/core/src/tools/codegen/import-map.ts#L76)

Args for import map generation
Specifies paths to include and exclude when generating imports

## Properties

### clientTemplate()?

> `optional` **clientTemplate**: (`indexedImportMap`) => `string`

Defined in: [packages/core/src/tools/codegen/import-map.ts:100](https://github.com/Sitecore/content-sdk/blob/88ea2007457764e489c77332ca810c2d7a64fcd2/packages/core/src/tools/codegen/import-map.ts#L100)

Function to return custom template for client import map file when separateServerClientMaps is true.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `indexedImportMap` | `Map`\<`string`, [`ModuleExports`](ModuleExports.md)\> | import map to be processed into final import-map.client.ts file |

#### Returns

`string`

contents for resulting import map file

***

### exclude?

> `optional` **exclude**: `string`[]

Defined in: [packages/core/src/tools/codegen/import-map.ts:82](https://github.com/Sitecore/content-sdk/blob/88ea2007457764e489c77332ca810c2d7a64fcd2/packages/core/src/tools/codegen/import-map.ts#L82)

***

### paths

> **paths**: `string`[]

Defined in: [packages/core/src/tools/codegen/import-map.ts:77](https://github.com/Sitecore/content-sdk/blob/88ea2007457764e489c77332ca810c2d7a64fcd2/packages/core/src/tools/codegen/import-map.ts#L77)

***

### ~~scConfig?~~

> `optional` **scConfig**: [`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md)

Defined in: [packages/core/src/tools/codegen/import-map.ts:81](https://github.com/Sitecore/content-sdk/blob/88ea2007457764e489c77332ca810c2d7a64fcd2/packages/core/src/tools/codegen/import-map.ts#L81)

#### Deprecated

Pass `config` to the `defineCliConfig` function instead. This argument will be removed in the next major version.

***

### separateServerClientMaps?

> `optional` **separateServerClientMaps**: `boolean`

Defined in: [packages/core/src/tools/codegen/import-map.ts:87](https://github.com/Sitecore/content-sdk/blob/88ea2007457764e489c77332ca810c2d7a64fcd2/packages/core/src/tools/codegen/import-map.ts#L87)

generate separate import map for server/client components
when true, generates import-map.server.ts and import-map.client.ts

***

### serverTemplate()?

> `optional` **serverTemplate**: (`indexedImportMap`) => `string`

Defined in: [packages/core/src/tools/codegen/import-map.ts:94](https://github.com/Sitecore/content-sdk/blob/88ea2007457764e489c77332ca810c2d7a64fcd2/packages/core/src/tools/codegen/import-map.ts#L94)

Function to return custom template for server import map file.
Will be used as default template if separateServerClientMaps is false.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `indexedImportMap` | `Map`\<`string`, [`ModuleExports`](ModuleExports.md)\> | import map to be processed into final import-map.ts or import-map.server.ts file |

#### Returns

`string`

contents for resulting import map file
