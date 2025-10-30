[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / getComponentList

# Variable: getComponentList()

> **getComponentList**: (`paths`, `exclude?`, `includeVariants?`) => [`ComponentFile`](../interfaces/ComponentFile.md)[] = `_getComponentList`

Defined in: [packages/core/src/tools/templating/components.ts:5](https://github.com/Sitecore/content-sdk/blob/a906bba440e9579bfb49486d8c4ee492c095a043/packages/core/src/tools/templating/components.ts#L5)

Get list of components from

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `paths` | `string`[] | paths to search |
| `exclude?` | `string`[] | paths and glob patterns to exclude from final result |
| `includeVariants?` | `boolean` | whether to include variant components |

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
