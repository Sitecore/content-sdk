[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / getComponentList

# Function: getComponentList()

> **getComponentList**(`paths`, `exclude?`): [`ComponentFile`](../interfaces/ComponentFile.md)[]

Defined in: [packages/core/src/tools/templating/components.ts:44](https://github.com/Sitecore/content-sdk/blob/5340b58d21e724c672e5a0ec619aff194e9a7a60/packages/core/src/tools/templating/components.ts#L44)

Get list of components from

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `paths` | `string`[] | paths to search |
| `exclude?` | `string`[] | paths and glob patterns to exclude from final result |

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
