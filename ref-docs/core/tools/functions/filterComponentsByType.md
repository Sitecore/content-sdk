[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / filterComponentsByType

# Function: filterComponentsByType()

> **filterComponentsByType**(`components`, `allowedTypes`): [`ComponentFileWithType`](../interfaces/ComponentFileWithType.md)[]

Defined in: [packages/core/src/tools/templating/components.ts:160](https://github.com/Sitecore/content-sdk/blob/4ac6c0b08031d0f8d3e3046612ef022854196c98/packages/core/src/tools/templating/components.ts#L160)

**`Internal`**

Filters components by their detected type.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `components` | [`ComponentFileWithType`](../interfaces/ComponentFileWithType.md)[] | Array of components with types |
| `allowedTypes` | [`ComponentType`](../type-aliases/ComponentType.md)[] | Array of allowed component types to filter by |

## Returns

[`ComponentFileWithType`](../interfaces/ComponentFileWithType.md)[]

Filtered array containing only components matching allowed types
