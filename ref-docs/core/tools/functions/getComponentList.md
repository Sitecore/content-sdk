[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / getComponentList

# Function: getComponentList()

> **getComponentList**(`paths`, `exclude?`): [`ComponentFile`](../interfaces/ComponentFile.md)[]

<<<<<<< HEAD
Defined in: [packages/core/src/tools/templating/components.ts:50](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/tools/templating/components.ts#L50)
=======
Defined in: [packages/core/src/tools/templating/components.ts:50](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/tools/templating/components.ts#L50)
>>>>>>> dd686bb50 (Update API docs)

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
