[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / importsNamedExport

# Function: importsNamedExport()

> **importsNamedExport**(`source`, `modulePattern`, `names`): `boolean`

Defined in: [packages/core/src/tools/capabilities/filter-utils.ts:73](https://github.com/Sitecore/content-sdk/blob/6bf9292fdd107f1fb78908370ca4f0fc56a384ff/packages/core/src/tools/capabilities/filter-utils.ts#L73)

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
