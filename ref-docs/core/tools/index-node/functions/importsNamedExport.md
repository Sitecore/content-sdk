[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / importsNamedExport

# Function: importsNamedExport()

> **importsNamedExport**(`source`, `modulePattern`, `names`): `boolean`

Defined in: [packages/core/src/tools/capabilities/filter-utils.ts:73](https://github.com/Sitecore/content-sdk/blob/d7a3c5aad0610817ec39a8d7adbdbdc09d785aad/packages/core/src/tools/capabilities/filter-utils.ts#L73)

**`Internal`**

Tests whether source code imports any of the given names from a matching module.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `source` | `string` | source code |
| `modulePattern` | `RegExp` | pattern the module specifier must match |
| `names` | readonly `string`[] | exported names to look for |

## Returns

`boolean`

whether any of the names is imported
