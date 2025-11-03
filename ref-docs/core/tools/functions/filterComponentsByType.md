[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / filterComponentsByType

# Function: filterComponentsByType()

> **filterComponentsByType**(`components`, `allowedTypes`): [`ComponentFileWithType`](../interfaces/ComponentFileWithType.md)[]

Defined in: [packages/core/src/tools/templating/components.ts:352](https://github.com/Sitecore/content-sdk/blob/3b1b6ea0a30c0e87321117e7d5fb40b7ab02cba7/packages/core/src/tools/templating/components.ts#L352)

Filters components by their detected type.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `components` | [`ComponentFileWithType`](../interfaces/ComponentFileWithType.md)[] | Array of components with types |
| `allowedTypes` | [`ComponentType`](../type-aliases/ComponentType.md)[] | Array of allowed component types to filter by |

## Returns

[`ComponentFileWithType`](../interfaces/ComponentFileWithType.md)[]

Filtered array containing only components matching allowed types
