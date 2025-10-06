[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / getComponentListWithTypes

# Function: getComponentListWithTypes()

> **getComponentListWithTypes**(`paths`, `exclude?`, `routerType?`): [`ComponentFileWithType`](../interfaces/ComponentFileWithType.md)[]

Defined in: [packages/core/src/tools/templating/components.ts:281](https://github.com/Sitecore/content-sdk/blob/c6d79fb7cf099c2bccf76e3f383b969340251618/packages/core/src/tools/templating/components.ts#L281)

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
