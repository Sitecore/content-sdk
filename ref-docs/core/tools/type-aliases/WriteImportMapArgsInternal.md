[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / WriteImportMapArgsInternal

# Type Alias: WriteImportMapArgsInternal

> **WriteImportMapArgsInternal** = [`WriteImportMapArgs`](WriteImportMapArgs.md) & `object`

Defined in: [packages/core/src/tools/codegen/import-map.ts:90](https://github.com/Sitecore/content-sdk/blob/022af8f424c7ebf42e9ce209f5588bec054e1bde/packages/core/src/tools/codegen/import-map.ts#L90)

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

### separateServerClientMaps?

> `optional` **separateServerClientMaps**: `boolean`

**`Internal`**

generate separate import map for server/client components
when true, generates import-map.server.ts and import-map.client.ts

### serverTemplate()?

> `optional` **serverTemplate**: (`indexedImportMap`) => `string`

**`Internal`**

Function to return custom template for server import map file.
Will be used as default template if separateServerClientMaps is false.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `indexedImportMap` | `Map`\<`string`, [`ModuleExports`](ModuleExports.md)\> | import map to be processed into final import-map.ts or import-map.server.ts file |

#### Returns

`string`

contents for resulting import map file
