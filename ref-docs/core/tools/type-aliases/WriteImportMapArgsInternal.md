[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / WriteImportMapArgsInternal

# Type Alias: WriteImportMapArgsInternal

> **WriteImportMapArgsInternal** = [`WriteImportMapArgs`](WriteImportMapArgs.md) & `object`

Defined in: [packages/core/src/tools/codegen/import-map.ts:90](https://github.com/Sitecore/content-sdk/blob/3fb7faea35bc22c17643d4e6e02afd7c37bacdd3/packages/core/src/tools/codegen/import-map.ts#L90)

**`Internal`**

Internal args for import map generation
Extends WriteImportMapArgs with additional settings for templates and server/client maps applied within Content SDK

## Type declaration

### clientTemplate()?

> `optional` **clientTemplate**: (`indexedImportMap`) => `string`

**`Internal`**

Function to return custom template for client import map file when separateServerClientMaps is true.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `indexedImportMap` | `Map`\<`string`, [`ModuleExports`](ModuleExports.md)\> | import map to be processed into final import-map.client.ts file |

#### Returns

`string`

contents for resulting import map file

### defaultTemplate()?

> `optional` **defaultTemplate**: (`indexedImportMap`) => `string`

**`Internal`**

Function to return custom template for import map file.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `indexedImportMap` | `Map`\<`string`, [`ModuleExports`](ModuleExports.md)\> | import map to be processed into final import-map.ts or import-map.server.ts file |

#### Returns

`string`

contents for resulting import map file

### separateServerClientMaps?

> `optional` **separateServerClientMaps**: `boolean`

**`Internal`**

generate separate import map for server/client components
when true, generates import-map.server.ts and import-map.client.ts
