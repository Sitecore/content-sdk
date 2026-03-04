[**@sitecore-content-sdk/content**](../../../README.md)

***

[@sitecore-content-sdk/content](../../../README.md) / [tools/index-node](../README.md) / WriteImportMapArgsInternal

# Type Alias: WriteImportMapArgsInternal

> **WriteImportMapArgsInternal** = [`WriteImportMapArgs`](WriteImportMapArgs.md) & `object`

Defined in: [content/src/tools/codegen/import-map.ts:89](https://github.com/Sitecore/content-sdk/blob/6636e785a81bcfd5e1d8256028ed9f3db7bd96d8/packages/content/src/tools/codegen/import-map.ts#L89)

**`Internal`**

Internal args for import map generation
Extends WriteImportMapArgs with additional settings for templates and server/client maps applied within Content SDK

## Type Declaration

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
