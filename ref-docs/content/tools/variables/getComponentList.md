[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / getComponentList

# Variable: getComponentList()

> **getComponentList**: (`paths`, `exclude?`, `includeVariants?`) => [`ComponentFile`](../interfaces/ComponentFile.md)[] = `_getComponentList`

Defined in: [content/src/tools/templating/components.ts:6](https://github.com/Sitecore/content-sdk/blob/93fb4095715f238f6ba12b275948e1f3a8215ed2/packages/content/src/tools/templating/components.ts#L6)

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
