[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / updateComponent

# Function: updateComponent()

> **updateComponent**(`component`, `fields`, `params`): `void`

Defined in: [content/src/editing/design-library.ts:204](https://github.com/Sitecore/content-sdk/blob/fbd07f45d77bcc00772e33d09bde850e688b09b2/packages/content/src/editing/design-library.ts#L204)

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
