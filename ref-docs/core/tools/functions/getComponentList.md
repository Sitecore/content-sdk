[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / getComponentList

# Function: getComponentList()

> **getComponentList**(`paths`, `exclude?`): [`ComponentFile`](../interfaces/ComponentFile.md)[]

Defined in: [packages/core/src/tools/templating/components.ts:50](https://github.com/Sitecore/content-sdk/blob/e8b106f23eb416c3200d4f8e6db200c4a3f9f594/packages/core/src/tools/templating/components.ts#L50)

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
