[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / WriteImportMapArgsInternal

# Type Alias: WriteImportMapArgsInternal

> **WriteImportMapArgsInternal** = [`WriteImportMapArgs`](WriteImportMapArgs.md) & `object`

Defined in: [content/src/tools/codegen/import-map.ts:86](https://github.com/Sitecore/content-sdk/blob/93fb4095715f238f6ba12b275948e1f3a8215ed2/packages/content/src/tools/codegen/import-map.ts#L86)

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
