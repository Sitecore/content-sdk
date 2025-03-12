[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / getComponentList

# Function: getComponentList()

> **getComponentList**(`path`): [`ComponentFile`](../interfaces/ComponentFile.md)[]

Defined in: [packages/core/src/tools/templating/components.ts:33](https://github.com/Sitecore/xmc-jss-dev/blob/f62fda45ad3407dd6bbe9ef6536a99934293651e/packages/core/src/tools/templating/components.ts#L33)

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
