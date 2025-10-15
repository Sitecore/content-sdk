[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / getComponentListWithTypes

# Function: getComponentListWithTypes()

> **getComponentListWithTypes**(`paths`, `exclude?`, `routerType?`): [`ComponentFileWithType`](../interfaces/ComponentFileWithType.md)[]

Defined in: [packages/core/src/tools/templating/components.ts:296](https://github.com/Sitecore/content-sdk/blob/ca48edcc6e0b5ca5f670bd66a7cf5b742968ebbe/packages/core/src/tools/templating/components.ts#L296)

Get list of components with detected types (server, client, or universal).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `paths` | `string`[] | Paths to search for components |
| `exclude?` | `string`[] | Paths and glob patterns to exclude from final result |
| `routerType?` | [`RouterType`](../type-aliases/RouterType.md) | Optional router type override for type detection. Auto-detected if not provided. |

## Returns

[`ComponentFileWithType`](../interfaces/ComponentFileWithType.md)[]

Array of components with their detected types
