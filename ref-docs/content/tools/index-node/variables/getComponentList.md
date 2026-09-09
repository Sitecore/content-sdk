[**@sitecore-content-sdk/content**](../../../README.md)

***

[@sitecore-content-sdk/content](../../../README.md) / [tools/index-node](../README.md) / getComponentList

# Variable: getComponentList

> **getComponentList**: (`paths`, `exclude?`, `includeVariants?`) => [`ComponentFile`](../../interfaces/ComponentFile.md)[] = `_getComponentList`

Defined in: [content/src/tools/templating/components.ts:6](https://github.com/Sitecore/content-sdk/blob/ccaa42fb0ef4df028b4e3a0cdf13355c3673c639/packages/content/src/tools/templating/components.ts#L6)

Get list of components from

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `paths` | `string`[] | paths to search |
| `exclude?` | `string`[] | paths and glob patterns to exclude from final result |
| `includeVariants?` | `boolean` | whether to include variant components |

## Returns

[`ComponentFile`](../../interfaces/ComponentFile.md)[]

## Var

path
Returns a list of components in the following format:
{
 path: 'path/to/component',
 componentName: 'ComponentName',
 moduleName: 'ComponentName'
}
