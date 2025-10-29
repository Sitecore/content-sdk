[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / getComponentListWithTypes

# Function: getComponentListWithTypes()

> **getComponentListWithTypes**(`paths`, `exclude?`, `includeVariants?`, `routerType?`): [`ComponentFileWithType`](../interfaces/ComponentFileWithType.md)[]

Defined in: [packages/core/src/tools/templating/components.ts:331](https://github.com/Sitecore/content-sdk/blob/ecf73abb0aeb2c4507439ed7674a8269fe6542c9/packages/core/src/tools/templating/components.ts#L331)

Get list of components with detected types (server, client, or universal).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `paths` | `string`[] | Paths to search for components |
| `exclude?` | `string`[] | Paths and glob patterns to exclude from final result |
| `includeVariants?` | `boolean` | Whether to include variant components |
| `routerType?` | [`RouterType`](../type-aliases/RouterType.md) | Optional router type override for type detection. Auto-detected if not provided. |

## Returns

[`ComponentFileWithType`](../interfaces/ComponentFileWithType.md)[]

Array of components with their detected types
