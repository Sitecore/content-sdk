[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / updateComponent

# Function: updateComponent()

> **updateComponent**(`component`, `fields`, `params`): `void`

Defined in: [packages/core/src/editing/design-library.ts:189](https://github.com/Sitecore/content-sdk/blob/3ca8429b451816c5b357bf7ad37b7b8d995cee29/packages/core/src/editing/design-library.ts#L189)

**`Internal`**

Updates a component's fields and params with the provided values.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `component` | [`ComponentRendering`](../../layout/interfaces/ComponentRendering.md)\<[`ComponentFields`](../../layout/interfaces/ComponentFields.md)\> | The component to update. |
| `fields` | `undefined` \| [`ComponentFields`](../../layout/interfaces/ComponentFields.md) | The fields to merge into the component. |
| `params` | `undefined` \| [`ComponentParams`](../../layout/interfaces/ComponentParams.md) | The params to merge into the component. |

## Returns

`void`
