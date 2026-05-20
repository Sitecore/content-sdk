[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / updateComponent

# Function: updateComponent()

> **updateComponent**(`component`, `fields`, `params`): `void`

Defined in: [content/src/editing/design-library.ts:204](https://github.com/Sitecore/content-sdk/blob/3b25a6307ef74f6ab7da606ec8b04e5fcb108ad3/packages/content/src/editing/design-library.ts#L204)

**`Internal`**

Updates a component's fields and params with the provided values.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `component` | [`ComponentRendering`](../../layout/interfaces/ComponentRendering.md)\<[`ComponentFields`](../../layout/interfaces/ComponentFields.md)\> | The component to update. |
| `fields` | [`ComponentFields`](../../layout/interfaces/ComponentFields.md) \| `undefined` | The fields to merge into the component. |
| `params` | [`ComponentParams`](../../layout/interfaces/ComponentParams.md) \| `undefined` | The params to merge into the component. |

## Returns

`void`
