[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / filterComponentsByType

# Function: filterComponentsByType()

> **filterComponentsByType**(`components`, `allowedTypes`): [`ComponentFileWithType`](../interfaces/ComponentFileWithType.md)[]

Defined in: [content/src/tools/templating/components.ts:160](https://github.com/Sitecore/content-sdk/blob/cb6406f86fa34d759a763a19ec61e60afcd2c74d/packages/content/src/tools/templating/components.ts#L160)

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
