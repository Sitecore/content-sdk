[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / updateComponent

# Function: updateComponent()

> **updateComponent**(`component`, `fields`, `params`): `void`

Defined in: [packages/core/src/editing/design-library.ts:189](https://github.com/Sitecore/content-sdk/blob/4ac6c0b08031d0f8d3e3046612ef022854196c98/packages/core/src/editing/design-library.ts#L189)

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
