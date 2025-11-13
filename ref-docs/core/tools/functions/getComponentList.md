[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / getComponentList

# Function: getComponentList()

> **getComponentList**(`path`): [`ComponentFile`](../interfaces/ComponentFile.md)[]

Defined in: [packages/core/src/tools/templating/components.ts:33](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/tools/templating/components.ts#L33)

Get list of components from

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | path to search |

## Returns

[`ComponentFile`](../interfaces/ComponentFile.md)[]

## Var

path
Returns a list of components in the following format:
{
 path: 'path/to/component',
 componentName: 'ComponentName',
 moduleName: 'ComponentName'
}
